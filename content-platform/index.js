const {ImageService} = require('./services/imageService');
const {AudioService} = require('./services/audioService');
const {TTSService} = require('./services/ttsService');
const {VideoService} = require('./services/videoService');
const {Cache} = require('./lib/cache');
const {QuotaManager} = require('./lib/quota');
const {EventEmitter} = require('events');

async function createContent(prompt, progressEmitter) {
  const cache = new Cache('cache');
  const quota = new QuotaManager(5); // each service max 5 calls

  const imageService = new ImageService({cache, quota, progress: progressEmitter});
  const audioService = new AudioService({cache, quota, progress: progressEmitter});
  const ttsService = new TTSService({cache, quota, progress: progressEmitter});
  const videoService = new VideoService({cache, quota, progress: progressEmitter});

  progressEmitter.emit('update', 'Starting generation');

  const images = await imageService.generate(prompt);

  // audio and narration can run in parallel
  const [music, narration] = await Promise.all([
    audioService.generate(prompt),
    ttsService.generate(prompt)
  ]);

  const video = await videoService.generate({prompt, images, music, narration});

  progressEmitter.emit('update', 'Video created: ' + video);
  return video;
}

if (require.main === module) {
  const prompt = process.argv.slice(2).join(' ') || 'Sample prompt';
  const progress = new EventEmitter();
  progress.on('update', msg => console.log('[progress]', msg));
  createContent(prompt, progress).catch(err => {
    console.error(err);
  });
}

module.exports = {createContent};

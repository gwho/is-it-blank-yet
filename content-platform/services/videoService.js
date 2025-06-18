const {Worker} = require('worker_threads');
const path = require('path');

class VideoService {
  constructor({cache, quota, progress}) {
    this.cache = cache;
    this.quota = quota;
    this.progress = progress;
    this.name = 'VideoService';
  }

  async generate({prompt, images, music, narration}) {
    this.quota.check(this.name);
    const key = `video-${prompt}`;
    if (this.cache.has(key)) {
      this.progress.emit('update', 'Video cached');
      return this.cache.get(key);
    }
    this.progress.emit('update', 'Composing video');
    const result = await this.runWorker({prompt});
    const buffer = Buffer.from(`video for ${prompt}`);
    this.cache.set(key, buffer);
    return buffer;
  }

  runWorker(data) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path.join(__dirname, '../worker/videoWorker.js'), {workerData: data});
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', code => {
        if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
      });
    });
  }
}

module.exports = {VideoService};

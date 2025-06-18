class AudioService {
  constructor({cache, quota, progress}) {
    this.cache = cache;
    this.quota = quota;
    this.progress = progress;
    this.name = 'AudioService';
  }

  async *streamGenerate(prompt) {
    this.quota.check(this.name);
    const key = `audio-${prompt}`;
    if (this.cache.has(key)) {
      this.progress.emit('update', 'Audio cached');
      yield this.cache.get(key);
      return;
    }
    this.progress.emit('update', 'Streaming background music');
    for (let i=0;i<3;i++) {
      await new Promise(r => setTimeout(r, 500));
      yield Buffer.from(`chunk${i} for ${prompt}`);
    }
  }

  async generate(prompt) {
    const chunks = [];
    for await (const chunk of this.streamGenerate(prompt)) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    this.cache.set(`audio-${prompt}`, buffer);
    return buffer;
  }
}

module.exports = {AudioService};

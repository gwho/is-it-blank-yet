class TTSService {
  constructor({cache, quota, progress}) {
    this.cache = cache;
    this.quota = quota;
    this.progress = progress;
    this.name = 'TTSService';
  }

  async generate(prompt) {
    this.quota.check(this.name);
    const key = `tts-${prompt}`;
    if (this.cache.has(key)) {
      this.progress.emit('update', 'TTS cached');
      return this.cache.get(key);
    }
    this.progress.emit('update', 'Generating narration');
    await new Promise(r => setTimeout(r, 1200));
    const buffer = Buffer.from(`speech for ${prompt}`);
    this.cache.set(key, buffer);
    return buffer;
  }
}

module.exports = {TTSService};

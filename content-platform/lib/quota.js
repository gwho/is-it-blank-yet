class QuotaManager {
  constructor(limit) {
    this.limit = limit;
    this.usage = new Map();
  }

  check(serviceName) {
    const used = this.usage.get(serviceName) || 0;
    if (used >= this.limit) {
      throw new Error(`Quota exceeded for ${serviceName}`);
    }
    this.usage.set(serviceName, used + 1);
  }
}

module.exports = {QuotaManager};

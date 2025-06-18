const fs = require('fs');
const path = require('path');

class Cache {
  constructor(dir) {
    this.dir = dir;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }
  }

  _path(key) {
    return path.join(this.dir, encodeURIComponent(key));
  }

  has(key) {
    return fs.existsSync(this._path(key));
  }

  get(key) {
    const p = this._path(key);
    if (fs.existsSync(p)) {
      return fs.readFileSync(p);
    }
    return null;
  }

  set(key, buffer) {
    fs.writeFileSync(this._path(key), buffer);
  }
}

module.exports = {Cache};

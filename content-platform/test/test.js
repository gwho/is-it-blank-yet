const assert = require('assert');
const {EventEmitter} = require('events');
const {createContent} = require('../index');

(async () => {
  const progress = new EventEmitter();
  const logs = [];
  progress.on('update', msg => logs.push(msg));
  const buffer = await createContent('hello world', progress);
  assert(buffer instanceof Buffer);
  assert(logs.includes('Video created: ' + buffer));
  console.log('test passed');
})().catch(err => {
  console.error('test failed', err);
  process.exit(1);
});

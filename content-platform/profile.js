const {EventEmitter} = require('events');
const {createContent} = require('./index');

(async () => {
  const progress = new EventEmitter();
  progress.on('update', msg => console.log('[progress]', msg));
  console.time('create');
  await createContent('profiling demo', progress);
  console.timeEnd('create');
})();

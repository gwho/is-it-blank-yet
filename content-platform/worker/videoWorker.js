const {parentPort, workerData} = require('worker_threads');

function heavyTask(data) {
  // simulate heavy CPU bound work
  const start = Date.now();
  while (Date.now() - start < 500) {
    Math.sqrt(Math.random());
  }
  return {status: 'done', prompt: data.prompt};
}

const result = heavyTask(workerData);
parentPort.postMessage(result);

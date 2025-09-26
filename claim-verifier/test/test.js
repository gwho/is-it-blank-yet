const {verifyClaim} = require('..');
const assert = require('assert');
(async () => {
  if (!process.env.BRIGHTDATA_API_KEY || !process.env.OPENAI_API_KEY) {
    console.log('Skipping test: missing API keys');
    return;
  }
  const result = await verifyClaim('The sky is blue');
  assert(result.verdict);
  console.log('verdict:', result.verdict);
})().catch(err => {console.error(err); process.exit(1);});

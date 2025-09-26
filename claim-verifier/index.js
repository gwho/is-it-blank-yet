const axios = require('axios');
const {OpenAI} = require('openai');

async function searchClaim(claim) {
  const apiKey = process.env.BRIGHTDATA_API_KEY;
  if (!apiKey) throw new Error('BRIGHTDATA_API_KEY not set');
  const url = `https://serp.brightdata.com/search?engine=google&q=${encodeURIComponent(claim)}&key=${apiKey}`;
  const res = await axios.get(url);
  return res.data.organic || [];
}

async function analyzeResults(claim, results) {
  const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
  const messages = [
    {role: 'system', content: 'You check evidence from search results and determine if the claim is supported. Respond with JSON {verdict, confidence, justification}.'},
    {role: 'user', content: `Claim: ${claim}\nSearch Results:\n${results.map(r => r.title + '\n' + r.snippet).join('\n')}\n`}];
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0
  });
  const text = completion.choices[0].message.content;
  try {
    return JSON.parse(text);
  } catch {
    return {verdict: 'unknown', confidence: 0, justification: text};
  }
}

async function verifyClaim(claim) {
  const results = await searchClaim(claim);
  return analyzeResults(claim, results.slice(0,5));
}

if (require.main === module) {
  const claim = process.argv.slice(2).join(' ');
  if (!claim) {
    console.error('Usage: node index.js <claim>');
    process.exit(1);
  }
  verifyClaim(claim).then(v => console.log(JSON.stringify(v, null, 2))).catch(err => {
    console.error('Error', err.message);
    process.exit(1);
  });
}

module.exports = {verifyClaim};

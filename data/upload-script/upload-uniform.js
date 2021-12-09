#! /usr/bin/env node

const http = require('http');
const { argv } = require('process');
const { createInterface } = require('readline');

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

let user, password;
const uniform = {};

const thenAsk = (query, cb, next) => {
  readline.question(query, res => {
    cb(res);
    next();
  });
}

thenAsk("Upload user:", usr => user = usr, () =>
thenAsk("Upload pwr:", pw => password = pw, () =>
thenAsk("season:", season => uniform.season = +season, () =>
thenAsk("week:", week => uniform.week = +week, () =>
thenAsk("helmet:", helmet => uniform.helmetColor = helmet, () =>
thenAsk("helmetDetail:", helmet => uniform.helmetDetail = helmet.length ? helmet : null, () =>
thenAsk("jersey:", jersey => uniform.jerseyColor = jersey, () =>
thenAsk("jerseyLetterColor:", j => uniform.jerseyLetterColor = j.length ? j : null, () =>
thenAsk("jerseyStripeDetail:", j => uniform.jerseyStripeDetail = j.length ? j : null, () =>
thenAsk("pants:", p => uniform.pantsColor = p, () =>
thenAsk("pantsDetail:", p => uniform.pantsDetail = p.length ? p : null, () =>
thenAsk("special:", s => uniform.special = s.length ? s : null, () =>
thenAsk("tweetUrl:", url => uniform.tweetUrl = url.length ? url : null, () => {
  console.log(uniform);
  thenAsk(`send?[y/N]`, resp => resp === 'y' ? sendRequest() : console.log('canceled'),
  () => readline.close());
})))))))))))));

function sendRequest() {
  const result = JSON.stringify(uniform);
  const req = http.request(argv[2], {
    auth: `${user}:${password}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': result.length,
    },
  }, res => {
    if (res.statusCode !== 200) return console.error(res.statusCode, res.statusMessage);
    const count = res.headers['X-Rows-Affected'];
    console.log(`post success, ${count} rows updated`);
  });

  req.write(result);
  req.end();
}

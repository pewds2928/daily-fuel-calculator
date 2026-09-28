const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
}

function calculate(input) {
  const { age, sex, height, weight, activity } = input;
  const errors = [];
  if (!Number.isInteger(age) || age < 18 || age > 100) errors.push('Age must be a whole number between 18 and 100.');
  if (!['female', 'male'].includes(sex)) errors.push('Choose female or male for this equation.');
  if (!Number.isFinite(height) || height < 120 || height > 230) errors.push('Height must be between 120 and 230 cm.');
  if (!Number.isFinite(weight) || weight < 35 || weight > 250) errors.push('Weight must be between 35 and 250 kg.');
  const activityFactors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
  if (!(activity in activityFactors)) errors.push('Choose a valid activity level.');
  if (errors.length) return { errors };

  // Mifflin–St Jeor estimate; activity factor approximates total daily energy use.
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);
  const maintenance = Math.round(bmr * activityFactors[activity]);
  return {
    result: {
      bmr: Math.round(bmr), maintenance,
      goals: { lose: Math.max(1200, maintenance - 300), maintain: maintenance, gain: maintenance + 250 },
      note: 'These are estimates, not a diagnosis or a prescription. Individual needs vary.'
    }
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'POST' && url.pathname === '/api/calculate') {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 10_000) req.destroy(); });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const output = calculate(parsed);
        if (output.errors) return json(res, 400, { errors: output.errors });
        json(res, 200, output.result);
      } catch { json(res, 400, { errors: ['Send a valid JSON request.'] }); }
    });
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'Method not allowed.' });
  const requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const file = path.resolve(ROOT, 'public', `.${requested}`);
  if (!file.startsWith(path.resolve(ROOT, 'public') + path.sep)) return json(res, 403, { error: 'Forbidden.' });
  fs.readFile(file, (error, data) => {
    if (error) return json(res, 404, { error: 'Not found.' });
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
});

server.listen(PORT, () => console.log(`Daily Fuel is running at http://localhost:${PORT}`));

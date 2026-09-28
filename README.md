# Daily Fuel

A small, responsive calorie calculator with a plain Node.js backend and no runtime dependencies.

## Run it

Requires Node.js 18 or newer.

```sh
npm start
```

Then open <http://localhost:3000>. To use a different port, set `PORT` before starting the server.

## API

`POST /api/calculate` accepts JSON with `age` (18–100), `sex` (`female` or `male`), `height` (cm), `weight` (kg), and `activity` (`sedentary`, `light`, `moderate`, `active`, or `veryActive`). It returns estimated BMR, maintenance calories, and gradual loss/maintain/gain reference targets. Invalid input returns HTTP 400 with an `errors` array.

The estimate uses the Mifflin–St Jeor equation and a standard activity multiplier. It is general information, not personalized medical advice. The app does not store submitted data.

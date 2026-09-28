const form = document.querySelector('#calculator-form');
const errorBox = document.querySelector('#form-error');
const number = value => new Intl.NumberFormat().format(value);

// Mifflin–St Jeor estimate; activity factor approximates total daily energy use.
const ACTIVITY_FACTORS = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };

function calculate(input) {
  const { age, sex, height, weight, activity } = input;
  const errors = [];
  if (!Number.isInteger(age) || age < 18 || age > 100) errors.push('Age must be a whole number between 18 and 100.');
  if (!['female', 'male'].includes(sex)) errors.push('Choose female or male for this equation.');
  if (!Number.isFinite(height) || height < 120 || height > 230) errors.push('Height must be between 120 and 230 cm.');
  if (!Number.isFinite(weight) || weight < 35 || weight > 250) errors.push('Weight must be between 35 and 250 kg.');
  if (!(activity in ACTIVITY_FACTORS)) errors.push('Choose a valid activity level.');
  if (errors.length) return { errors };

  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);
  const maintenance = Math.round(bmr * ACTIVITY_FACTORS[activity]);
  return {
    bmr: Math.round(bmr),
    maintenance,
    goals: { lose: Math.max(1200, maintenance - 300), maintain: maintenance, gain: maintenance + 250 },
    note: 'These are estimates, not a diagnosis or a prescription. Individual needs vary.'
  };
}

if (!form || !errorBox) {
  // Calculator markup missing — nothing to wire up.
} else {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    errorBox.textContent = '';
    const data = new FormData(form);
    const payload = {
      age: Number(data.get('age')),
      sex: data.get('sex'),
      height: Number(data.get('height')),
      weight: Number(data.get('weight')),
      activity: data.get('activity')
    };
    const result = calculate(payload);
    if (result.errors) {
      errorBox.textContent = result.errors.join(' ');
      return;
    }
    document.querySelector('#maintenance').textContent = number(result.maintenance);
    document.querySelector('#lose').innerHTML = `${number(result.goals.lose)} <small>kcal</small>`;
    document.querySelector('#maintain').innerHTML = `${number(result.goals.maintain)} <small>kcal</small>`;
    document.querySelector('#gain').innerHTML = `${number(result.goals.gain)} <small>kcal</small>`;
    document.querySelector('#bmr').textContent = `${number(result.bmr)} kcal`;
    document.querySelector('#disclaimer').textContent = result.note;
  });

  if (document.readyState !== 'loading') {
    form.requestSubmit();
  } else {
    document.addEventListener('DOMContentLoaded', () => form.requestSubmit());
  }
}

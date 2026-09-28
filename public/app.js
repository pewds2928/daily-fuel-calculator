const form = document.querySelector('#calculator-form');
const errorBox = document.querySelector('#form-error');
const number = value => new Intl.NumberFormat().format(value);

if (!form || !errorBox) return;

form.addEventListener('submit', async event => {
  event.preventDefault();
  errorBox.textContent = '';
  const data = new FormData(form);
  const payload = { age: Number(data.get('age')), sex: data.get('sex'), height: Number(data.get('height')), weight: Number(data.get('weight')), activity: data.get('activity') };
  try {
    const response = await fetch('/api/calculate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) { errorBox.textContent = result.errors?.join(' ' ) || 'We couldn’t calculate that. Check your details and try again.'; return; }
    document.querySelector('#maintenance').textContent = number(result.maintenance);
    document.querySelector('#lose').innerHTML = `${number(result.goals.lose)} <small>kcal</small>`;
    document.querySelector('#maintain').innerHTML = `${number(result.goals.maintain)} <small>kcal</small>`;
    document.querySelector('#gain').innerHTML = `${number(result.goals.gain)} <small>kcal</small>`;
    document.querySelector('#bmr').textContent = `${number(result.bmr)} kcal`;
    document.querySelector('#disclaimer').textContent = result.note;
  } catch { errorBox.textContent = 'Could not reach the calculator. Please try again.'; }
});

if (document.readyState !== 'loading') {
  form.requestSubmit();
} else {
  document.addEventListener('DOMContentLoaded', () => form.requestSubmit());
}

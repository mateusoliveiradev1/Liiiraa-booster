import './style.css';

document.getElementById('btn').addEventListener('click', async () => {
  const output = document.getElementById('output');
  try {
    const result = await window.api.runScript('hello');
    output.textContent = result;
  } catch (err) {
    output.textContent = 'Error: ' + err;
  }
});

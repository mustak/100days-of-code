const MAX_COUNT = 45;
const userInput = document.getElementById('value');
const result = document.getElementById('result');

let currentCount = userInput.value.length;

result.innerText = `${currentCount}\\${MAX_COUNT}`;

userInput.addEventListener('keyup', (e) => {
  currentCount = userInput.value.length;
  result.innerHTML = `${currentCount}\\${MAX_COUNT}`;
});

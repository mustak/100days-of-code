/*
 * 1. Calculate Sum
 */
const userInput = document.getElementById('user-number');
const btnCalculator = document.querySelector('#calculator button');
const sumResult = document.getElementById('calculated-sum');

userInput.addEventListener('input', () => {
  sumResult.style.display = 'none';
});

btnCalculator.addEventListener('click', () => {
  let sum = 0;

  for (let i = 0; i <= userInput.value; i++) {
    sum += i;
  }
  sumResult.textContent = sum;
  sumResult.style.display = 'block';

  console.log(sum);
});

/*
 * 2. Hoghlight links
 */
const btnHighlightLinks = document.querySelector('#highlight-links button');

btnHighlightLinks.addEventListener('click', () => {
  const allLinks = document.querySelectorAll('#highlight-links a');

  for (const link of allLinks) {
    link.classList.add('highlight');
  }
});

/*
 * 3.User Data
 */
const btnUserdata = document.querySelector('#user-data button');

btnUserdata.addEventListener('click', () => {
  const ulUserdata = document.getElementById('output-user-data');
  const userData = {
    fname: 'mustak',
    lname: 'yaqub',
    dob: new Date(1973, 10, 22),
  };
  for (const prop in userData) {
    const li = document.createElement('li');
    if (userData[prop] instanceof Date) {
      li.textContent = `${prop}: ${userData[prop].toLocaleDateString('')}`;
    } else {
      li.textContent = `${prop}: ${userData[prop]}`;
    }

    ulUserdata.appendChild(li);
  }
});

/*
 * 4.Statistics
 */
const btnStatistics = document.querySelector('#statistics button');

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

btnStatistics.addEventListener('click', () => {
  const userInput = document.getElementById('user-target-number');
  const userNumber = parseInt(userInput.value, 10);
  const listRolls = document.getElementById('dice-rolls');
  const outputRolls = document.getElementById('output-total-rolls');
  const targetNumber = document.getElementById('output-target-number');

  if (!Number.isInteger(userNumber)) {
    console.log('not  a number');
    return;
  }

  let countRolls = 1;
  let roll = rollDice();

  listRolls.innerHTML = '';

  while (roll !== userNumber) {
    const li = document.createElement('li');
    li.textContent = roll;
    listRolls.appendChild(li);

    roll = rollDice();
    countRolls++;
  }

  const li = document.createElement('li');
  li.textContent = roll;
  listRolls.appendChild(li);

  outputRolls.textContent = countRolls;
  targetNumber.textContent = userNumber;
});

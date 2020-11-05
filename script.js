const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const dateElement = document.getElementById('date-picker');

const countdownElement = document.getElementById('countdown');
const countdownElementTitle = document.getElementById('countdown-title');
const countdownElementBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeElement = document.getElementById('complete');
const completeElementInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

const SECOND = 1000, MINUTE = SECOND * 60, HOUR = MINUTE * 60, DAY = HOUR * 24;
const LOCALSTORAGEKEY = 'timer';

let countdownTitle; // string
let countdownDate; // date string yyyy-mm-dd
let countdownValue; // number - milliseconds
let countdownActive; // an interval ID which uniquely identifies the interval
// so you can remove it later by calling clearInterval()
let savedTimer;

/**
 * NOTE:
 * new Date() --> Date object
 * Thu Nov 05 2020 23:29:22 GMT+0530 (India Standard Time)
 * 
 * Date --> Date constructor
 * ƒ Date() { [native code] }
 * 
 * Date() --> Date string
 * "Thu Nov 05 2020 23:29:29 GMT+0530 (India Standard Time)"
 */

const today = new Date().toISOString().split("T")[0];
dateElement.setAttribute('min', today);

// Populate Countdown
function populateTimeElements(days, hours, minutes, seconds) {
  countdownElementTitle.textContent = countdownTitle;
  timeElements[0].textContent = days;
  timeElements[1].textContent = hours;
  timeElements[2].textContent = minutes;
  timeElements[3].textContent = seconds;
}

// Populate Countdown / Complete UI
function updateCountdownDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / DAY);
    const hours = Math.floor((distance % DAY) / HOUR);
    const minutes = Math.floor((distance % HOUR) / MINUTE);
    const seconds = Math.floor((distance % MINUTE) / SECOND);

    // Hide Input
    inputContainer.hidden = true;

    // If the countdown has ended, show complete
    if (distance < 0) {
      countdownElement.hidden = true;
      clearInterval(countdownActive);
      completeElementInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeElement.hidden = false;
    } else {
      // Else show the countdown in progress
      // Show Countdown
      countdownElement.hidden = false;
      completeElement.hidden = true;
      populateTimeElements(days, hours, minutes, seconds);
    }
  }, SECOND);
}

// Take value for Form input
function updateCountdown(event) {
  // Why do we need to do this?
  // It makes a network request to send the data
  // Because nothing is mentioned it ends up refreshing the page
  event.preventDefault(); // prevent it from submitting a form
  countdownTitle = event.srcElement[0].value;
  countdownDate = event.srcElement[1].value;
  savedTimer = {
    title: countdownTitle,
    date: countdownDate,
  };
  localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(savedTimer));
  if (countdownDate && countdownDate.length) {
    // Get number version of current date
    countdownValue = new Date(countdownDate).getTime();
    updateCountdownDOM();
  } else {
    alert('Please select a date to start the timer');
  }
  
}


// Reset all values
function resetTimer() {
  // Hide Countdowns, show Input
  countdownElement.hidden = true;
  inputContainer.hidden = false;
  completeElement.hidden = true;
  // stop the countdown
  clearInterval(countdownActive);
  // Reset values;
  countdownTitle = '';
  countdownValue = null;
  localStorage.removeItem(LOCALSTORAGEKEY);
}

// Restore timer from local storage
function restorePreviousTimer() {
  // Get timer from localStorage only if available
  const locallyStoredTimer = localStorage.getItem(LOCALSTORAGEKEY);
  if (locallyStoredTimer) {
    inputContainer.hidden = true;
    savedTimer = JSON.parse(locallyStoredTimer);
    countdownTitle = savedTimer.title;
    countdownDate = savedTimer.date;
    countdownValue = new Date(countdownDate).getTime();
    updateCountdownDOM();
  }
}

countdownForm.addEventListener('submit', updateCountdown);
countdownElementBtn.addEventListener('click', resetTimer);
completeBtn.addEventListener('click', resetTimer);

// On load, check localstorage
restorePreviousTimer();
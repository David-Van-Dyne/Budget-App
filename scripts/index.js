


let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const day = document.querySelector(".calendar-dates");
const currdate = document.querySelector(".calendar-current-date");
const prenexIcons = document.querySelectorAll(".calendar-navigation span");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let clickedDay = null;
let selectedDayElement = null;

const manipulate = () => {
  let dayone = new Date(year, month, 1).getDay();
  let lastdate = new Date(year, month + 1, 0).getDate();
  let dayend = new Date(year, month, lastdate).getDay();
  let monthlastdate = new Date(year, month, 0).getDate();

  let lit = "";

  for (let i = dayone; i > 0; i--) {
    lit += `<li class="inactive">${monthlastdate - i + 1}</li>`;
  }


  for (let i = 1; i <= lastdate; i++) {
    let isToday = (i === date.getDate()
      && month === new Date().getMonth()
      && year === new Date().getFullYear()) ? "active" : "";

    let highlightClass = (clickedDay === i) ? "highlight" : "";

    lit += `<li class="${isToday} ${highlightClass}" data-day="${i}">${i}</li>`;
  }


  for (let i = dayend; i < 6; i++) {
    lit += `<li class="inactive">${i - dayend + 1}</li>`;
  }

  currdate.innerText = `${months[month]} ${year}`;
  day.innerHTML = lit;

  addClickListenersToDays();
};


function addClickListenersToDays() {
  const allDays = day.querySelectorAll('li:not(.inactive)');
  allDays.forEach(li => {
    li.addEventListener('click', () => {
      if (selectedDayElement) {
        selectedDayElement.classList.remove('highlight');
      }

      li.classList.add('highlight');
      selectedDayElement = li;

      clickedDay = parseInt(li.getAttribute('data-day'));

      console.log('Clicked day:', clickedDay);
    });
  });
}

manipulate();

prenexIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    month = icon.id === "calendar-prev" ? month - 1 : month + 1;

    if (month < 0 || month > 11) {
      date = new Date(year, month, new Date().getDate());
      year = date.getFullYear();
      month = date.getMonth();
    } else {
      date = new Date();
    }

    clickedDay = null;
    selectedDayElement = null;

    manipulate();
  });
});


// Function to show/hide sections based on selected tab
function showSection(sectionId) {
  // Get all section containers
  const allSections = [
    document.querySelector('.home-wrapper'),
    document.querySelector('.income-wrapper'),
    document.querySelector('.expenses-wrapper'),
    document.querySelector('.savings-wrapper')
  ];

  // Hide all sections
  allSections.forEach(section => {
    if (section) {
      section.setAttribute('hidden', '');
    }
  });

  // Show the selected section
  if (sectionId === 'home-section') {
    const homeWrapper = document.querySelector('.home-wrapper');
    if (homeWrapper) homeWrapper.removeAttribute('hidden');
  } else if (sectionId === 'income-section') {
    const incomeWrapper = document.querySelector('.income-wrapper');
    if (incomeWrapper) incomeWrapper.removeAttribute('hidden');
  } else if (sectionId === 'expenses-section') {
    const expensesWrapper = document.querySelector('.expenses-wrapper');
    if (expensesWrapper) expensesWrapper.removeAttribute('hidden');
  } else if (sectionId === 'savings-section') {
    const savingsWrapper = document.querySelector('.savings-wrapper');
    if (savingsWrapper) savingsWrapper.removeAttribute('hidden');
  }
}

// Add event listeners to navigation tabs
document.addEventListener('DOMContentLoaded', () => {
  const tabLabels = document.querySelectorAll('.tab-label');

  tabLabels.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabLabels.forEach(t => t.classList.remove('active'));

      // Add active class to clicked tab
      tab.classList.add('active');

      // Get the section to show from data-tab attribute
      const sectionId = tab.getAttribute('data-tab');
      showSection(sectionId);
    });
  });
});

// Sends income data to the server to save
const sheaIncome = document.querySelector('.shea-income-button');
const sheaAmount = document.getElementById('shea-paycheck-amount');

async function updateSheaSetIncome() {
  const amount = parseFloat(sheaAmount.value);

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  try {
    // Send data to server
    const response = await fetch('/api/save-income', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ person: 'shea', amount: amount })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Income saved successfully:', result.data);
      alert(`Income of $${amount} saved successfully!`);
    }
  } catch (error) {
    console.error('Error saving income:', error);
    alert('Failed to save income');
  }
}

sheaIncome.addEventListener('click', function (e) {
  e.preventDefault();
  updateSheaSetIncome();
});

const daveIncome = document.querySelector('.dave-income-button');
const daveAmount = document.getElementById('dave-paycheck-amount');

async function updateDaveSetIncome() {
  const amount = parseFloat(daveAmount.value);

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  try {
    // Send data to server
    const response = await fetch('/api/save-income', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ person: 'dave', amount: amount })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Income saved successfully:', result.data);
      alert(`Income of $${amount} saved successfully!`);
    }
  } catch (error) {
    console.error('Error saving income:', error);
    alert('Failed to save income');
  }
}

daveIncome.addEventListener('click', function (e) {
  e.preventDefault();
  updateDaveSetIncome();
});


function fetchIncomeData() {
  fetch('/api/get-income')
    .then(response => response.json())
    .then(data => {
      sheaAmount.value = data.incomes && data.incomes.shea ? data.incomes.shea.amount : '';
      daveAmount.value = data.incomes && data.incomes.dave ? data.incomes.dave.amount : '';
    })
    .catch(error => {
      console.error('Error fetching income data:', error);
    });
}

// Fetch income data on page load
window.addEventListener('load', fetchIncomeData);

document.addEventListener('DOMContentLoaded', () => {
  const numCCFieldsInput = document.getElementById('creditcard-quantity');
  const fieldsCCContainer = document.getElementById('creditcard-details');

  // Listen for input changes
  numCCFieldsInput.addEventListener('input', generateFields);

  function generateFields() {
    // Get the current value and convert it to an integer
    const count = parseInt(numCCFieldsInput.value, 10);

    // Clear existing fields
    fieldsCCContainer.innerHTML = '';

    // Validate the input number
    if (isNaN(count) || count < 1 || count > 10) {
      return; // Exit if the number is invalid
    }

    // Loop to create the specified number of credit card fields
    for (let i = 1; i <= count; i++) {

      // Create a container for each credit card detail set
      const fieldPair = document.createElement('div');
      fieldPair.classList.add('creditcard-field-pair');

      // Create the label element
      const label = document.createElement('label');
      label.textContent = `Credit Card ${i}: `;
      // Associate label with input field
      label.setAttribute('for', `creditcard-${i}`);

      // Create the input element
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `creditcard-${i}`;
      input.name = `creditcard-${i}`;
      input.placeholder = 'Enter credit card amount';

      // Append label and input to the container
      fieldPair.appendChild(label);
      fieldPair.appendChild(input);

      // Append the container to the main fields container
      fieldsCCContainer.appendChild(fieldPair);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const numCCFieldsInput = document.getElementById('additional-loans-quantity');
  const fieldsCCContainer = document.getElementById('additional-loans-details');

  // Listen for input changes
  numCCFieldsInput.addEventListener('input', generateFields);

  function generateFields() {
    // Get the current value and convert it to an integer
    const count = parseInt(numCCFieldsInput.value, 10);

    // Clear existing fields
    fieldsCCContainer.innerHTML = '';

    // Validate the input number
    if (isNaN(count) || count < 1 || count > 10) {
      return; // Exit if the number is invalid
    }

    // Loop to create the specified number of additional loan fields
    for (let i = 1; i <= count; i++) {

      // Create a container for each additional loan detail set
      const fieldPair = document.createElement('div');
      fieldPair.classList.add('additional-loans-field-pair');

      // Create the label element
      const label = document.createElement('label');
      label.textContent = `Additional Loan ${i}: `;
      // Associate label with input field
      label.setAttribute('for', `additional-loan-${i}`);

      // Create the input element
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `additional-loan-${i}`;
      input.name = `additional-loan-${i}`;
      input.placeholder = 'Enter additional loan amount';

      // Append label and input to the container
      fieldPair.appendChild(label);
      fieldPair.appendChild(input);

      // Append the container to the main fields container
      fieldsCCContainer.appendChild(fieldPair);
    }
  }
});

// Add ability to scroll on the calendar to change the month
const calendarDates = document.querySelector('.calendar-dates');

calendarDates.addEventListener('wheel', (event) => {
  event.preventDefault();

  if (event.deltaY < 0) {
    // Scroll up - previous month
    month = month - 1;
  } else {
    // Scroll down - next month
    month = month + 1;
  }
  if (month < 0 || month > 11) {
    date = new Date(year, month, new Date().getDate());
    year = date.getFullYear();
    month = date.getMonth();
  } else {
    date = new Date();
  }
  clickedDay = null;
  selectedDayElement = null;
  manipulate();
});
// Determine which pay period we're currently in (1, 2, or 3) based on today's date
async function getCurrentPayPeriod() {
  const response = await fetch('/api/get-setup');
  const data = await response.json();

  const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;

  // Parse firstPayDate in local timezone to avoid UTC offset issues
  const firstPayDateStr = data.setup.shea.firstPayDate;
  const dateParts = firstPayDateStr.split(/[-\/]/);
  const firstPayDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate how many pay periods have passed since the first pay date
  const timeDiff = today.getTime() - firstPayDate.getTime();
  const periodsPassed = Math.floor(timeDiff / twoWeeksMs);

  // Determine current pay period start and end
  const currentPeriodStart = new Date(firstPayDate.getTime() + (periodsPassed * twoWeeksMs));
  const currentPeriodEnd = new Date(currentPeriodStart.getTime() + (13 * 24 * 60 * 60 * 1000));

  // Get current month's paydays to determine which period (1st, 2nd, or 3rd of the month)
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Find which pay period number this is within the current month
  let payPeriodNumber = 0;
  let checkDate = new Date(currentYear, currentMonth, 1);
  let tempPayday = new Date(firstPayDate);

  // Move tempPayday to before or at the start of the month
  while (tempPayday < checkDate) {
    tempPayday = new Date(tempPayday.getTime() + twoWeeksMs);
  }

  // Count which pay period we're in for this month
  while (tempPayday.getMonth() === currentMonth) {
    payPeriodNumber++;
    if (tempPayday <= today && today < new Date(tempPayday.getTime() + twoWeeksMs)) {
      break; // Found our current period
    }
    tempPayday = new Date(tempPayday.getTime() + twoWeeksMs);
  }

  console.log('Current pay period:', payPeriodNumber, 'Start:', currentPeriodStart, 'End:', currentPeriodEnd);
  return {
    periodNumber: payPeriodNumber,
    startDate: currentPeriodStart,
    endDate: currentPeriodEnd
  };
}

// Show only the current pay period
async function displayCurrentPayPeriod() {
  const first = document.querySelectorAll('.first-pay-period')[0];
  const second = document.querySelectorAll('.second-pay-period')[0];
  const third = document.querySelectorAll('.third-pay-period')[0];

  const currentPeriod = await getCurrentPayPeriod();

  // Hide all periods first
  // if (first) first.setAttribute('hidden', '');
  // if (second) second.setAttribute('hidden', '');
  // if (third) third.setAttribute('hidden', '');

  // Show only the current period
  if (currentPeriod.periodNumber === 1 && first) {
    first.removeAttribute('hidden');
    console.log('Displaying first pay period');
  } else if (currentPeriod.periodNumber === 2 && second) {
    second.removeAttribute('hidden');
    console.log('Displaying second pay period');
  } else if (currentPeriod.periodNumber === 3 && third) {
    third.removeAttribute('hidden');
    console.log('Displaying third pay period');
  } else if (first) {
    // Default to first if something went wrong
    first.removeAttribute('hidden');
  }

  return currentPeriod;
}

// Fetch and display the current pay period based on next pay date
async function initialize() {
  const response = await fetch('/api/get-setup');
  if (response.ok) {
    const currentPeriod = await displayCurrentPayPeriod();

    // Display current pay period dates in the UI
    const payPeriodContainer = document.querySelector('.pay-period-container');
    if (payPeriodContainer && currentPeriod) {
      payPeriodContainer.innerHTML = `
        <h3>Pay Period ${currentPeriod.periodNumber}: ${currentPeriod.startDate.toDateString()} - ${currentPeriod.endDate.toDateString()}</h3>`;
    }
  }
}
initialize();


async function getPayPeriod() {
  try {
    const response = await fetch('/api/get-setup');
    if (response.ok) {
      const data = await response.json();
      const nextPayDate = data.setup.shea.nextPayDate;

      // Current pay period ends the day before next pay date
      const endDate = new Date(nextPayDate);
      endDate.setDate(endDate.getDate());

      // Start date is 14 days before end date (for bi-weekly)
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 13);

      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);

      // Display pay period in the UI
      const payPeriodContainer = document.getElementsByClassName('pay-period-container');
      if (payPeriodContainer.length > 0) {
        payPeriodContainer[0].innerHTML = `
        <h3> Pay Period: ${startDate.toDateString()} - ${endDate.toDateString()}</h3>`;
      }

      return { start: startDate, end: endDate };
    }
  } catch (error) {
    console.error('Error:', error);
  }
  return null;
}


// Check if we need to update the next pay date
async function checkAndUpdateNextPayDate() {
  try {
    const response = await fetch('/api/get-setup');
    if (response.ok) {
      const data = await response.json();
      const sheaNextPayDate = new Date(data.setup.shea.nextPayDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // If next pay date has passed, update it
      if (sheaNextPayDate < today) {
        // Calculate new next pay date (14 days after the old one)
        const newDate = new Date(sheaNextPayDate);
        while (newDate < today) {
          newDate.setDate(newDate.getDate() + 14);
        }

        const newNextPayDate = newDate.toISOString().split('T')[0];

        const updateResponse = await fetch('/api/update-next-pay-date', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ person: 'shea', nextPayDate: newNextPayDate })
        });

        if (updateResponse.ok) {
          console.log('Next pay date updated to:', newNextPayDate);
          // Refresh the display
          await getPayPeriod();
        }
      }
    }
  } catch (error) {
    console.error('Error checking/updating next pay date:', error);
  }
}


// Check on page load and every day
checkAndUpdateNextPayDate();
setInterval(checkAndUpdateNextPayDate, 24 * 60 * 60 * 1000); // Check every day

// 


// Function to show/hide sections based on selected tab
function showSection(sectionId) {
  const sectionMap = {
    'home-section': '.home-wrapper',
    'income-section': '.income-wrapper',
    'expenses-section': '.expenses-wrapper',
    'savings-section': '.savings-wrapper'
  };

  // Hide all sections and show selected one
  Object.values(sectionMap).forEach(selector => {
    const section = document.querySelector(selector);
    if (section) {
      section.setAttribute('hidden', '');
    }
  });

  const selectedSelector = sectionMap[sectionId];
  if (selectedSelector) {
    const selectedSection = document.querySelector(selectedSelector);
    if (selectedSection) selectedSection.removeAttribute('hidden');
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


// Consolidated function to save income data
const sheaIncome = document.querySelector('.shea-income-button');
const sheaAmount = document.getElementById('shea-paycheck-amount');
const daveIncome = document.querySelector('.dave-income-button');
const daveAmount = document.getElementById('dave-paycheck-amount');

async function updateIncome(person, amountInput) {
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  try {
    const response = await fetch('/api/save-income', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ person, amount })
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

sheaIncome.addEventListener('click', (e) => {
  e.preventDefault();
  updateIncome('shea', sheaAmount);
});

daveIncome.addEventListener('click', (e) => {
  e.preventDefault();
  updateIncome('dave', daveAmount);
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


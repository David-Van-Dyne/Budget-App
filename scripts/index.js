// Fetch and display the current pay period based on next pay date
async function initialize() {
  const response = await fetch('/api/get-setup');
  if (response.ok) {
    const data = await response.json();
    const nextPayDate = data.setup.shea.nextPayDate;
    await getPayPeriod(nextPayDate);
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


// Check on page load and every hour
checkAndUpdateNextPayDate();
setInterval(checkAndUpdateNextPayDate, 60 * 60 * 1000); // Check every hour


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


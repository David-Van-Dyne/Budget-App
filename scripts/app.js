// Main application initialization
// This file coordinates all modules and initializes the app

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

    // Populate bill amounts after pay period is displayed
    populateBillAmounts();

    // Calculate total after populating
    setTimeout(() => calculateTotalExpenses(), 100);
  }
}

// Initialize the application
initialize();

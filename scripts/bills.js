// Bill management and calculations

// Set bill amount values on page load
function populateBillAmounts() {
  // Get all bill inputs by their classes (querySelectorAll to get all instances)
  const mortgages = document.querySelectorAll('.mortgage-amount');
  const insurances = document.querySelectorAll('.insurance-amount');
  const heats = document.querySelectorAll('.heat-amount');
  const electrics = document.querySelectorAll('.electric-amount');
  const internets = document.querySelectorAll('.internet-amount');
  const cells = document.querySelectorAll('.cell-amount');
  const carPayments = document.querySelectorAll('.car-payment-amount');
  const groceriesInputs = document.querySelectorAll('.groceries-amount');
  const carGases = document.querySelectorAll('.car-gas-amount');
  const allowances = document.querySelectorAll('.allowance-amount');
  const sheaPockets = document.querySelectorAll('.shea-pocket-amount');
  const davePockets = document.querySelectorAll('.dave-pocket-amount');
  const sheaDebts = document.querySelectorAll('.shea-debt-amount');
  const aC = document.querySelectorAll('.a-c-amount');

  // Set default values for all instances if fields are empty
  mortgages.forEach(input => { if (!input.value) input.value = 1909; });
  insurances.forEach(input => { if (!input.value) input.value = 150; });
  heats.forEach(input => { if (!input.value) input.value = 100; });
  electrics.forEach(input => { if (!input.value) input.value = 262; });
  internets.forEach(input => { if (!input.value) input.value = 130; });
  cells.forEach(input => { if (!input.value) input.value = 333; });
  carPayments.forEach(input => { if (!input.value) input.value = 642; });
  groceriesInputs.forEach(input => { if (!input.value) input.value = 600; });
  carGases.forEach(input => { if (!input.value) input.value = 150; });
  allowances.forEach(input => { if (!input.value) input.value = 100; });
  sheaPockets.forEach(input => { if (!input.value) input.value = 200; });
  davePockets.forEach(input => { if (!input.value) input.value = 200; });
  sheaDebts.forEach(input => { if (!input.value) input.value = 206; });
  aC.forEach(input => { if (!input.value) input.value = 333; });
}

// Add up all bills for the current pay period, display total in total expenses field
function calculateTotalExpenses() {
  let total = 0;
  console.log('Calculating total expenses...');

  // Find the visible pay period section
  const firstPeriod = document.querySelector('.first-pay-period');
  const secondPeriod = document.querySelector('.second-pay-period');
  const thirdPeriod = document.querySelector('.third-pay-period');

  let visiblePeriod = null;
  if (firstPeriod && !firstPeriod.hasAttribute('hidden')) {
    visiblePeriod = firstPeriod;
    console.log('Calculating for first pay period');
  } else if (secondPeriod && !secondPeriod.hasAttribute('hidden')) {
    visiblePeriod = secondPeriod;
    console.log('Calculating for second pay period');
  } else if (thirdPeriod && !thirdPeriod.hasAttribute('hidden')) {
    visiblePeriod = thirdPeriod;
    console.log('Calculating for third pay period');
  }

  if (!visiblePeriod) {
    console.log('No visible pay period found');
    return;
  }

  // Get all bill amount inputs within the visible pay period only
  const billInputs = visiblePeriod.querySelectorAll('[class$="-amount"]');

  billInputs.forEach(input => {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
      console.log(`Adding ${value} from ${input.className}, subtotal: ${total}`);
      total += value;
    }
  });

  console.log(`Final total: ${total}`);

  const totalExpensesField = document.getElementById('total-expenses');
  if (totalExpensesField) {
    totalExpensesField.value = total.toFixed(2);
  }
}

// Add event listeners to bill amount inputs to recalculate total on change
document.addEventListener('DOMContentLoaded', () => {
  // Wait for initialization to complete before setting up event listeners
  setTimeout(() => {
    const billInputs = document.querySelectorAll('[class$="-amount"]');
    billInputs.forEach(input => {
      input.addEventListener('input', calculateTotalExpenses);
    });
    // Initial calculation after bills are populated
    calculateTotalExpenses();
  }, 500);
});

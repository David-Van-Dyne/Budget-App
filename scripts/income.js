// Income management functionality

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

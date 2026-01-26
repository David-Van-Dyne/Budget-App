// Get the modal
let modal = document.getElementById("setupModal");

// Get the button that closes the modal
let closeBtn = document.getElementById("submit-setup");
let skipBtn = document.getElementById("skip-setup");

// Function to open the modal
function openModal() {
  modal.style.display = "flex";
}

// When the user clicks submit, close the modal
closeBtn.onclick = function () {
  modal.style.display = "none";
}

skipBtn.onclick = function () {
  modal.style.display = "none";
}

// When the user clisks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Open the modal when the page loads
window.onload = function () {
  openModal();
}

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

// Send setup data to server to save
document.addEventListener('DOMContentLoaded', () => {
  const setupForm = document.getElementById('setup-form');

  if (!setupForm) {
    return; // Exit if form doesn't exist on this page
  }

  setupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(setupForm);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // Setup successful, hide modal
        modal.style.display = "none";
      } else {
        console.error('Setup failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during setup:', error);
    }
  });
});

async function updateSetupInfo() {
  try {
    const response = await fetch('/api/get-setup');
    if (response.ok) {
      const data = await response.json();
      const setupNameElement = document.getElementById('setup-name');
      if (setupNameElement) {
        setupNameElement.textContent = data.name || '';
      }
    } else {
      console.error('Failed to fetch setup info:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching setup info:', error);
  }
}

// Fetch setup info on page load
window.addEventListener('load', updateSetupInfo);
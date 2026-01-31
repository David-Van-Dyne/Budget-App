// Get the modal
let modal = document.getElementById("setupModal");

// Get the button that closes the modal
let closeBtn = document.getElementById("submit-setup");
let skipBtn = document.getElementById("skip-setup");

// Function to open the modal
async function openModal() {
  try {
    // Fetch setup data from server
    const response = await fetch('/api/get-setup');
    if (response.ok) {
      const data = await response.json();

      // Check if both Dave and Shea have setup data
      const daveSetup = data.setup && data.setup.dave;
      const sheaSetup = data.setup && data.setup.shea;

      if (daveSetup && sheaSetup) {
        console.log("Setup already completed for both users");
        return; // Don't show modal if both have setup data
      } else {
        console.log("Setup incomplete, showing modal");
        modal.style.display = "flex";
      }
    }
  } catch (error) {
    console.error('Error checking setup data:', error);
  }

  // Show modal if setup is not complete
  console.log("Opening setup modal");
  modal.style.display = "flex";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Open the modal when the page loads
window.onload = async function () {
  openModal();
}

// Handle submit button click
submitBtn.onclick = function () {
  modal.style.display = "none";
}


// Function to check if setup is complete for both Shea and Dave
async function isSetupComplete() {
  try {
    const response = await fetch('/api/get-setup');
    if (response.ok) {
      const data = await response.json();
      const daveSetup = data.setup && data.setup.dave;
      const sheaSetup = data.setup && data.setup.shea;
      return daveSetup && sheaSetup;
    }
  } catch (error) {
    console.error('Error checking setup data:', error);
  }
  return false;
}

// Handle form submission
const setupForm = document.getElementById('setup-form');
submitBtn.addEventListener('click', async function (event) {
  event.preventDefault(); // Prevent default form submission

  // Collect form data
  const formData = new FormData(setupForm);
  const setupData = {
    name: formData.get('name'),
    paycheck: parseFloat(formData.get('paycheck')),
    payFrequency: formData.get('pay-frequency'),
    day: formData.get('day'),
    nextPayDate: formData.get('next-pay-date')
  };

  try {
    const response = await fetch('/api/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(setupData)
    });

    if (response.ok) {
      console.log('Setup data submitted successfully');
      modal.style.display = "none";
    } else {
      console.error('Failed to submit setup data');
    }
  } catch (error) {
    console.error('Error submitting setup data:', error);
  }
});
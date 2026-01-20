// Get all tab labels
const tabLabels = document.querySelectorAll('.tab-label');

// Add click event listener to each tab label
tabLabels.forEach(tab => {
  tab.addEventListener('click', function () {
    // Remove active class from all tabs
    tabLabels.forEach(t => t.classList.remove('active'));

    // Add active class to clicked tab
    this.classList.add('active');

    // Handle showing/hiding sections
    showSection(this.dataset.tab);
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
  // Note: home-section has no content to show, so all sections remain hidden
}


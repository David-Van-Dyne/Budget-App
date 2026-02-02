// Navigation and section management

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

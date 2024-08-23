const menuIcon = document.getElementById('menu-icon');
const menu = document.querySelector('.menu-mobile');
const actionButtons = document.querySelector('.action-buttons-mobile');

menuIcon.addEventListener('click', () => {
    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
        actionButtons.style.display = 'none';
        menuIcon.textContent = '☰'; 
        // Show menu icon
    } else {
        menu.style.display = 'flex';
        actionButtons.style.display = 'flex';
        menuIcon.textContent = '✖'; // Show cross icon
    }
});


const mediaQuery = window.matchMedia(outerWidth);

if (mediaQuery>902) {

document.querySelectorAll('.action-buttons-mobile, .menu-mobile').forEach(element => {
element.style.display = 'none';
});
}





// faqs
document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', event => {
      const clickedFaq = event.currentTarget.parentElement;

      // Close all other FAQs
      document.querySelectorAll('.faq').forEach(faq => {
        if (faq !== clickedFaq) {
          faq.classList.remove('active');
        }
      });

      // Toggle the clicked FAQ
      clickedFaq.classList.toggle('active');
    });
  });



  
  document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.querySelector('.menu-item .dropdown-toggle');
    const dropdownMenu = document.querySelector('.menu-item .dropdown-menu');
    
    dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        dropdownMenu.classList.toggle('show'); // Toggle the visibility of the dropdown menu
    });

    // Optional: Close the dropdown if clicked outside
    document.addEventListener('click', function(e) {
        if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});



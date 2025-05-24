document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const itemPath = item.getAttribute('href');
    if (itemPath === currentPath) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  
  function handleScreenChange(e) {
    if (e.matches) {
      document.querySelectorAll('.nav-item span').forEach(span => {
        span.style.display = 'block';
      });
    }
  }
  
  mediaQuery.addListener(handleScreenChange);
  handleScreenChange(mediaQuery);
});

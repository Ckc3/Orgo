
document.addEventListener('DOMContentLoaded', () => {
  const categoryButtons = document.querySelectorAll('.category-btn');
  const searchInput = document.getElementById('searchCommands');
  const commandCards = document.querySelectorAll('.command-card');
  const categories = document.querySelectorAll('.command-category');
  const featureCards = document.querySelectorAll('.feature-card');


  const animateOnScroll = () => {
    const cards = document.querySelectorAll('.command-card, .feature-card');
    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      const triggerBottom = window.innerHeight * 0.8;
      
      if (cardTop < triggerBottom) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
    });
  };


  commandCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
  });


  featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.05) translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1) translateY(0)';
    });
  });


  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const category = button.getAttribute('data-category');
      
      categories.forEach(cat => {
        if (category === 'all' || cat.id === category) {
          cat.style.display = '';
          setTimeout(() => {
            cat.style.opacity = '1';
            cat.style.transform = 'translateY(0)';
          }, 50);
        } else {
          cat.style.opacity = '0';
          cat.style.transform = 'translateY(20px)';
          setTimeout(() => {
            cat.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    commandCards.forEach(card => {
      const commandName = card.querySelector('h3').textContent.toLowerCase();
      const commandDesc = card.querySelector('p').textContent.toLowerCase();
      
      if (commandName.includes(searchTerm) || commandDesc.includes(searchTerm)) {
        card.style.display = '';
        card.style.animation = 'highlight 1s ease';
      } else {
        card.style.display = 'none';
      }
    });

    categories.forEach(category => {
      const visibleCommands = Array.from(category.querySelectorAll('.command-card')).filter(card => card.style.display !== 'none').length;
      category.style.display = visibleCommands > 0 ? '' : 'none';
    });
  });


  window.addEventListener('scroll', () => {
    requestAnimationFrame(animateOnScroll);
  });


  animateOnScroll();
});

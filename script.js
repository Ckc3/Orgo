
document.addEventListener('DOMContentLoaded', () => {
  const categoryButtons = document.querySelectorAll('.category-btn');
  const searchInput = document.getElementById('searchCommands');
  const commandCards = document.querySelectorAll('.command-card');
  const categories = document.querySelectorAll('.command-category');


  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {

      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const category = button.getAttribute('data-category');
      
      categories.forEach(cat => {
        if (category === 'all' || cat.id === category) {
          cat.classList.remove('hidden');
        } else {
          cat.classList.add('hidden');
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
      } else {
        card.style.display = 'none';
      }
    });


    categories.forEach(category => {
      const visibleCommands = category.querySelectorAll('.command-card[style=""]').length;
      if (visibleCommands === 0) {
        category.classList.add('hidden');
      } else {
        category.classList.remove('hidden');
      }
    });
  });
});

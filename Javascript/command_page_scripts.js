async function bot_information() {
  const response = await fetch('/api/v1/bot_information')
  if (response.ok) {
    const data = await response.json()
    commands_list = data.commands
    stats_list = data.stats
    displayCommands(commands_list)
    displayStats(stats_list)
  }
};

function displayCommands(commands) {
  const commandsContainer = document.getElementById('commands-container')
  commandsContainer.innerHTML = ''
  
  const categories = {
    economy: ['balance', 'daily', 'give', 'leaderboard', 'shop', 'inventory'],
    moderation: ['ban', 'kick', 'clear', 'mute', 'unmute', 'warn', 'giverole', 'removerole'],
    games: ['adventure', 'blackjack', 'boss', 'coinflip', 'dice', 'fish', 'guess', 'race', 'reaction', 'slots', 'typingrace'],
    utility: ['avatar', 'help', 'poll', 'profile', 'remind', 'report', 'serverinfo', 'stats', 'suggest', 'ticket', 'translate', 'userinfo']
  }
  
  async function categorizeCommandWithAI(command, description) {
    try {
      console.log(`Categorizing command: ${command}`);
      const response = await fetch('/api/v1/categorize_command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          command: command,
          description: description
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.category) {
        console.log(`AI categorized "${command}" as "${data.category}"`);
        return data.category;
      } else {
        console.error('Error calling categorize API:', data);
        if (data.category) {
          return data.category;
        }
        return findCategoryLocally(command);
      }
    } catch (error) {
      console.error('Error categorizing command:', error);
      return findCategoryLocally(command);
    }
  }
  
  function findCategoryLocally(command) {
    for (const [category, commands] of Object.entries(categories)) {
      if (commands.includes(command)) {
        return category;
      }
    }
    
    const commandLower = command.toLowerCase();
    
    if (/bal|money|coin|cash|shop|buy|sell|inventory|daily|reward|give/.test(commandLower)) {
      return 'economy';
    }
    
    if (/ban|kick|mute|warn|clear|role|mod|admin|permission/.test(commandLower)) {
      return 'moderation';
    }
    
    if (/game|play|fun|dice|card|bet|gamble|adventure|race|fish|slot/.test(commandLower)) {
      return 'games';
    }
    
    return 'utility';
  }
  
  const loadingIndicator = document.createElement('div')
  loadingIndicator.className = 'loading-indicator'
  loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Categorizing commands with AI...'
  commandsContainer.appendChild(loadingIndicator)
  
  const processCommands = async () => {
    const commandEntries = Object.entries(commands)
    const categorizedCommands = []
    let apiFailureCount = 0
    const MAX_API_FAILURES = 3
    
    for (let i = 0; i < commandEntries.length; i += 5) {
      const batch = commandEntries.slice(i, i + 5)
      
      const batchPromises = batch.map(async ([command, description]) => {
        let category = findCategoryLocally(command)
        let isAICategorized = false
        
        if (category === 'utility' && !categories.utility.includes(command) && apiFailureCount < MAX_API_FAILURES) {
          try {
            const aiCategory = await categorizeCommandWithAI(command, description)
            if (aiCategory !== 'utility') {
              category = aiCategory
              isAICategorized = true
            } else {
              apiFailureCount++
            }
          } catch (error) {
            console.error(`Failed to categorize ${command}:`, error)
            apiFailureCount++
          }
        }
        
        return {
          command,
          description,
          category,
          isAICategorized
        }
      })
      
      const categorizedBatch = await Promise.all(batchPromises)
      categorizedCommands.push(...categorizedBatch)
      
      loadingIndicator.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Categorizing commands with AI... (${categorizedCommands.length}/${commandEntries.length})`
      
      if (apiFailureCount >= MAX_API_FAILURES) {
        loadingIndicator.innerHTML += '<br><small style="color: #ff9800;">AI categorization limited due to API errors</small>'
      }
    }
    
    loadingIndicator.remove()
    
    categorizedCommands.forEach(({ command, description, category, isAICategorized }) => {
      const commandCard = document.createElement('div')
      commandCard.className = `command-card ${category}`
      
      if (isAICategorized) {
        commandCard.classList.add('ai-categorized')
      }
      
      commandCard.innerHTML = `
        <h3>/${command}</h3>
        <p>${description}</p>
        <span class="category-tag">${category}</span>
        ${isAICategorized ? '<span class="ai-tag"><i class="fas fa-robot"></i> AI Categorized</span>' : ''}
      `
      commandsContainer.appendChild(commandCard)
    })
  }
  
  processCommands()
}

function displayStats(stats) {
  const statsContainer = document.getElementById('stats-container')
  statsContainer.innerHTML = ''
  
  const statItems = [
    { icon: 'fa-server', label: 'Servers', value: stats.server_count },
    { icon: 'fa-chart-line', label: 'Daily Usage', value: stats.daily_usage },
    { icon: 'fa-star', label: 'Most Popular', value: `/${stats.most_popular_command}` },
    { icon: 'fa-calculator', label: 'Avg. Usage', value: stats.average_usage }
  ]
  
  statItems.forEach(item => {
    const statCard = document.createElement('div')
    statCard.className = 'stat-card'
    statCard.innerHTML = `
      <i class="fas ${item.icon}"></i>
      <div class="stat-info">
        <span class="stat-value">${item.value}</span>
        <span class="stat-label">${item.label}</span>
      </div>
    `
    statsContainer.appendChild(statCard)
  })
}

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('command-search')
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase()
      const commandCards = document.querySelectorAll('.command-card')
      
      commandCards.forEach(card => {
        const commandName = card.querySelector('h3').textContent.toLowerCase()
        const commandDesc = card.querySelector('p').textContent.toLowerCase()
        
        if (commandName.includes(searchTerm) || commandDesc.includes(searchTerm)) {
          card.style.display = 'block'
        } else {
          card.style.display = 'none'
        }
      })
    })
  }
  
  const filterButtons = document.querySelectorAll('.filter-btn')
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'))
      this.classList.add('active')
      
      const category = this.getAttribute('data-category')
      const commandCards = document.querySelectorAll('.command-card')
      
      commandCards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
          card.style.display = 'block'
        } else {
          card.style.display = 'none'
        }
      })
    })
  })
})

document.addEventListener('DOMContentLoaded', function() {
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

bot_information()
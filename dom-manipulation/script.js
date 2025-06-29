let Amazingquotes = [
  { text: 'The only way to do great work is to love what you do', category: 'Passion' },
  { text: 'Be the change that you wish to see in the world', category: 'Personal Responsibility' },
  { text: 'The mind is everything. What you think you become', category: 'Mindfulness' }
];

const SERVER_API = 'https://jsonplaceholder.typicode.com/posts'; 

const display = document.getElementById('quoteDisplay');
const notificationDivId = 'syncNotification'; 

function showRandomQuote(filteredQuotes = Amazingquotes) {
  if (filteredQuotes.length === 0) {
    display.innerHTML = 'No quotes in this category.';
    return;
  }
  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  let quote = filteredQuotes[randomIndex];
  display.innerHTML = `"${quote.text}" - ${quote.category}`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  if (text && category) {
    Amazingquotes.push({ text, category });
    saveQuotesToLocalStorage();
    populateCategories();
    filterQuotes();
    textInput.value = '';
    categoryInput.value = '';
  } else {
    alert('Please enter both a quote and a category.');
  }
}

function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(Amazingquotes));
}

function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    Amazingquotes = JSON.parse(storedQuotes);
  }
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(Amazingquotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        Amazingquotes.push(...importedQuotes);
        saveQuotesToLocalStorage();
        populateCategories();
        alert('Quotes imported successfully!');
        filterQuotes();
      } else {
        alert('Invalid JSON format.');
      }
    } catch (err) {
      alert('Error reading file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const categorySelect = document.getElementById('categoryFilter');
  const categories = [...new Set(Amazingquotes.map(q => q.category))];
  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) categorySelect.value = savedCategory;
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  if (selectedCategory === 'all') showRandomQuote(Amazingquotes);
  else {
    const filtered = Amazingquotes.filter(q => q.category === selectedCategory);
    showRandomQuote(filtered);
  }
}

function showNotification(message, withResolveButton = false) {
  let notifDiv = document.getElementById(notificationDivId);
  if (!notifDiv) {
    notifDiv = document.createElement('div');
    notifDiv.id = notificationDivId;
    notifDiv.style = 'position: fixed; bottom: 10px; right: 10px; background: #f0f0f0; padding: 10px; border: 1px solid #333; z-index: 1000;';
    document.body.appendChild(notifDiv);
  }
  notifDiv.innerHTML = message;
  if (withResolveButton) {
    const btn = document.createElement('button');
    btn.textContent = 'Resolve Conflict';
    btn.style.marginLeft = '10px';
    btn.onclick = () => {
      applyServerData(latestServerData);
      notifDiv.remove();
    };
    notifDiv.appendChild(btn);
  }
}

let latestServerData = null;

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_API);
    const data = await response.json();

    const serverQuotes = data.slice(0, 10).map(item => ({
      text: item.title || 'No text',
      category: item.body ? item.body.substring(0, 15) : 'General'
    }));

    latestServerData = serverQuotes;

    syncWithServerData(serverQuotes);
  } catch (error) {
    console.error('Failed to fetch from server:', error);
  }
}

function syncWithServerData(serverQuotes) {
  const localString = JSON.stringify(Amazingquotes);
  const serverString = JSON.stringify(serverQuotes);

  if (localString !== serverString) {
    showNotification('New quotes available from server. Conflicts detected.', true);
  }
}

function applyServerData(serverQuotes) {
  Amazingquotes = serverQuotes;
  saveQuotesToLocalStorage();
  populateCategories();
  filterQuotes();
  showNotification('Server data applied successfully.');
}

function startPeriodicSync() {
  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 30000);
}

window.onload = function () {
  loadQuotesFromLocalStorage();
  populateCategories();

  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    document.getElementById('categoryFilter').value = savedCategory;
  }

  filterQuotes();

  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote) {
    try {
      const quote = JSON.parse(lastQuote);
      display.innerHTML = `"${quote.text}" - ${quote.category}`;
    } catch {
      
    }
  }

  document.getElementById('newQuote').addEventListener('click', filterQuotes);
  document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

  startPeriodicSync();
};

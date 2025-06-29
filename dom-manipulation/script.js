let Amazingquotes = [
  { text: 'The only way to do great work is to love what you do', category: 'Passion' },
  { text: 'Be the change that you wish to see in the world', category: 'Personal Responsibility' },
  { text: 'The mind is everything. What you think you become', category: 'Mindfulness' }
];

function showRandomQuote(filteredQuotes = Amazingquotes) {
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = 'No quotes in this category.';
    return;
  }

  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  let quote = filteredQuotes[randomIndex];

  const display = document.getElementById('quoteDisplay');
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
    textInput.value = '';
    categoryInput.value = '';
    filterQuotes(); 
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
  if (savedCategory) {
    categorySelect.value = savedCategory;
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory); 

  if (selectedCategory === 'all') {
    showRandomQuote(Amazingquotes);
  } else {
    const filtered = Amazingquotes.filter(q => q.category === selectedCategory);
    showRandomQuote(filtered);
  }
}

window.onload = function () {
  loadQuotesFromLocalStorage();
  populateCategories();

  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    document.getElementById('categoryFilter').value = savedCategory;
    filterQuotes();
  } else {
    showRandomQuote();
  }

  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    const display = document.getElementById('quoteDisplay');
    display.innerHTML = `"${quote.text}" - ${quote.category}`;
  }

  document.getElementById('newQuote').addEventListener('click', filterQuotes);
  document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
};

let Amazingquotes = [
  { text: 'The only way to do great work is to love what you do', category: 'Passion' },
  { text: 'Be the change that you wish to see in the world', category: 'Personal Responsibility' },
  { text: 'The mind is everything. What you think you become', category: 'Mindfulness' }
];

const SERVER_API = 'https://jsonplaceholder.typicode.com/posts';

const display = document.getElementById('quoteDisplay');
const notificationId = 'syncNotification';

let latestServerData = null; 

function showRandomQuote(filteredQuotes = Amazingquotes) {
  if (filteredQuotes.length === 0) {
    display.innerHTML = 'No quotes found for this category.';
    return;
  }
  const idx = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[idx];
  display.innerHTML = `"${quote.text}" - ${quote.category}`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

async function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert('Please enter both a quote and a category.');
    return;
  }

  const newQuote = { text, category };
  Amazingquotes.push(newQuote);
  saveQuotesToLocalStorage();
  populateCategories();
  filterQuotes();

  try {
    const response = await fetch(SERVER_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: text, body: category }),
    });
    if (!response.ok) throw new Error('Failed to post new quote to server');
    console.log('Posted new quote to server:', newQuote);
  } catch (err) {
    console.warn('POST error:', err);
  }

  textInput.value = '';
  categoryInput.value = '';
}

function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(Amazingquotes));
}

function loadQuotesFromLocalStorage() {
  const data = localStorage.getItem('quotes');
  if (data) Amazingquotes = JSON.parse(data);
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
  fileReader.onload = e => {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error('Invalid JSON format');
      Amazingquotes.push(...importedQuotes);
      saveQuotesToLocalStorage();
      populateCategories();
      alert('Quotes imported successfully!');
      filterQuotes();
    } catch {
      alert('Failed to import quotes: invalid file format.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(Amazingquotes.map(q => q.category))];
  select.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) select.value = savedCategory;
}

function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selected);
  if (selected === 'all') {
    showRandomQuote(Amazingquotes);
  } else {
    const filtered = Amazingquotes.filter(q => q.category === selected);
    showRandomQuote(filtered);
  }
}

function showNotification(message, showResolve = false) {
  let notif = document.getElementById(notificationId);
  if (!notif) {
    notif = document.createElement('div');
    notif.id = notificationId;
    notif.style =
      'position: fixed; bottom: 20px; right: 20px; background: #ffeeba; border: 1px solid #f0ad4e; padding: 10px 15px; border-radius: 5px; font-weight: bold; z-index: 10000;';
    document.body.appendChild(notif);
  }
  notif.innerHTML = message;
  if (showResolve) {
    const btn = document.createElement('button');
    btn.textContent = 'Resolve Conflict';
    btn.style.marginLeft = '10px';
    btn.onclick = () => {
      applyServerData(latestServerData);
      notif.remove();
    };
    notif.appendChild(btn);
  }
}

async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_API);
    if (!res.ok) throw new Error('Failed to fetch from server');
    const data = await res.json();

    const serverQuotes = data.slice(0, 10).map(item => ({
      text: item.title || 'No text',
      category: item.body ? item.body.substring(0, 15) : 'General',
    }));

    latestServerData = serverQuotes;
    syncQuotes(serverQuotes);
  } catch (e) {
    console.warn('Fetch error:', e);
  }
}

function syncQuotes(serverQuotes) {
  const localStr = JSON.stringify(Amazingquotes);
  const serverStr = JSON.stringify(serverQuotes);
  if (localStr !== serverStr) {
    showNotification('New server data detected! Conflicts found.', true);
  }
}
a
function applyServerData(serverQuotes) {
  Amazingquotes = serverQuotes;
  saveQuotesToLocalStorage();
  populateCategories();
  filterQuotes();
  showNotification('Server data applied successfully.');
}

async function syncQuotesPeriodically() {
  await fetchQuotesFromServer();

  for (const quote of Amazingquotes) {
    try {
      await fetch(SERVER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: quote.text, body: quote.category }),
      });
    } catch {
      
    }
  }
}

function startPeriodicSync() {
  syncQuotesPeriodically();
  setInterval(syncQuotesPeriodically, 30000);
}

window.onload = () => {
  loadQuotesFromLocalStorage();
  populateCategories();

  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) document.getElementById('categoryFilter').value = savedCategory;

  filterQuotes();

  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote) {
    try {
      const q = JSON.parse(lastQuote);
      display.innerHTML = `"${q.text}" - ${q.category}`;
    } catch {}
  }

  document.getElementById('newQuote').addEventListener('click', filterQuotes);
  document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

  startPeriodicSync();
};

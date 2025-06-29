let Amazingquotes = [
  { text: 'The only way to do great work is to love what you do', category: 'Passion' },
  { text: 'Be the change that you wish to see in the world', category: 'Personal Responsibility' },
  { text: 'The mind is everything. What you think you become', category: 'Mindfulness' }
];

const SERVER_API = 'https://jsonplaceholder.typicode.com/posts';

const display = document.getElementById('quoteDisplay');
const notificationDivId = 'syncNotification';
let latestServerData = null;

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

async function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    Amazingquotes.push(newQuote);
    saveQuotesToLocalStorage();
    populateCategories();
    filterQuotes();

    try {
      const res = await fetch(SERVER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text, body: category })
      });
      if (!res.ok) throw new Error('Failed to post quote to server');
      console.log('Quote posted to server:', newQuote);
    } catch (err) {
      console.warn('POST error:', err);
    }

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
  if (storedQuotes) Amazingquotes = JSON.parse(storedQuotes);
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

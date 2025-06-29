let Amazingquotes = [
    {text: 'The only way to do great work is to love what you do', category: 'Passion'},
    {text: 'Be the change that you wish to see in the world', category: 'Personal Responsibility'},
    {text: 'The mind is everything. What you think you become', category: 'Mindfulness'}
];

function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * Amazingquotes.length);
  let quote = Amazingquotes[randomIndex];

 const display = document.getElementById('quoteDisplay');
 display.innerHTML = `"${quote.text}" - ${quote.category}`;

}

function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
        Amazingquotes.push({ text, category });
        textInput.value = '';
        categoryInput.value = '';
        showRandomQuote();
    } else {
        alert('Please enter both a quote and a category.');
    }
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

function createAddQuoteForm() {
    const Container = document.createElement('div');

    const inputText = document.createElement('input');
    inputText.id = 'newQuoteText';
    inputText.placeholder = 'Enter a new quote';

    const inputCategory = document.createElement('input');
    inputCategory.id = 'newQuoteCategory';
    inputCategory.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote;

    Container.appendChild(inputText);
    Container.appendChild(inputCategory);
    Container.appendChild(addButton);

    document.body.appendChild(Container);
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

function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
        Amazingquotes.push({ text, category });
        saveQuotesToLocalStorage(); 
        textInput.value = '';
        categoryInput.value = '';
        showRandomQuote();
    } else {
        alert('Please enter a quote and a category.');
    }
}

window.onload = function() {
    loadQuotesFromLocalStorage();
};

//
function saveQuotesToLocalStorage() {
    localStorage.setItem('quotes', JSON.stringify(Amazingquotes));
}

function loadQuotesFromLocalStorage() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        Amazingquotes = JSON.parse(storedQuotes);
    }
}

function exportQuotes() {
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
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                Amazingquotes.push(...importedQuotes);
                saveQuotesToLocalStorage();
                alert('Quotes imported successfully!');
                showRandomQuote();
            } else {
                alert('Invalid JSON format.');
            }
        } catch (err) {
            alert('Error reading file.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

window.onload = function() {
    loadQuotesFromLocalStorage();
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
        const quote = JSON.parse(lastQuote);
        const display = document.getElementById('quoteDisplay');
        display.innerHTML = `"${quote.text}" - ${quote.category}`;
    } else {
        showRandomQuote();
    }

    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('exportBtn').addEventListener('click', exportToJsonFile); 
    document.getElementById('importFile').addEventListener('change', importFromJsonFile);
}

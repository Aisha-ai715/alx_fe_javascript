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

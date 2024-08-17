// script.js

let flashCards = [];
const searchBar = document.getElementById('search-bar');
const cardContainer = document.getElementById('card-container');
const modal = document.getElementById('modal');
const addCardButton = document.getElementById('add-card');
const closeButton = document.querySelector('.close-button');
const saveCardButton = document.getElementById('save-card');
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const generateAICardButton = document.getElementById('generate-ai-card');
const topicInput = document.getElementById('topic-input');

// Open modal to create a new card
addCardButton.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Close modal
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    clearModalInputs();
});

// Save card and add it to the list
saveCardButton.addEventListener('click', () => {
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (question && answer) {
        const newCard = { question, answer };
        flashCards.push(newCard);
        addCardToDOM(newCard);
        clearModalInputs();
        modal.style.display = 'none';
    }
});

// Add card to the DOM
function addCardToDOM(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.innerHTML = `<p>${card.question}</p>`;
    cardElement.addEventListener('click', () => {
        if (cardElement.querySelector('p').textContent === card.question) {
            cardElement.querySelector('p').textContent = card.answer;
        } else {
            cardElement.querySelector('p').textContent = card.question;
        }
    });
    cardContainer.appendChild(cardElement);
}

// Clear inputs in the modal
function clearModalInputs() {
    questionInput.value = '';
    answerInput.value = '';
}

// Search functionality
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCards = flashCards.filter(card => 
        card.question.toLowerCase().includes(searchTerm) || 
        card.answer.toLowerCase().includes(searchTerm)
    );

    // Clear current cards
    cardContainer.innerHTML = '';

    // Display filtered cards
    filteredCards.forEach(addCardToDOM);
});

// AI Generate functionality
generateAICardButton.addEventListener('click', async () => {
    const topic = topicInput.value.trim();
    if (topic) {
        try {
            const aiCards = await generateFlashCards(topic);
            aiCards.forEach(card => {
                const newCard = { question: card.question, answer: card.answer };
                flashCards.push(newCard);
                addCardToDOM(newCard);
            });
        } catch (error) {
            console.error('Error generating AI cards:', error);
        }
    }
});

// Function to interact with AI API and generate flashcards
async function generateFlashCards(topic) {
    const response = await fetch('https://api.example.com/generate-cards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({ topic: topic })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch AI-generated cards');
    }

    const data = await response.json();
    return data.flashCards; // Assuming the API returns an array of cards in {question, answer} format
}

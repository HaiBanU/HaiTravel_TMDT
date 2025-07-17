// js/pages/tarot.js

import { tarotDeck } from '../data/tarot.js';
import { tarotReadings } from '../data/tarotReadings.js';

export function initTarotPage() {
    const introSection = document.getElementById('tarot-intro');
    const gameBoard = document.getElementById('tarot-game-board');
    const deckContainer = document.getElementById('tarot-deck-container');
    const startBtn = document.getElementById('start-tarot-btn');
    const finalReadingSection = document.getElementById('tarot-final-reading');
    const instructionEl = document.getElementById('tarot-instruction');
    const chosenSlotsWrappers = document.querySelectorAll('.tarot-slot-wrapper');

    if (!startBtn) return;

    let chosenCardsData = [];
    let canSelect = false;

    const createCardElement = (cardData) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'tarot-card';
        cardEl.innerHTML = `<div class="tarot-card-inner"><div class="tarot-card-back"></div><div class="tarot-card-front"><img src="${cardData.image}" alt="${cardData.name}"></div></div>`;
        cardEl.addEventListener('click', () => handleCardSelect(cardEl, cardData));
        return cardEl;
    };

    const handleCardSelect = (selectedCardEl, cardData) => {
        if (!canSelect || chosenCardsData.length >= 3 || selectedCardEl.classList.contains('is-chosen')) return;
        
        chosenCardsData.push(cardData);
        selectedCardEl.classList.add('is-chosen');

        const slotIndex = chosenCardsData.length - 1;
        const targetSlotWrapper = chosenSlotsWrappers[slotIndex];
        const targetSlot = targetSlotWrapper.querySelector('.tarot-slot');
        const targetName = targetSlotWrapper.querySelector('.tarot-slot-name');

        const slotRect = targetSlot.getBoundingClientRect();
        const deckRect = deckContainer.getBoundingClientRect();
        const x = slotRect.left - deckRect.left + (slotRect.width - selectedCardEl.offsetWidth) / 2;
        const y = slotRect.top - deckRect.top + (slotRect.height - selectedCardEl.offsetHeight) / 2;

        selectedCardEl.style.transform = `translate(${x}px, ${y}px) rotateY(180deg) scale(1.05)`;

        setTimeout(() => {
            targetSlot.appendChild(selectedCardEl);
            selectedCardEl.style.transform = `rotateY(180deg)`;
            
            // --- [SỬA LỖI QUAN TRỌNG] ---
            // Thay đổi position từ 'absolute' thành 'relative' sau khi di chuyển xong.
            // Điều này buộc lá bài phải nằm gọn trong ô chứa nó một cách chính xác.
            selectedCardEl.style.position = 'relative'; 

            targetName.textContent = cardData.name;
            targetName.classList.add('visible');
        }, 1000);

        updateInstruction();

        if (chosenCardsData.length === 3) {
            canSelect = false;
            instructionEl.textContent = `Những lá bài đã được chọn. Hãy xem lời tiên tri...`;
            setTimeout(showFinalReading, 2000);
        }
    };

    const getFinalReading = () => {
        let allTags = chosenCardsData.flatMap(card => card.tags);
        let uniqueTags = [...new Set(allTags)];
        uniqueTags.sort();

        if (uniqueTags.length === 3) {
            const key = uniqueTags.join(',');
            if (tarotReadings[key]) return { reading: tarotReadings[key], tags: uniqueTags };
        }
        if (uniqueTags.length >= 2) {
             for (let i = 0; i < uniqueTags.length; i++) {
                for (let j = i + 1; j < uniqueTags.length; j++) {
                    const key = [uniqueTags[i], uniqueTags[j]].join(',');
                     if (tarotReadings[key]) return { reading: tarotReadings[key], tags: [uniqueTags[i], uniqueTags[j]] };
                }
            }
        }
        return { reading: tarotReadings.default, tags: uniqueTags };
    };

    const showFinalReading = () => {
        const { reading, tags } = getFinalReading();

        const readingCardsDisplay = document.getElementById('reading-cards-display');
        readingCardsDisplay.innerHTML = chosenCardsData.map(card => `
            <div class="reading-card-item">
                <div class="tarot-card">
                    <div class="tarot-card-inner">
                        <div class="tarot-card-back"></div>
                        <div class="tarot-card-front"><img src="${card.image}" alt="${card.name}"></div>
                    </div>
                </div>
                <h3>${card.name}</h3>
                <p>${card.meaning}</p>
            </div>
        `).join('');

        document.getElementById('reading-title').textContent = "Lời Tiên Tri Của Bạn";
        document.getElementById('reading-description').textContent = reading;
        document.getElementById('reading-cta-btn').href = `discover.html?tags=${tags.join(',')}`;

        gameBoard.style.display = 'none';
        finalReadingSection.style.display = 'block';
        finalReadingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const updateInstruction = () => {
        const remaining = 3 - chosenCardsData.length;
        if (remaining > 0) {
            instructionEl.textContent = `Hãy chọn ${remaining} lá bài nữa...`;
            if (chosenSlotsWrappers[3 - remaining]) {
                chosenSlotsWrappers[3 - remaining].querySelector('.tarot-slot').classList.add('is-active');
            }
        }
    };

    const startGame = () => {
        introSection.style.display = 'none';
        gameBoard.style.display = 'block';
        
        gameBoard.scrollIntoView({ behavior: 'smooth', block: 'start' });

        gameBoard.classList.add('visible');
        updateInstruction();

        const shuffledDeck = [...tarotDeck].sort(() => 0.5 - Math.random());
        
        deckContainer.innerHTML = '';
        shuffledDeck.forEach(card => {
            const cardEl = createCardElement(card);
            deckContainer.appendChild(cardEl);
        });

        const cards = deckContainer.querySelectorAll('.tarot-card');
        const numCards = cards.length;
        const fanAngle = 90;
        const anglePerCard = fanAngle / (numCards - 1);
        const radius = 500;

        cards.forEach((card, i) => {
            const rotation = -fanAngle / 2 + i * anglePerCard;
            const offsetX = Math.sin(rotation * Math.PI / 180) * radius;
            const offsetY = (1 - Math.cos(rotation * Math.PI / 180)) * radius * 0.2;
            setTimeout(() => {
                card.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotation}deg)`;
            }, i * 50);
        });
        
        setTimeout(() => { canSelect = true; }, (cards.length * 50) + 500);
    };
    
    startBtn.addEventListener('click', startGame);
}
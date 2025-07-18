// js/pages/tarot.js

import { tarotDeck } from '../data/tarot.js';
import { tarotReadings } from '../data/tarotReadings.js'; 

export function initTarotPage() {
    const userInputSection = document.getElementById('tarot-user-input');
    const userInfoForm = document.getElementById('user-info-form');
    const introSection = document.getElementById('tarot-intro');
    const welcomeHeading = document.getElementById('tarot-welcome-heading');
    const gameBoard = document.getElementById('tarot-game-board');
    const deckContainer = document.getElementById('tarot-deck-container');
    const startBtn = document.getElementById('start-tarot-btn');
    const finalReadingSection = document.getElementById('tarot-final-reading');
    const instructionEl = document.getElementById('tarot-instruction');
    const chosenSlotsWrappers = document.querySelectorAll('.tarot-slot-wrapper');
    const readingDescriptionEl = document.getElementById('reading-description');
    const readingCtaBtn = document.getElementById('reading-cta-btn');

    if (!userInputSection || !userInfoForm || !introSection) return;

    let chosenCardsData = [];
    let canSelect = false;
    let userName = '';
    let userDob = null;

    const getZodiacSign = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: "Bảo Bình", advice: "Là một Bảo Bình độc đáo và yêu tự do, bạn khao khát những hành trình phá vỡ lối mòn. Những điểm đến ít người biết, những trải nghiệm văn hóa sâu sắc hoặc một chuyến đi phượt ngẫu hứng sẽ giúp bạn nạp lại năng lượng sáng tạo." };
        if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { sign: "Song Ngư", advice: "Với tâm hồn lãng mạn của một Song Ngư, bạn sẽ tìm thấy sự bình yên ở những nơi gần gũi với nước. Một khu nghỉ dưỡng ven biển thơ mộng, một chuyến du thuyền trên vịnh hoặc khám phá một thành phố cổ bên sông sẽ là liều thuốc chữa lành tuyệt vời cho bạn." };
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: "Bạch Dương", advice: "Năng lượng của Bạch Dương luôn thôi thúc bạn chinh phục thử thách. Những chuyến đi mạo hiểm, leo núi, khám phá hang động hoặc tham gia các hoạt động thể thao dưới nước sẽ thỏa mãn ngọn lửa phiêu lưu bên trong bạn." };
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: "Kim Ngưu", advice: "Kim Ngưu yêu thích sự thoải mái và sang trọng. Một kỳ nghỉ dưỡng tại resort 5 sao, một tour ẩm thực cao cấp hoặc một chuyến đi đến vùng đất có cảnh quan thiên nhiên trù phú, yên bình sẽ là phần thưởng xứng đáng cho bạn." };
        if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return { sign: "Song Tử", advice: "Là một Song Tử ham học hỏi và thích giao tiếp, bạn phù hợp với những thành phố sôi động. Một chuyến đi khám phá các đô thị lớn, tham quan bảo tàng, và hòa mình vào cuộc sống về đêm sẽ mang lại cho bạn nhiều câu chuyện thú vị." };
        if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return { sign: "Cự Giải", advice: "Với trái tim ấm áp của Cự Giải, những chuyến đi cùng gia đình hoặc nhóm bạn thân sẽ mang lại nhiều ý nghĩa nhất. Hãy chọn những điểm đến có không khí ấm cúng, nơi mọi người có thể cùng nhau tạo nên những kỷ niệm đẹp." };
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: "Sư Tử", advice: "Sư Tử luôn muốn tỏa sáng và tận hưởng những gì tốt đẹp nhất. Hãy chọn những điểm đến lộng lẫy, những sự kiện giải trí hoành tráng, hoặc một bãi biển sôi động nơi bạn có thể là trung tâm của mọi sự chú ý." };
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: "Xử Nữ", advice: "Là một Xử Nữ tỉ mỉ và yêu thích sự trật tự, bạn sẽ hứng thú với các tour du lịch văn hóa - lịch sử được lên kế hoạch chi tiết. Khám phá những di sản, những làng nghề truyền thống sẽ thỏa mãn trí tuệ và tâm hồn bạn." };
        if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return { sign: "Thiên Bình", advice: "Thiên Bình yêu cái đẹp và sự hài hòa. Một chuyến đi đến thành phố nghệ thuật, một vùng đất có kiến trúc tinh tế hoặc một kỳ nghỉ lãng mạn cùng người thương sẽ là lựa chọn hoàn hảo để cân bằng lại cuộc sống của bạn." };
        if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) return { sign: "Bọ Cạp", advice: "Với tâm hồn sâu sắc và bí ẩn của Bọ Cạp, bạn bị thu hút bởi những nơi mang đậm dấu ấn lịch sử, tâm linh hoặc những kỳ quan thiên nhiên hùng vĩ, hoang sơ. Một chuyến đi khám phá sẽ giúp bạn kết nối sâu hơn với chính mình." };
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: "Nhân Mã", advice: "Máu phiêu lưu của Nhân Mã luôn sôi sục. Những chuyến đi nước ngoài, khám phá các nền văn hóa mới hoặc một hành trình trekking dài ngày sẽ là cách tuyệt vời để bạn mở rộng tầm mắt và thỏa mãn khao khát tự do." };
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: "Ma Kết", advice: "Ma Kết đầy tham vọng và có trách nhiệm, bạn cần một kỳ nghỉ để thực sự thư giãn và nạp lại năng lượng. Một chuyến đi nghỉ dưỡng chất lượng cao hoặc khám phá một ngọn núi hùng vĩ sẽ giúp bạn tìm lại sự cân bằng và cảm hứng cho những mục tiêu lớn." };
        return { sign: "", advice: "" };
    };

    userInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userName = document.getElementById('user-name').value;
        const dobValue = document.getElementById('user-dob').value;
        userDob = new Date(dobValue);
        if (userName && dobValue) {
            userInputSection.style.display = 'none';
            welcomeHeading.textContent = `Chào mừng, ${userName}!`;
            introSection.style.display = 'flex';
        }
    });

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
    const updateInstruction = () => {
        const remaining = 3 - chosenCardsData.length;
        instructionEl.textContent = remaining > 0 ? `Hãy chọn ${remaining} lá bài nữa...` : '';
    };

    const showFinalReading = () => {
        let allTags = chosenCardsData.flatMap(card => card.tags);
        let uniqueTags = [...new Set(allTags)].sort();
        let readingKey = "default";

        if (uniqueTags.length === 3) {
            const potentialKey = uniqueTags.join(',');
            if (tarotReadings[potentialKey]) {
                readingKey = potentialKey;
            }
        }
        
        let baseReading = tarotReadings[readingKey] || tarotReadings.default;
        const zodiacInfo = getZodiacSign(userDob);
        let finalReadingText = baseReading.replace('{{name}}', userName);
        if (zodiacInfo.advice) {
            // [CẬP NHẬT] Thay thế cú pháp Markdown bằng thẻ HTML
            finalReadingText += `<br><br><strong>✨ Gợi ý từ Chiêm tinh:</strong><br>${zodiacInfo.advice}`;
        }
        
        const readingCardsDisplay = document.getElementById('reading-cards-display');
        readingCardsDisplay.innerHTML = chosenCardsData.map(card => `
            <div class="reading-card-item">
                <div class="tarot-card">
                    <div class="tarot-card-inner is-flipped">
                        <div class="tarot-card-back"></div>
                        <div class="tarot-card-front"><img src="${card.image}" alt="${card.name}"></div>
                    </div>
                </div>
                <h3>${card.name}</h3>
                <p>${card.meaning}</p>
            </div>
        `).join('');
        
        // [THAY ĐỔI] Sử dụng .innerHTML thay vì .textContent
        readingDescriptionEl.innerHTML = finalReadingText;
        readingCtaBtn.href = `discover.html?tags=${uniqueTags.join(',')}`;

        gameBoard.style.display = 'none';
        finalReadingSection.style.display = 'block';
        finalReadingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const startGame = () => {
        introSection.style.display = 'none';
        gameBoard.style.display = 'block';
        gameBoard.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
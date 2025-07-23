// js/ai-chat.js

import { getCurrentUser } from './services/auth.js';

export function initAiChat() {
    const chatBubble = document.getElementById('chat-bubble-trigger');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-input-form');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = chatForm.querySelector('button');

    // Các biến quản lý âm thanh
    const toggleTtsBtn = document.getElementById('toggle-tts-btn');
    const ttsIcon = toggleTtsBtn ? toggleTtsBtn.querySelector('i') : null;
    let isTtsEnabled = false;
    let currentAudio = null; // Biến để lưu trữ đối tượng Audio đang phát

    if (!chatBubble || !chatWindow || !closeChatBtn || !toggleTtsBtn) return;

    let chatHistory = [];

    // Hàm đọc văn bản sử dụng API FPT.AI thông qua backend
    const speakText = async (textToSpeak) => {
        if (!isTtsEnabled || !textToSpeak) {
            return;
        }
        // Dừng và xóa audio đang phát (nếu có)
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        try {
            const response = await fetch('https://haitravel-backend.onrender.com/api/ai/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToSpeak })
            });

            if (!response.ok) {
                console.error('Lỗi khi lấy file audio từ server.');
                return;
            }

            const data = await response.json();
            if (data.audioUrl) {
                // Tạo và phát audio từ URL nhận được
                currentAudio = new Audio(data.audioUrl);
                currentAudio.play();
            }
        } catch (error) {
            console.error('Không thể phát âm thanh:', error);
        }
    };

    // Xử lý sự kiện bật/tắt giọng nói
    toggleTtsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isTtsEnabled = !isTtsEnabled;
        
        if (isTtsEnabled) {
            toggleTtsBtn.classList.add('active');
            ttsIcon.classList.remove('fa-volume-off'); // Thay icon
            ttsIcon.classList.add('fa-volume-high');
            speakText("Giọng nói đã được bật.");
        } else {
            toggleTtsBtn.classList.remove('active');
            ttsIcon.classList.remove('fa-volume-high');
            ttsIcon.classList.add('fa-volume-off'); // Thay icon
            if (currentAudio) {
                currentAudio.pause(); // Dừng audio nếu đang phát
            }
        }
    });

    const toggleChatWindow = (e) => {
        e.stopPropagation();
        chatWindow.classList.toggle('open');
        chatBubble.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            chatInput.focus();
        } else {
            if (currentAudio) currentAudio.pause();
        }
    };
    
    const closeChat = () => {
        chatWindow.classList.remove('open');
        chatBubble.classList.remove('open');
        if (currentAudio) currentAudio.pause();
    }

    const displayMessage = (message, sender) => {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) typingIndicator.remove();
        
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper', `message-${sender}`);
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        const senderName = sender === 'user' ? 'Bạn' : 'Hai AI';
        const avatarHTML = sender === 'ai' ? `<img src="images/avatar-hai-ai.png" alt="Hai AI Avatar">` : `<i class="fa-solid fa-user"></i>`;
        
        messageElement.innerHTML = `
            <div class="avatar">${avatarHTML}</div>
            <div class="message-content">
                <div class="sender-name">${senderName}</div>
                <div class="text-bubble">${message}</div>
            </div>`;
        
        messageWrapper.appendChild(messageElement);
        chatMessages.appendChild(messageWrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        setTimeout(() => messageWrapper.classList.add('visible'), 50);

        if (sender === 'ai') {
            speakText(message);
        }
    };

    const showTypingIndicator = () => {
        const indicatorWrapper = document.createElement('div');
        indicatorWrapper.classList.add('message-wrapper', 'message-ai', 'typing-indicator');
        indicatorWrapper.innerHTML = `
            <div class="message">
                 <div class="avatar"><img src="images/avatar-hai-ai.png" alt="Hai AI Avatar"></div>
                 <div class="message-content">
                    <div class="sender-name">Hai AI</div>
                    <div class="text-bubble">
                        <div class="dot-flashing"></div>
                    </div>
                </div>
            </div>`;
        chatMessages.appendChild(indicatorWrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        if (currentAudio) {
            currentAudio.pause();
        }
        
        displayMessage(userMessage, 'user');
        chatHistory.push({ role: "user", content: userMessage });
        chatInput.value = '';
        sendBtn.disabled = true;
        showTypingIndicator();
        
        try {
            const user = getCurrentUser();
            const response = await fetch('https://haitravel-backend.onrender.com/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMessage, 
                    history: chatHistory.slice(-6),
                    userName: user ? user.name : null
                })
            });
            if (!response.ok) throw new Error('Có lỗi xảy ra, vui lòng thử lại.');
            const data = await response.json();
            const aiReply = data.reply;
            displayMessage(aiReply, 'ai');
            chatHistory.push({ role: "assistant", content: aiReply });
        } catch (error) {
            displayMessage("Xin lỗi, tôi đang gặp một sự cố nhỏ. Vui lòng thử lại sau giây lát.", 'ai');
        } finally {
            sendBtn.disabled = false;
            chatInput.focus();
        }
    };

    chatBubble.addEventListener('click', toggleChatWindow);
    closeChatBtn.addEventListener('click', closeChat);
    chatForm.addEventListener('submit', handleFormSubmit);

    document.addEventListener('click', (e) => {
        if (!chatWindow.contains(e.target) && !chatBubble.contains(e.target)) {
            closeChat();
        }
    });
    
    setTimeout(() => {
        const user = getCurrentUser();
        const welcomeMessage = user
            ? `Xin chào ${user.name}! Tôi là Hai AI, trợ lý ảo của HaiTravel. Tôi có thể giúp gì cho hành trình sắp tới của bạn?`
            : "Xin chào! Tôi là Hai AI, trợ lý ảo của HaiTravel. Tôi có thể giúp gì cho hành trình sắp tới của bạn?";
        displayMessage(welcomeMessage, 'ai');
        chatHistory.push({ role: "assistant", content: welcomeMessage });
    }, 500);
}
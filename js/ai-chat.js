// js/ai-chat.js

export function initAiChat() {
    const chatBubble = document.getElementById('chat-bubble-trigger');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-input-form');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = chatForm.querySelector('button');

    if (!chatBubble || !chatWindow || !closeChatBtn) return;

    let chatHistory = [];

    const toggleChatWindow = (e) => {
        e.stopPropagation();
        chatWindow.classList.toggle('open');
        chatBubble.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            chatInput.focus();
        }
    };
    
    const closeChat = () => {
        chatWindow.classList.remove('open');
        chatBubble.classList.remove('open');
    }

    const displayMessage = (message, sender) => {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) typingIndicator.remove();
        
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper', `message-${sender}`);

        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        
        const senderName = sender === 'user' ? 'Bạn' : 'Hai AI';
        
        const avatarHTML = sender === 'ai' 
            ? `<img src="images/avatar-hai-ai.png" alt="Hai AI Avatar">`
            : `<i class="fa-solid fa-user"></i>`;

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
    };

    // [THÊM MỚI] Hàm hiển thị hiệu ứng đang trả lời
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
            </div>
        `;
        chatMessages.appendChild(indicatorWrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        setTimeout(() => indicatorWrapper.classList.add('visible'), 50); // Thêm hiệu ứng xuất hiện
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;
        
        displayMessage(userMessage, 'user');
        chatHistory.push({ role: "user", content: userMessage });
        chatInput.value = '';
        sendBtn.disabled = true;
        
        // [THÊM MỚI] Gọi hàm hiển thị hiệu ứng typing
        showTypingIndicator();
        
        try {
            const response = await fetch('https://haitravel-backend.onrender.com/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, history: chatHistory.slice(-6) })
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
         displayMessage("Xin chào! Tôi là Hai AI, trợ lý ảo của HaiTravel. Tôi có thể giúp gì cho hành trình sắp tới của bạn?", 'ai');
    }, 500);
}
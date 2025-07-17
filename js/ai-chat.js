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

    // [CẬP NHẬT] Thay thế icon bằng ảnh cho AI
const displayMessage = (message, sender) => {
    const typingIndicator = chatMessages.querySelector('.typing-indicator');
    if (typingIndicator) typingIndicator.remove();
    
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper', `message-${sender}`);

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    const senderName = sender === 'user' ? 'Bạn' : 'Jack 97';
    
    // Logic mới: Nếu là AI thì dùng <img>, nếu là user thì dùng <i>
    const avatarHTML = sender === 'ai' 
        ? `<img src="images/avatar-jack97.png" alt="Jack 97 Avatar">`
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
    const showTypingIndicator = () => {
    const indicatorWrapper = document.createElement('div');
    indicatorWrapper.classList.add('message-wrapper', 'message-ai', 'typing-indicator');
    
    indicatorWrapper.innerHTML = `
        <div class="message">
             <div class="avatar"><img src="images/avatar-jack97.png" alt="Jack 97 Avatar"></div>
             <div class="message-content">
                <div class="sender-name">Jack 97</div>
                <div class="text-bubble">
                    <div class="dot-flashing"></div>
                </div>
            </div>
        </div>
    `;
    chatMessages.appendChild(indicatorWrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;
        
        displayMessage(userMessage, 'user');
        chatHistory.push({ role: "user", content: userMessage });
        chatInput.value = '';
        sendBtn.disabled = true;
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
            // [SỬA ĐỔI] Tin nhắn lỗi
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
    
    // [SỬA ĐỔI] Tin nhắn chào mừng mới
    setTimeout(() => {
         displayMessage("Xin chào! Tôi là Jack 97, trợ lý ảo của HaiTravel. Tôi có thể giúp gì cho hành trình sắp tới của bạn?", 'ai');
    }, 500);
}
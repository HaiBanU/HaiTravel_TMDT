// js/main.js

import { initPageTransitions, initScrollBasedAnimations, initSmoothScroll, initContactModal } from './utils/dom.js';
import { fetchAndSetCart } from './services/cart.js';
import { initHomePage } from './pages/home.js';
import { initTourDetailPage } from './pages/tourDetail.js';
import { initSearchResultsPage } from './pages/searchResults.js';
import { initCartPage } from './pages/cartPage.js';
import { initTransportPage } from './pages/transportPage.js';
import { initDiscoverPage } from './pages/discover.js';
import { initAuth } from './auth.js';
import { updateAuthDisplay } from './services/auth.js'; 
import { initAiChat } from './ai-chat.js';

async function initCommon() {
    initPageTransitions();
    initScrollBasedAnimations();
    initSmoothScroll();
    initContactModal();
    initAuth(); 
    updateAuthDisplay();
    await fetchAndSetCart(); // Đảm bảo giỏ hàng được tải ngay từ đầu
    initAiChat();
}

function router() {
    const page = window.location.pathname.split("/").pop() || 'index.html';
    switch (page) {
        case 'index.html': initHomePage(); break;
        case 'tour-detail.html': initTourDetailPage(); break;
        case 'search-results.html': initSearchResultsPage(); break;
        case 'cart.html': initCartPage(); break;
        case 'transport.html': initTransportPage(); break;
        case 'discover.html': initDiscoverPage(); break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initCommon();
    router();
});
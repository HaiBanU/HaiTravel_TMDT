// js/main.js

// Tính toán chiều rộng thanh cuộn và lưu vào biến CSS
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

import { initPageTransitions, initScrollBasedAnimations, initSmoothScroll, initContactModal, initSearchModal, initInfoModal } from './utils/dom.js';
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

function initMobileNav() {
    const navToggles = document.querySelectorAll('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const contactLinkMobile = document.getElementById('contact-link-mobile');
    const mainNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!mobileNav || navToggles.length === 0) return;

    const toggleMenu = (e) => {
        if (e) e.stopPropagation(); 
        document.body.classList.toggle('mobile-nav-open');
    };

    navToggles.forEach(toggle => toggle.addEventListener('click', toggleMenu));
    if(mobileNavOverlay) mobileNavOverlay.addEventListener('click', toggleMenu);

    mainNavLinks.forEach(link => {
        if(link.id === 'contact-link-mobile' || link.id === 'search-link-mobile') return;
        link.addEventListener('click', () => {
            if (document.body.classList.contains('mobile-nav-open')) toggleMenu();
        });
    });

    if (contactLinkMobile) {
        const contactModal = document.getElementById('contact-modal');
        contactLinkMobile.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu();
            setTimeout(() => { if (contactModal) contactModal.classList.add('show'); document.body.classList.add('modal-open'); }, 400);
        });
    }
}

async function initCommon() {
    initPageTransitions();
    initScrollBasedAnimations();
    initSmoothScroll();
    initContactModal();
    initSearchModal();
    initInfoModal(); // Gọi hàm khởi tạo modal thông tin
    initMobileNav();
    initAuth(); 
    updateAuthDisplay();
    await fetchAndSetCart();
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
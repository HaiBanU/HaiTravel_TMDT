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

/**
 * [THÊM MỚI] Hàm khởi tạo và điều khiển menu điều hướng trên di động.
 * Tìm các phần tử cần thiết và gán sự kiện click để bật/tắt menu.
 */
function initMobileNav() {
    const navToggles = document.querySelectorAll('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const contactLinkMobile = document.getElementById('contact-link-mobile');
    const mainNavLinks = document.querySelectorAll('.mobile-nav-links a');


    if (!mobileNav || navToggles.length === 0) {
        return;
    }

    const toggleMenu = (e) => {
        // Ngăn sự kiện click lan ra các phần tử khác nếu cần
        if (e) e.stopPropagation(); 
        document.body.classList.toggle('mobile-nav-open');
    };

    // Gán sự kiện cho tất cả các nút có thể mở/đóng menu (nút hamburger và nút 'X')
    navToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleMenu);
    });
    
    // Gán sự kiện cho lớp phủ mờ, bấm vào sẽ đóng menu
    if(mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', toggleMenu);
    }

    // Xử lý khi người dùng nhấn vào một link trong menu
    mainNavLinks.forEach(link => {
        // Bỏ qua link liên hệ vì nó có logic riêng
        if(link.id === 'contact-link-mobile') return;
        
        link.addEventListener('click', () => {
            if (document.body.classList.contains('mobile-nav-open')) {
                toggleMenu();
            }
        });
    });


    // Xử lý riêng cho link "Liên Hệ" để đóng menu trước khi mở modal
    if (contactLinkMobile) {
        const contactModal = document.getElementById('contact-modal');
        contactLinkMobile.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu(); // Luôn đóng menu khi nhấn
            setTimeout(() => { // Chờ 0.4s (thời gian animation của menu) rồi mới mở modal
                if (contactModal) contactModal.classList.add('show');
            }, 400);
        });
    }
}


/**
 * Hàm khởi tạo các chức năng chung, chạy trên mọi trang của website.
 */
async function initCommon() {
    initPageTransitions();
    initScrollBasedAnimations();
    initSmoothScroll();
    initContactModal();
    initMobileNav(); // Gọi hàm khởi tạo menu mobile
    initAuth(); 
    updateAuthDisplay();
    await fetchAndSetCart();
    initAiChat();
}

/**
 * "Router" phía client, kiểm tra URL hiện tại và gọi hàm khởi tạo cho trang tương ứng.
 */
function router() {
    // Lấy tên tệp từ URL, ví dụ: "cart.html", hoặc "index.html" nếu không có
    const page = window.location.pathname.split("/").pop() || 'index.html';
    
    switch (page) {
        case 'index.html': 
            initHomePage(); 
            break;
        case 'tour-detail.html': 
            initTourDetailPage(); 
            break;
        case 'search-results.html': 
            initSearchResultsPage(); 
            break;
        case 'cart.html': 
            initCartPage(); 
            break;
        case 'transport.html': 
            initTransportPage(); 
            break;
        case 'discover.html': 
            initDiscoverPage(); 
            break;
        // Các trang khác có thể được thêm vào đây
    }
}

/**
 * Sự kiện chính: Khi nội dung của trang đã được tải xong,
 * bắt đầu chạy các hàm khởi tạo chung và hàm router.
 */
document.addEventListener('DOMContentLoaded', () => {
    initCommon();
    router();
});
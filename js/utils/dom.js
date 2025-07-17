// js/utils/dom.js

import { formatDateRange } from './formatters.js';

/**
 * Tạo hiệu ứng chuyển trang mượt mà khi người dùng click vào các liên kết.
 * Loại trừ các liên kết đặc biệt (mở tab mới, link cuộn nội trang, hàm JS).
 */
export function initPageTransitions() {
    document.body.classList.remove('is-loading');
    
    const allLinks = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href*="javascript:"]):not(.no-transition)');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href) return;

            const url = new URL(link.href, window.location.origin);
            if (url.pathname === window.location.pathname && url.hash) {
                return;
            }

            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        });
    });
}

/**
 * Khởi tạo các hiệu ứng hoạt ảnh dựa trên vị trí cuộn của người dùng.
 */
export function initScrollBasedAnimations() {
    const header = document.querySelector('header');
    const backToTopButton = document.querySelector('.back-to-top');
    const revealElements = document.querySelectorAll('.reveal');

    const handleScroll = () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
        if (backToTopButton) {
            backToTopButton.classList.toggle('visible', window.scrollY > 400);
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
}

/**
 * Xử lý việc cuộn mượt đến các anchor link (#).
 */
export function initSmoothScroll() {
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link || !link.hash) return;

        if (link.pathname === window.location.pathname) {
            e.preventDefault(); 
            e.stopPropagation(); 
            const targetId = link.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    window.addEventListener('load', () => {
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    });
}

/**
 * Khởi tạo và quản lý modal "Thông Tin Liên Hệ".
 */
export function initContactModal() {
    const contactLink = document.getElementById('contact-link');
    const contactModal = document.getElementById('contact-modal');
    if (!contactModal) return;

    const closeButton = contactModal.querySelector('.close-btn');

    const openModal = () => {
        contactModal.classList.add('show');
        document.body.classList.add('modal-open');
    };
    const closeModal = () => {
        contactModal.classList.remove('show');
        document.body.classList.remove('modal-open');
    };

    if (contactLink) {
        contactLink.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openModal();
        });
    }
    
    closeButton.addEventListener('click', closeModal);
    contactModal.addEventListener('click', (event) => {
        if (event.target === contactModal) closeModal();
    });
}

/**
 * Khởi tạo và quản lý modal "Thông Tin Quan Trọng" trên trang chi tiết tour.
 */
export function initInfoModal() {
    const infoFab = document.getElementById('info-fab');
    const infoModal = document.getElementById('info-modal');
    // Chỉ chạy nếu đang ở trang có các phần tử này (trang chi tiết tour)
    if (!infoFab || !infoModal) return; 

    const closeButton = infoModal.querySelector('.close-btn');

    const openModal = () => {
        infoModal.classList.add('show');
        document.body.classList.add('modal-open');
    };
    const closeModal = () => {
        infoModal.classList.remove('show');
        document.body.classList.remove('modal-open');
    };

    infoFab.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    infoModal.addEventListener('click', (event) => {
        // Chỉ đóng khi click vào lớp phủ ngoài, không phải box nội dung
        if (event.target === infoModal) closeModal();
    });
}


/**
 * Hiển thị một hộp thoại thông báo tùy chỉnh.
 */
export function showCustomAlert(title, message, iconClass = 'fa-solid fa-check-circle') {
    const oldAlert = document.querySelector('.custom-alert-overlay');
    if (oldAlert) oldAlert.remove();
    const alertHTML = `
        <div class="custom-alert-overlay">
            <div class="custom-alert-box">
                <div class="icon"><i class="${iconClass}"></i></div>
                <h3>${title}</h3>
                <p>${message}</p>
                <button class="btn btn-primary">OK</button>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', alertHTML);
    const overlay = document.querySelector('.custom-alert-overlay');
    const closeButton = overlay.querySelector('.btn-primary');
    setTimeout(() => overlay.classList.add('show'), 10);

    const closeAlert = () => {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    };
    closeButton.addEventListener('click', closeAlert);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAlert();
    });
}

/**
 * Render một thẻ tour và chèn vào DOM.
 */
export function renderTourCard(tourId, tour, delay = 0) {
    let tourName = tour.name;
    let starRatingHTML = '';
    const starMatch = tour.name.match(/(\d)\*$/);
    if (starMatch) {
        tourName = tour.name.replace(/(\d)\*$/, '').trim();
        const starCount = parseInt(starMatch[1], 10);
        starRatingHTML = `<div class="star-rating">${'<i class="fa-solid fa-star"></i>'.repeat(starCount)}</div>`;
    }
    let priceHTML = '';
    if (tour.originalPrice) {
        priceHTML = `<span class="tour-original-price">${tour.originalPrice.toLocaleString('vi-VN')} VNĐ</span> <span class="tour-current-price">${tour.price.toLocaleString('vi-VN')} VNĐ</span>`;
    } else {
        priceHTML = `<span class="tour-current-price">${tour.price.toLocaleString('vi-VN')} VNĐ</span>`;
    }
    return `
        <div class="tour-card reveal" data-id="${tourId}" style="transition-delay: ${delay}ms">
            <div class="tour-card-image"><img src="${tour.gallery[0]}" alt="${tour.name}"></div>
            <div class="tour-card-content">
                <h3>${tourName}</h3>
                ${starRatingHTML}
                <p class="tour-dates"><i class="fa-solid fa-calendar-days"></i> ${formatDateRange(tour.startDate, tour.endDate)}</p>
                <div class="tour-price-wrapper">${priceHTML}</div>
                <a href="tour-detail.html?id=${tourId}" class="btn btn-primary">Xem Chi Tiết</a>
            </div>
        </div>`;
}

/**
 * Khởi tạo và quản lý modal "Tìm kiếm" cho di động.
 */
export function initSearchModal() {
    const searchLinkMobile = document.getElementById('search-link-mobile');
    const searchModal = document.getElementById('search-modal');

    if (!searchLinkMobile || !searchModal) return;

    const closeButton = searchModal.querySelector('.close-btn');

    const openModal = () => {
        searchModal.classList.add('show');
        document.body.classList.add('modal-open');
    };

    const closeModal = () => {
        searchModal.classList.remove('show');
        document.body.classList.remove('modal-open');
    };

    searchLinkMobile.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.remove('mobile-nav-open');
        setTimeout(() => openModal(), 400);
    });

    closeButton.addEventListener('click', closeModal);
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeModal();
    });
}
// [MỚI] Hàm hiển thị popup thanh toán thành công với hiệu ứng đặc biệt
// [NÂNG CẤP TOÀN DIỆN] Hàm hiển thị popup thanh toán siêu cấp đặc biệt
// [NÂNG CẤP CUỐI CÙNG] Popup với Lễ Hội Pháo Hoa Bất Tận
// [NÂNG CẤP PHÁO HOA RỰC RỠ]
export function showCheckoutSuccessPopup(message) {
    if (document.querySelector('.checkout-success-overlay')) return;

    const popupHTML = `
        <div class="checkout-success-overlay">
            <div class="checkout-success-box">
                <button class="close-btn">×</button>
                <div class="profile-image-container">
                    <img src="images/profile-image.png" alt="Profile Image">
                </div>
                <p class="success-message">${message}</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    const iconClass = '.profile-image-container';
    const messageClass = '.success-message';

    const overlay = document.querySelector('.checkout-success-overlay');
    const box = overlay.querySelector('.checkout-success-box');
    const icon = overlay.querySelector(iconClass);
    const text = overlay.querySelector(messageClass);
    const closeButton = overlay.querySelector('.close-btn');
    const audio = document.getElementById('checkout-sound');
    
    let confettiInterval = null;

    // --- [LOGIC MỚI] Kịch bản pháo hoa RÕ NÉT VÀ HOÀNH TRÁNG HƠN ---
    const startContinuousConfetti = () => {
        const fire = (particleRatio, opts) => {
            if (!window.confetti) return;

            // [THAY ĐỔI] Tăng số lượng và kích thước hạt pháo hoa
            const defaults = {
                origin: { y: 0.7 },
                scalar: 1.2, // Hạt to hơn
                gravity: 0.8, // Rơi chậm hơn một chút
                decay: 0.92, // Tồn tại lâu hơn một chút
                zIndex: 9999 // [QUAN TRỌNG] Đảm bảo pháo hoa luôn hiển thị trên cùng
            };

            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(250 * particleRatio) // Tăng số lượng hạt
            }));
        }

        // [THAY ĐỔI] Bảng màu rực rỡ hơn
        const vibrantColors = ['#FF5722', '#FFC107', '#03A9F4', '#4CAF50', '#9C27B0', '#FFFFFF'];

        const randomFireworks = () => {
            // Pháo hoa tròn từ 2 bên
            fire(0.25, { spread: 30, startVelocity: 60, origin: { x: 0.1, y: 0.8 }, colors: vibrantColors.slice(0,3) });
            fire(0.2, { spread: 60, origin: { x: 0.9, y: 0.8 }, colors: vibrantColors.slice(2,5) });
            // Pháo hoa hình sao ở giữa
            fire(0.35, { spread: 100, scalar: 1.5, shapes: ['star'], colors: ['#FFD700', '#FFFAFA', '#C0C0C0'], origin: { x: 0.5, y: 0.7 } });
            // Pháo hoa nhỏ bất ngờ
            fire(0.1, { spread: 120, startVelocity: 30, scalar: 1.2, origin: { x: Math.random(), y: 0.8 }, colors: vibrantColors });
            fire(0.1, { spread: 120, startVelocity: 50, origin: { x: Math.random(), y: 0.8 }, colors: vibrantColors });

            // Lặp lại sau một khoảng thời gian ngẫu nhiên
            confettiInterval = setTimeout(randomFireworks, Math.random() * 1500 + 800);
        }
        
        // Bắt đầu vòng lặp
        randomFireworks();
    };


    const closePopup = () => {
        if (audio) audio.pause();
        clearTimeout(confettiInterval);
        
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 500);
        document.body.classList.remove('modal-open');
    };
    
    closeButton.addEventListener('click', closePopup);
    overlay.addEventListener('click', e => { if (e.target === overlay) closePopup(); });

    // Hiển thị và kích hoạt
    document.body.classList.add('modal-open');
    setTimeout(() => {
        overlay.classList.add('show');
        box.classList.add('show');
        
        setTimeout(() => {
            icon.classList.add('show');
            text.classList.add('show');
            
            // Màn mở đầu hoành tráng
            if (audio) {
                audio.currentTime = 0;
                audio.play();
            }
            confetti({
                particleCount: 300, // Nhiều hạt hơn
                spread: 120,       // Rộng hơn
                origin: { y: 0.6 },
                shapes: ['star'],
                scalar: 1.8, // TO HƠN NỮA
                colors: ['#FFD700', '#FFFFFF', '#FFC0CB'],
                zIndex: 9999
            });

            // Bắt đầu Lễ Hội Pháo Hoa Bất Tận sau 0.5 giây
            setTimeout(startContinuousConfetti, 500);

        }, 500);
    }, 10);
}
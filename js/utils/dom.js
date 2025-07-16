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

            // Kiểm tra để đảm bảo không can thiệp vào các link có hash trên cùng một trang,
            // vì việc này đã được initSmoothScroll xử lý.
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
 * Khởi tạo các hiệu ứng hoạt ảnh dựa trên vị trí cuộn của người dùng,
 * như làm cho header thay đổi và nút "Back to Top" xuất hiện.
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
 * [NÂNG CẤP] Xử lý việc cuộn mượt đến các anchor link (#).
 * Bao gồm cả việc click trên trang hiện tại và việc được điều hướng từ trang khác tới.
 */
export function initSmoothScroll() {
    // 1. Xử lý các link cuộn nội bộ trang khi người dùng click
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link || !link.hash) return;

        // Chỉ xử lý nếu link trỏ đến một ID trên trang HIỆN TẠI
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

    // 2. Xử lý khi trang được tải với một hash trong URL
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
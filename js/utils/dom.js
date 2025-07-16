// js/utils/dom.js

import { formatDateRange } from './formatters.js';

export function initPageTransitions() {
    document.body.classList.remove('is-loading');
    const allLinks = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href*="javascript:"]):not(.no-transition)');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href.startsWith('javascript:')) return;
            
            e.preventDefault();
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        });
    });
}

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

export function initSmoothScroll() {
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="#"]');
        if (!link) return;

        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        if (url.pathname === currentUrl.pathname && url.hash) {
            e.preventDefault();
            const targetId = url.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
}

export function initContactModal() {
    const contactLink = document.getElementById('contact-link');
    const contactModal = document.getElementById('contact-modal');
    if (!contactLink || !contactModal) return;
    const closeButton = contactModal.querySelector('.close-btn');
    contactLink.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        contactModal.classList.add('show');
    });
    const closeModal = () => contactModal.classList.remove('show');
    closeButton.addEventListener('click', closeModal);
    contactModal.addEventListener('click', (event) => {
        if (event.target === contactModal) closeModal();
    });
}

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


// [CẢI TIẾN] Sửa lại hàm render thẻ tour để hiển thị tên và sao đẹp hơn
export function renderTourCard(tourId, tour, delay = 0) {
    let tourName = tour.name;
    let starRatingHTML = '';
    
    // Tách tên và số sao
    const starMatch = tour.name.match(/(\d)\*$/);
    if (starMatch) {
        tourName = tour.name.replace(/(\d)\*$/, '').trim();
        const starCount = parseInt(starMatch[1], 10);
        starRatingHTML = `
            <div class="star-rating">
                ${'<i class="fa-solid fa-star"></i>'.repeat(starCount)}
            </div>`;
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
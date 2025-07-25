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
 * [CẬP NHẬT TOÀN DIỆN] Xử lý cuộn mượt đến anchor link, tính toán thủ công để tránh header.
 */
export function initSmoothScroll() {
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        // Chỉ xử lý các link cuộn nội trang (có hash)
        if (!link || !link.hash || link.pathname !== window.location.pathname) return;

        e.preventDefault();
        e.stopPropagation();
        
        const targetId = link.hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const headerOffset = 100; // Chiều cao header (80px) + 20px khoảng đệm
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });

    // Phần xử lý khi tải lại trang với hash vẫn giữ nguyên
    window.addEventListener('load', () => {
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                setTimeout(() => {
                     const headerOffset = 100;
                     const elementPosition = targetElement.getBoundingClientRect().top;
                     const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                     window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
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
    const startContinuousConfetti = () => {
        const fire = (particleRatio, opts) => {
            if (!window.confetti) return;
            const defaults = {
                origin: { y: 0.7 },
                scalar: 1.2, 
                gravity: 0.8, 
                decay: 0.92, 
                zIndex: 9999 
            };
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(250 * particleRatio) 
            }));
        }
        const vibrantColors = ['#FF5722', '#FFC107', '#03A9F4', '#4CAF50', '#9C27B0', '#FFFFFF'];
        const randomFireworks = () => {
            fire(0.25, { spread: 30, startVelocity: 60, origin: { x: 0.1, y: 0.8 }, colors: vibrantColors.slice(0,3) });
            fire(0.2, { spread: 60, origin: { x: 0.9, y: 0.8 }, colors: vibrantColors.slice(2,5) });
            fire(0.35, { spread: 100, scalar: 1.5, shapes: ['star'], colors: ['#FFD700', '#FFFAFA', '#C0C0C0'], origin: { x: 0.5, y: 0.7 } });
            fire(0.1, { spread: 120, startVelocity: 30, scalar: 1.2, origin: { x: Math.random(), y: 0.8 }, colors: vibrantColors });
            fire(0.1, { spread: 120, startVelocity: 50, origin: { x: Math.random(), y: 0.8 }, colors: vibrantColors });
            confettiInterval = setTimeout(randomFireworks, Math.random() * 1500 + 800);
        }
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

    document.body.classList.add('modal-open');
    setTimeout(() => {
        overlay.classList.add('show');
        box.classList.add('show');
        
        setTimeout(() => {
            icon.classList.add('show');
            text.classList.add('show');
            
            if (audio) {
                audio.currentTime = 0;
                audio.play();
            }
            confetti({
                particleCount: 300, 
                spread: 120,       
                origin: { y: 0.6 },
                shapes: ['star'],
                scalar: 1.8,
                colors: ['#FFD700', '#FFFFFF', '#FFC0CB'],
                zIndex: 9999
            });
            setTimeout(startContinuousConfetti, 500);

        }, 500);
    }, 10);
}
// Thêm hàm này vào cuối file js/utils/dom.js

export function createSearchableDropdown(inputElement, listContainer, data) {
    inputElement.addEventListener('input', () => {
        const query = inputElement.value.toLowerCase().trim();
        listContainer.innerHTML = '';
        if (!query) {
            listContainer.style.display = 'none';
            return;
        }
        const filteredData = data.filter(item => 
            item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .includes(query.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        );

        if (filteredData.length > 0) {
            filteredData.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.textContent = item;
                itemDiv.addEventListener('click', () => {
                    inputElement.value = item;
                    listContainer.style.display = 'none';
                });
                listContainer.appendChild(itemDiv);
            });
            listContainer.style.display = 'block';
        } else {
            listContainer.style.display = 'none';
        }
    });

    document.addEventListener('click', (event) => {
        if (!inputElement.contains(event.target) && !listContainer.contains(event.target)) {
            listContainer.style.display = 'none';
        }
    });
}
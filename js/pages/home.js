// js/pages/home.js

import { tours } from '../data/tours.js';
import { renderTourCard } from '../utils/dom.js';

// Hàm này không thay đổi, giữ nguyên
function initSlider() {
    const banner = document.querySelector('.banner-slider');
    if (!banner) return;
    const slides = banner.querySelectorAll('.slide');
    const dotsContainer = banner.querySelector('.slider-dots');
    if (!slides.length || !dotsContainer) return;

    let currentSlide = 0;
    dotsContainer.innerHTML = ''; 

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.dot');
    
    function goToSlide(n) {
        if (!slides[currentSlide] || !dots[currentSlide]) return;
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    if (slides.length > 1) {
        setInterval(() => goToSlide(currentSlide + 1), 5000);
    }
}

// [SỬA LỖI TRIỆT ĐỂ]
function initTourScrollList() {
    const scrollContainer = document.getElementById('tour-grid-scrollable');
    const prevBtn = document.getElementById('scroll-prev');
    const nextBtn = document.getElementById('scroll-next');

    if (!scrollContainer || !prevBtn || !nextBtn) {
        return;
    }

    // 1. Render các thẻ tour
    scrollContainer.innerHTML = '';
    let delay = 0;
    for (const tourId in tours) {
        if (Object.hasOwnProperty.call(tours, tourId)) {
            const tour = tours[tourId];
            scrollContainer.insertAdjacentHTML('beforeend', renderTourCard(tourId, tour, delay));
            delay += 50;
        }
    }

    // 2. [QUAN TRỌNG] Kích hoạt animation cho các thẻ tour vừa được tạo
    const newRevealElements = scrollContainer.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    newRevealElements.forEach(el => observer.observe(el));


    // 3. Gán sự kiện cho các nút bấm
    const scrollAmount = 370; // (Chiều rộng thẻ 340px + gap 30px)

    nextBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
}


export function initHomePage() {
    initSlider();
    initTourScrollList();
}
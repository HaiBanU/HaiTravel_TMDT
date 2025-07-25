// js/pages/home.js

import { tours } from '../data/tours.js';
import { renderTourCard } from '../utils/dom.js';

// Hàm initSlider giữ nguyên
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

// [CẬP NHẬT HOÀN TOÀN] Hàm initTourScrollList để tạo hiệu ứng marquee
function initTourScrollList() {
    const scrollContainer = document.getElementById('tour-grid-scrollable');
    if (!scrollContainer) return;

    // 1. Render các thẻ tour gốc
    scrollContainer.innerHTML = ''; // Xóa nội dung cũ
    const tourEntries = Object.entries(tours);
    tourEntries.forEach(([tourId, tour]) => {
        // Sử dụng renderTourCard nhưng loại bỏ hiệu ứng reveal mặc định
        let tourCardHTML = renderTourCard(tourId, tour);
        // Bỏ class reveal để tránh xung đột
        tourCardHTML = tourCardHTML.replace('class="tour-card reveal"', 'class="tour-card"');
        scrollContainer.insertAdjacentHTML('beforeend', tourCardHTML);
    });

    // 2. Nhân đôi nội dung để tạo vòng lặp liền mạch
    scrollContainer.innerHTML += scrollContainer.innerHTML;

    // 3. Tính toán và áp dụng animation
    const tourCount = tourEntries.length;
    // Tốc độ: 5 giây cho mỗi tour. Càng nhiều tour, thời gian chạy càng lâu
    const animationDuration = tourCount * 5; 
    
    // Áp dụng animation thông qua style
    scrollContainer.style.animation = `scroll ${animationDuration}s linear infinite`;
}


export function initHomePage() {
    initSlider();
    initTourScrollList();
}
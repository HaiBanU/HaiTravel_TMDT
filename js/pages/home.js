// js/pages/home.js

import { tours } from '../data/tours.js';
import { renderTourCard, createSearchableDropdown } from '../utils/dom.js';

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

function initTourScrollList() {
    const scrollContainer = document.getElementById('tour-grid-scrollable');
    if (!scrollContainer) return;

    scrollContainer.innerHTML = '';
    const tourEntries = Object.entries(tours);
    tourEntries.forEach(([tourId, tour]) => {
        let tourCardHTML = renderTourCard(tourId, tour);
        tourCardHTML = tourCardHTML.replace('class="tour-card reveal"', 'class="tour-card"');
        scrollContainer.insertAdjacentHTML('beforeend', tourCardHTML);
    });

    scrollContainer.innerHTML += scrollContainer.innerHTML;

    const tourCount = tourEntries.length;
    const animationDuration = tourCount * 5; 
    
    scrollContainer.style.animation = `scroll ${animationDuration}s linear infinite`;
}

function initHomeSearch() {
    const tourDestinations = [
        "Hạ Long", "Hội An", "Sapa", "Đà Nẵng", 
        "Ninh Bình", "Phú Quốc", "Miền Tây", "Nha Trang"
    ];
    const uniqueDestinations = [...new Set(tourDestinations)].sort();

    const destInput = document.getElementById('search-dest');
    const destList = document.getElementById('search-dest-list');

    if (destInput && destList) {
        createSearchableDropdown(destInput, destList, uniqueDestinations);
    }
}

export function initHomePage() {
    initSlider();
    initTourScrollList();
    initHomeSearch();
}
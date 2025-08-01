import { tours } from '../data/tours.js';
import { addItemToCart } from '../services/cart.js';
import { formatTourName, formatDateRange } from '../utils/formatters.js';
import { showCustomAlert } from '../utils/dom.js';
import { getCurrentUser } from '../services/auth.js';

// [CẬP NHẬT] Thêm hiệu ứng xuất hiện cho tour gợi ý
function renderSuggestedTours(currentTourId, allTours) {
    const sidebarContainer = document.getElementById('suggested-tours-sidebar');
    if (!sidebarContainer) return;

    const suggestedTourIds = Object.keys(allTours)
        .filter(id => id !== currentTourId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

    if (suggestedTourIds.length === 0) return;

    let delay = 0;
    const toursHTML = suggestedTourIds.map(id => {
        const tour = allTours[id];
        const cardHTML = `
            <a href="tour-detail.html?id=${id}" class="sidebar-tour-card reveal" style="transition-delay: ${delay}ms">
                <div class="image-container">
                    <img src="${tour.gallery[0]}" alt="${tour.name}">
                </div>
                <div class="sidebar-tour-info">
                    <h4>${formatTourName(tour.name)}</h4>
                    <p class="price">${tour.price.toLocaleString('vi-VN')} VNĐ</p>
                </div>
            </a>
        `;
        delay += 100;
        return cardHTML;
    }).join('');

    sidebarContainer.innerHTML = `
        <h3>Tour Gợi Ý</h3>
        <div class="suggested-tours-list">
            ${toursHTML}
        </div>
    `;
    
    const newRevealElements = sidebarContainer.querySelectorAll('.reveal');
    setTimeout(() => {
        newRevealElements.forEach(el => el.classList.add('active'));
    }, 100);
}

// [THÊM MỚI] Hàm khởi tạo và quản lý mục lục
function initTourNavigation() {
    const navContainer = document.getElementById('tour-nav-sidebar');
    const activitiesSection = document.getElementById('tour-activities-section');
    const itinerarySection = document.getElementById('itinerary-section');
    const reviewsSection = document.getElementById('tour-reviews');

    if (!navContainer || !itinerarySection || !reviewsSection) return;

    let navHTML = `<h3>Mục lục</h3><ul class="nav-list">`;
    if (activitiesSection && activitiesSection.style.display !== 'none') {
        navHTML += `<li><a href="#tour-activities-section" class="nav-link">Hoạt Động Nổi Bật</a></li>`;
    }
    navHTML += `<li><a href="#itinerary-section" class="nav-link">Lịch Trình</a></li>`;
    navHTML += `<li><a href="#tour-reviews" class="nav-link">Đánh Giá</a></li>`;
    navHTML += `</ul>`;
    navContainer.innerHTML = navHTML;

    const navLinks = navContainer.querySelectorAll('.nav-link');
    const sections = [activitiesSection, itinerarySection, reviewsSection].filter(Boolean);

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Kích hoạt khi section ở giữa màn hình
        threshold: 0
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = navContainer.querySelector(`a[href="#${id}"]`);
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section) observer.observe(section);
    });
}

async function renderReviews(tourId) {
    const reviewListContainer = document.getElementById('review-list');
    if (!reviewListContainer) return;
    try {
        const response = await fetch(`https://haitravel-backend.onrender.com/api/tours/${tourId}/reviews`);
        const reviews = await response.json();
        if (!reviews || reviews.length === 0) {
            reviewListContainer.innerHTML = '<p>Chưa có đánh giá nào cho tour này. Hãy là người đầu tiên để lại cảm nhận của bạn!</p>';
            return;
        }
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const reviewsHTML = reviews.map(review => {
            const starsHTML = Array.from({ length: 5 }, (_, i) => `<i class="fa-solid fa-star${i < review.rating ? '' : ' empty'}"></i>`).join('');
            return `
                <div class="review-card">
                    <div class="review-author">
                        <i class="fa-solid fa-circle-user review-author-icon"></i>
                        <div>
                            <strong>${review.name}</strong>
                            <span>${new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>
                    <div class="review-rating">${starsHTML}</div>
                    <p class="review-comment">${review.comment}</p>
                </div>`;
        }).join('');
        reviewListContainer.innerHTML = reviewsHTML;
    } catch (error) {
        console.error("Lỗi khi tải đánh giá:", error);
        reviewListContainer.innerHTML = '<p>Không thể tải được các đánh giá vào lúc này.</p>';
    }
}

function initReviewForm(tourId) {
    const reviewForm = document.getElementById('review-form');
    if (!reviewForm) return;

    const ratingInput = reviewForm.querySelector('input[name="rating"]');
    const nameInput = reviewForm.elements['name'];
    const submitBtn = reviewForm.querySelector('button[type="submit"]');
    const stars = reviewForm.querySelectorAll('.star-input i');

    const user = getCurrentUser();
    if (user) {
        nameInput.value = user.name;
        nameInput.readOnly = true;
    }

    stars.forEach(star => {
        star.addEventListener('click', function() {
            ratingInput.value = this.dataset.value;
            stars.forEach(s => s.classList.toggle('selected', s.dataset.value <= this.dataset.value));
        });
    });

    reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi...';
        const name = nameInput.value;
        const rating = ratingInput.value;
        const comment = this.elements['comment'].value;

        if (!name || !rating || !comment) {
            showCustomAlert('Lỗi', 'Vui lòng điền đủ tên, đánh giá và bình luận.', 'fa-solid fa-circle-xmark');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Gửi đánh giá';
            return;
        }

        try {
            const reviewPayload = { name, rating, comment };
            const reviewRes = await fetch(`https://haitravel-backend.onrender.com/api/tours/${tourId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewPayload),
            });
            if (!reviewRes.ok) throw new Error((await reviewRes.json()).message || 'Gửi đánh giá thất bại.');
            showCustomAlert('Thành công!', 'Cảm ơn bạn đã chia sẻ đánh giá!');
            this.reset();
            if (user) nameInput.value = user.name;
            ratingInput.value = '';
            stars.forEach(s => s.classList.remove('selected'));
            await renderReviews(tourId);
        } catch (error)
        {
            showCustomAlert('Lỗi', error.message, 'fa-solid fa-circle-xmark');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Gửi đánh giá';
        }
    });
}

function renderActivities(activities) {
    const container = document.getElementById('activities-scroll-container');
    const section = document.getElementById('tour-activities-section');
    if (!container || !section || !activities || activities.length === 0) return;

    section.style.display = 'block';
    container.innerHTML = activities.map(activity => `
        <div class="activity-card">
            <div class="activity-image">
                <img src="${activity.image}" alt="${activity.title}">
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
        </div>
    `).join('');
}

function renderItinerary(itinerary) {
    const timelineContainer = document.getElementById('itinerary-timeline');
    if (!timelineContainer || !itinerary || itinerary.length === 0) return;

    let currentDay = '';
    let dayCounter = 0;
    const itineraryHTML = itinerary.map(item => {
        let dayIconHTML = '';
        if (item.day !== currentDay) {
            currentDay = item.day;
            dayCounter++;
            dayIconHTML = `<div class="timeline-icon">${dayCounter}</div>`;
        } else {
            dayIconHTML = `<div class="timeline-icon dot"></div>`;
        }

        return `
            <div class="timeline-item">
                ${dayIconHTML}
                <div class="timeline-content">
                    <h4>${item.day}</h4>
                    <p class="time">${item.time}</p>
                    <p>${item.details}</p>
                </div>
            </div>`;
    }).join('');
    
    timelineContainer.innerHTML = itineraryHTML;
}

function setupTransportCta(tour) {
    const ctaSection = document.getElementById('transport-cta-section');
    const citySpan = document.getElementById('transport-cta-city');
    const ctaBtn = document.getElementById('transport-cta-btn');

    if (!ctaSection || !citySpan || !ctaBtn || !tour.keyInfo || !tour.keyInfo.transportDestination) {
        return;
    }
    
    const destinationForLink = tour.keyInfo.transportDestination;
    
    const departureParts = tour.keyInfo.departure.split(' - ');
    const displayLocation = departureParts.length > 1 ? departureParts[1].trim() : tour.keyInfo.departure;

    citySpan.textContent = displayLocation;
    ctaBtn.href = `transport.html?endPoint=${encodeURIComponent(destinationForLink)}`;
    ctaSection.style.display = 'block';
}


export function initTourDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');
    const tour = tours[tourId];

    if (!tour) {
        document.querySelector('.tour-detail-page').innerHTML = '<h1 style="text-align:center; padding: 5rem 1rem;">Tour không tồn tại hoặc đã bị xóa.</h1>';
        return;
    }

    document.getElementById('tour-hero').style.backgroundImage = `url('${tour.gallery[0]}')`;
    document.title = `${tour.name} - Chi Tiết Tour & Lịch Trình | HaiTravel`;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
    }
    const descriptionContent = `Khám phá chi tiết tour '${tour.name}'. Lịch trình hấp dẫn với các hoạt động như: ${tour.activities[0]?.title || 'tham quan các địa điểm nổi tiếng'}. Đặt ngay tại HaiTravel!`;
    metaDescription.setAttribute('content', descriptionContent);
    document.getElementById('breadcrumbs').innerHTML = `<a href="index.html">Trang chủ</a> / <span>${tour.name}</span>`;
    document.getElementById('tour-title').innerHTML = formatTourName(tour.name);

    let priceHTML = '';
    if (tour.originalPrice) {
        priceHTML += `<p class="original-price">${tour.originalPrice.toLocaleString('vi-VN')} VNĐ</p>`;
    }
    priceHTML += `<p class="price-value">${tour.price.toLocaleString('vi-VN')} VNĐ <span class="price-unit">/ khách</span></p>`;
    document.getElementById('tour-price-container').innerHTML = priceHTML;

    if (tour.keyInfo) {
        document.getElementById('tour-key-info').innerHTML = `
            <div class="key-info-item"><i class="fa-solid fa-calendar-alt"></i> <span>Thời gian: ${formatDateRange(tour.startDate, tour.endDate)}</span></div>
            <div class="key-info-item"><i class="fa-solid fa-ship"></i> <span>Tuyến: ${tour.keyInfo.line}</span></div>
            <div class="key-info-item"><i class="fa-solid fa-clock"></i> <span>Khởi hành: ${tour.keyInfo.departure}</span></div>
            <div class="key-info-item"><i class="fa-solid fa-route"></i> <span>Hải trình: ${tour.keyInfo.route}</span></div>`;
    }
    
    const itineraryTitle = document.getElementById('itinerary-title');
    if (itineraryTitle) {
        const uniqueDays = [...new Set(tour.itinerary.map(item => item.day))].length;
        itineraryTitle.textContent = uniqueDays > 1 ? 'Lịch trình chi tiết' : 'Chi tiết hành trình trong ngày';
    }

    renderActivities(tour.activities);
    renderItinerary(tour.itinerary);
    setupTransportCta(tour);
    
    const populateList = (elementId, items) => {
        const container = document.getElementById(elementId);
        if (!container || !items || items.length === 0) {
            if (container) container.innerHTML = '<ul><li>Không có thông tin.</li></ul>';
            return;
        }
        container.innerHTML = `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    };
    
    const includesContainer = document.getElementById('info-includes');
    if (includesContainer) {
        let includesHTML = '<h4>Bao gồm:</h4><ul>';
        (tour.includes || []).forEach(item => includesHTML += `<li>${item}</li>`);
        includesHTML += '</ul>';
        if (tour.notIncludes && tour.notIncludes.length > 0) {
            includesHTML += '<h4 style="margin-top: 1rem;">Không bao gồm:</h4><ul>';
            (tour.notIncludes || []).forEach(item => includesHTML += `<li>${item}</li>`);
            includesHTML += '</ul>';
        }
        includesContainer.innerHTML = includesHTML;
    }

    populateList('info-documents', tour.documents);
    populateList('info-prepare', tour.prepare);
    populateList('info-terms', tour.terms);
    
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        const itemData = {
            itemId: tourId,
            name: tour.name,
            price: tour.price,
            image: `../${tour.gallery[0]}`,
            startDate: tour.startDate,
            endDate: tour.endDate,
        };
        addItemToCart(itemData);
    });

    renderReviews(tourId);
    initReviewForm(tourId);
    renderSuggestedTours(tourId, tours);

    // [THÊM MỚI] Gọi hàm khởi tạo mục lục
    initTourNavigation();
}
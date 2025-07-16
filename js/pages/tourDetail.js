import { tours } from '../data/tours.js';
import { addItemToCart } from '../services/cart.js';
import { formatTourName, formatDateRange } from '../utils/formatters.js';
import { showCustomAlert } from '../utils/dom.js';
import { getCurrentUser } from '../services/auth.js';

// Hàm lấy và hiển thị reviews từ server
async function renderReviews(tourId) {
    const reviewListContainer = document.getElementById('review-list');
    if (!reviewListContainer) return;

    try {
        const response = await fetch(`http://localhost:5000/api/tours/${tourId}/reviews`);
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

// Hàm khởi tạo form đánh giá (đã loại bỏ chức năng ảnh)
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
            const reviewPayload = { name, rating, comment }; // Không còn trường image
            const reviewRes = await fetch(`http://localhost:5000/api/tours/${tourId}/reviews`, {
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

        } catch (error) {
            showCustomAlert('Lỗi', error.message, 'fa-solid fa-circle-xmark');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Gửi đánh giá';
        }
    });
}

// Hàm khởi tạo chính của trang
export function initTourDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');
    const tour = tours[tourId];

    if (!tour) {
        document.querySelector('.tour-detail-page').innerHTML = '<h1 style="text-align:center; padding: 5rem 1rem;">Tour không tồn tại hoặc đã bị xóa.</h1>';
        return;
    }

    // --- Render thông tin tour từ dữ liệu tĩnh ---
    document.getElementById('tour-hero').style.backgroundImage = `url('../${tour.gallery[0]}')`;
    document.title = `${tour.name} - HaiTravel`;
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
    
    if (tour.highlights && tour.highlights.length > 0) {
        let highlightsHTML = '<h2>Điểm nhấn hành trình</h2><ul>';
        tour.highlights.forEach(item => highlightsHTML += `<li><i class="fa-solid fa-check"></i> ${item}</li>`);
        highlightsHTML += '</ul>';
        document.getElementById('tour-highlights').innerHTML = highlightsHTML;
    }

    document.getElementById('itinerary-title').textContent = tour.itinerary.length > 1 ? `Lịch trình chi tiết` : 'Lịch trình trong ngày';
    const itineraryContainer = document.getElementById('itinerary-details');
    itineraryContainer.innerHTML = '';
    tour.itinerary.forEach(item => {
        const detailElement = document.createElement('details');
        detailElement.setAttribute('open', '');
        detailElement.innerHTML = `<summary><strong>${item.day}</strong></summary><div class="details-content"><p>${item.details}</p></div>`;
        itineraryContainer.appendChild(detailElement);
    });
    
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
}
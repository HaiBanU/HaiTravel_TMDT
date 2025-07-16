import { tours } from '../data/tours.js';
import { renderTourCard } from '../utils/dom.js';

function filterAndRenderTours() {
    // [SỬA LỖI] Tìm các thẻ có class là .is-selected thay vì .active
    const selectedTags = Array.from(document.querySelectorAll('.interest-tag-card.is-selected')).map(el => el.dataset.tag);
    const resultsGrid = document.getElementById('discover-results-grid');
    const noResultsMessage = document.getElementById('no-results-message');
    const resultsTitle = document.getElementById('discover-results-title');

    if (!resultsGrid || !noResultsMessage || !resultsTitle) return;

    resultsGrid.innerHTML = '';
    let filteredTours = [];

    if (selectedTags.length === 0) {
        filteredTours = Object.entries(tours);
        resultsTitle.textContent = "Tất Cả Các Tour Nổi Bật";
    } else {
        filteredTours = Object.entries(tours).filter(([, tour]) => 
            tour.tags && tour.tags.some(tourTag => selectedTags.includes(tourTag))
        );
        resultsTitle.textContent = "Kết Quả Phù Hợp Với Bạn";
    }
    
    if (filteredTours.length > 0) {
        let delay = 0;
        filteredTours.forEach(([id, tour]) => {
            resultsGrid.insertAdjacentHTML('beforeend', renderTourCard(id, tour, delay));
            delay += 50;
        });
        // Kích hoạt animation cho các thẻ tour vừa được tạo
        resultsGrid.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
        noResultsMessage.style.display = 'none';
        resultsGrid.style.display = 'grid';
    } else {
        noResultsMessage.style.display = 'block';
        resultsGrid.style.display = 'none';
    }
}

function addEventListeners() {
    const grid = document.getElementById('interest-tags-grid');
    if (!grid) return;

    grid.addEventListener('click', (event) => {
        const card = event.target.closest('.interest-tag-card');
        if (card) {
            // [SỬA LỖI] Bật/tắt class .is-selected thay vì .active
            card.classList.toggle('is-selected');
            filterAndRenderTours();
        }
    });
}

export function initDiscoverPage() {
    // Không cần hàm render nữa vì HTML đã có sẵn các thẻ
    addEventListeners();
    filterAndRenderTours(); // Hiển thị tất cả tour lúc ban đầu
}
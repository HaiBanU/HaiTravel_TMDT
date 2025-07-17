// js/pages/discover.js

import { tours } from '../data/tours.js';
import { renderTourCard } from '../utils/dom.js';

function filterAndRenderTours() {
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
        const selectedTagNames = Array.from(document.querySelectorAll('.interest-tag-card.is-selected span:first-of-type'))
                                     .map(span => `"${span.textContent.trim()}"`)
                                     .join(' hoặc ');
        resultsTitle.textContent = `Gợi ý cho sở thích ${selectedTagNames}`;
        filteredTours = Object.entries(tours).filter(([, tour]) => 
            tour.tags && tour.tags.some(tourTag => selectedTags.includes(tourTag))
        );
    }
    
    if (filteredTours.length > 0) {
        let delay = 0;
        filteredTours.forEach(([id, tour]) => {
            resultsGrid.insertAdjacentHTML('beforeend', renderTourCard(id, tour, delay));
            delay += 50;
        });
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
            card.classList.toggle('is-selected');
            filterAndRenderTours();
        }
    });
}

export function initDiscoverPage() {
    addEventListeners();
    const urlParams = new URLSearchParams(window.location.search);
    const tarotTagsParam = urlParams.get('tags');

    if (tarotTagsParam) {
        const tagsToSelect = tarotTagsParam.split(',');
        tagsToSelect.forEach(tag => {
            const tagElement = document.querySelector(`.interest-tag-card[data-tag="${tag.trim()}"]`);
            if (tagElement) {
                tagElement.classList.add('is-selected');
            }
        });
    }

    filterAndRenderTours(); 
}
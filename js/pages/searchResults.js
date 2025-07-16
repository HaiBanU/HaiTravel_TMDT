import { tours } from '../data/tours.js';
import { renderTourCard } from '../utils/dom.js';
import { formatDate } from '../utils/formatters.js';

export function initSearchResultsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const destInput = (urlParams.get('dest') || '').toLowerCase().trim();
    const dateInput = urlParams.get('date') || '';
    
    const queryDisplay = document.getElementById('search-query-display');
    if (queryDisplay) {
        let displayText = '';
        if (destInput) displayText += `cho điểm đến: "<strong>${destInput}</strong>"`;
        if (dateInput) {
            if (destInput) displayText += ' và ';
            displayText += `vào ngày: "<strong>${formatDate(dateInput)}</strong>"`;
        }
        if (!displayText) {
            displayText = 'Hiển thị tất cả các tour';
        }
        queryDisplay.innerHTML = displayText;
    }

    const tourGrid = document.querySelector('.tour-grid');
    const noResultsMessage = document.getElementById('no-results-message');
    if (!tourGrid || !noResultsMessage) return;

    tourGrid.innerHTML = '';
    let resultsFound = 0;

    for (const tourId in tours) {
        const tour = tours[tourId];
        const nameMatch = tour.name.toLowerCase().includes(destInput);
        const dateMatch = (dateInput === '' || tour.startDate === dateInput);

        if (nameMatch && dateMatch) {
            tourGrid.insertAdjacentHTML('beforeend', renderTourCard(tourId, tour));
            resultsFound++;
        }
    }
    
    tourGrid.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    noResultsMessage.style.display = resultsFound === 0 ? 'block' : 'none';
}
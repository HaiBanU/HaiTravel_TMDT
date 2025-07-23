// js/pages/transportPage.js

import { vietnamProvinces, transportRoutes, vehicleInfo } from '../data/transport.js';
import { addItemToCart } from '../services/cart.js'; 
import { formatTravelTime } from '../utils/formatters.js';
import { showCustomAlert } from '../utils/dom.js';

function createSearchableDropdown(inputElement, listContainer, data) {
    inputElement.addEventListener('input', () => {
        const query = inputElement.value.toLowerCase().trim();
        listContainer.innerHTML = '';
        if (!query) {
            listContainer.style.display = 'none';
            return;
        }
        const filteredData = data.filter(item => item.toLowerCase().includes(query));
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


function renderTransportResults(routeData) {
    document.getElementById('route-map-image').src = `${routeData.mapImage}`;
    document.getElementById('route-title').textContent = `${routeData.start} → ${routeData.end}`;
    
    document.getElementById('route-description').textContent = routeData.description || 'Hành trình tuyệt vời đang chờ đón bạn.';
    document.getElementById('route-distance-stat').innerHTML = `<strong>~${routeData.distance} km</strong>`;
    
    const fastestTimeEl = document.getElementById('route-fastest-time');
    if (routeData.distance >= 300) {
        const planeTime = formatTravelTime(routeData.distance, vehicleInfo.airplane.avgSpeed, 'Máy bay');
        fastestTimeEl.parentElement.style.display = 'flex';
        fastestTimeEl.innerHTML = `Nhanh nhất: <strong>${planeTime}</strong>`;
    } else {
        fastestTimeEl.parentElement.style.display = 'none';
    }

    const vehicleOptionsContainer = document.getElementById('vehicle-options');
    vehicleOptionsContainer.innerHTML = '';
    const departDate = document.getElementById('depart-date').value;

    for (const vehicleKey in vehicleInfo) {
        const vehicle = vehicleInfo[vehicleKey];
        if (vehicle.name === 'Máy bay' && routeData.distance < 300) continue;
        if (vehicle.name === 'Tàu hoả' && !routeData.trainPrice) continue;
        
        const travelTime = formatTravelTime(routeData.distance, vehicle.avgSpeed, vehicle.name);
        
        let currentPrice = 0;
        if (vehicleKey === 'airplane') currentPrice = 1800000 + (routeData.distance * 1200);
        else if (vehicleKey === 'bus') currentPrice = routeData.distance * 2200;
        else if (vehicleKey === 'train') currentPrice = routeData.trainPrice;
        
        if (!currentPrice) continue;

        const originalPrice = currentPrice * 1.20;

        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'vehicle-option-card reveal active';
        vehicleCard.innerHTML = `
            <div class="icon"><i class="${vehicle.icon}"></i></div>
            <h5>${vehicle.name}</h5>
            <p class="time-estimate"><i class="fa-solid fa-clock"></i>~ ${travelTime}</p>
            <div class="vehicle-price-wrapper">
                <span class="vehicle-original-price">${originalPrice.toLocaleString('vi-VN')} VNĐ</span>
                <span class="vehicle-current-price">${currentPrice.toLocaleString('vi-VN')} VNĐ</span>
            </div>
        `;
        const button = document.createElement('button');
        button.className = 'btn btn-primary';
        button.textContent = 'Thêm vào giỏ';

        button.onclick = () => {
            const itemData = {
                itemId: `transport-${routeData.start}-${routeData.end}-${vehicle.name}-${departDate}`.replace(/\s/g, '-').toLowerCase(),
                name: `Vé ${vehicle.name}: ${routeData.start} → ${routeData.end}`,
                price: currentPrice,
                image: 'images/logo-haitravel.jpg',
                startDate: departDate,
                endDate: departDate,
            };
            addItemToCart(itemData);
        };

        vehicleCard.appendChild(button);
        vehicleOptionsContainer.appendChild(vehicleCard);
    }
}

function handleTransportSearch(event) {
    event.preventDefault();
    const startPoint = document.getElementById('start-point-input').value;
    const endPoint = document.getElementById('end-point-input').value;
    const resultsContainer = document.getElementById('transport-results');
    const noResultsMessage = document.getElementById('no-route-message');

    if (!startPoint || !endPoint) {
        showCustomAlert('Lỗi', 'Vui lòng chọn cả điểm đi và điểm đến.', 'fa-solid fa-circle-xmark');
        return;
    }
    
    if (!vietnamProvinces.includes(startPoint) || !vietnamProvinces.includes(endPoint)) {
        showCustomAlert('Lỗi', 'Vui lòng chọn điểm đi và điểm đến hợp lệ từ danh sách gợi ý.', 'fa-solid fa-circle-xmark');
        return;
    }

    if (startPoint === endPoint) {
        showCustomAlert('Lỗi', 'Điểm đi và điểm đến không được trùng nhau.', 'fa-solid fa-circle-xmark');
        resultsContainer.style.display = 'none';
        noResultsMessage.style.display = 'none';
        return;
    }

    const formatKey = (str) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '');
    const routeKey = `${formatKey(startPoint)}-${formatKey(endPoint)}`;
    const reverseRouteKey = `${formatKey(endPoint)}-${formatKey(startPoint)}`;
    const routeData = transportRoutes[routeKey] || transportRoutes[reverseRouteKey];

    if (routeData) {
        const displayData = transportRoutes[routeKey] ? routeData : { ...routeData, start: endPoint, end: startPoint };
        renderTransportResults(displayData);
        resultsContainer.style.display = 'block';
        noResultsMessage.style.display = 'none';
    } else {
        resultsContainer.style.display = 'none';
        noResultsMessage.style.display = 'block';
    }
}

export function initTransportPage() {
    const form = document.getElementById('transport-booking-form');
    if (!form) return;

    const startPointInput = document.getElementById('start-point-input');
    const startPointList = document.getElementById('start-point-list');
    createSearchableDropdown(startPointInput, startPointList, vietnamProvinces);

    const endPointInput = document.getElementById('end-point-input');
    const endPointList = document.getElementById('end-point-list');
    createSearchableDropdown(endPointInput, endPointList, vietnamProvinces);

    try {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 7);
        document.getElementById('depart-date').min = today.toISOString().split('T')[0];
        document.getElementById('depart-date').value = futureDate.toISOString().split('T')[0];
    } catch (e) {
        console.error("Không thể đặt ngày mặc định cho trang đặt vé.", e);
    }
    
    form.addEventListener('submit', handleTransportSearch);

    // [THÊM MỚI] Tự động điền điểm đến từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const endPointParam = urlParams.get('endPoint');
    if (endPointParam) {
        endPointInput.value = endPointParam;
        // Gợi ý người dùng nhập điểm đi
        startPointInput.focus();
        showCustomAlert('Gợi ý', `Hãy nhập điểm xuất phát của bạn để tìm vé tới ${endPointParam}!`, 'fa-solid fa-circle-info');
    }
}
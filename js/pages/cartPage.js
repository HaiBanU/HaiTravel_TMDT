// js/pages/cartPage.js

import { getCart, removeItemFromCart, updateItemQuantity, fetchAndSetCart } from '../services/cart.js';
import { formatTourName, formatDateRange } from '../utils/formatters.js';
import { showCheckoutSuccessPopup } from '../utils/dom.js';

function addCartEventListeners() {
    const cartPageContainer = document.querySelector('.cart-page');
    if (!cartPageContainer) return;

    cartPageContainer.addEventListener('click', (event) => {
        if (event.target.id === 'checkout-btn') {
            event.preventDefault();
            showCheckoutSuccessPopup("Thầy Hiển đẹp trai sẽ cho nhóm em 10 điểm");
        }
    });


    if (cartPageContainer.dataset.cartListenersAttached) return;

    cartPageContainer.addEventListener('click', async (event) => {
        const button = event.target.closest('button');
        if (!button || button.id === 'checkout-btn') return;

        const id = button.dataset.id;
        if (!id) return;
        
        const currentCart = getCart();
        const item = currentCart[id];
        if (!item) return;

        button.disabled = true;

        if (button.classList.contains('btn-increase')) {
            await updateItemQuantity(id, item.quantity + 1);
        } else if (button.classList.contains('btn-decrease')) {
            await updateItemQuantity(id, item.quantity - 1);
        } else if (button.classList.contains('btn-remove')) {
            await removeItemFromCart(id);
        }
        
        renderCartPage(); 
        button.disabled = false;
    });

    cartPageContainer.dataset.cartListenersAttached = 'true';
}

function renderCartPage() {
    const cart = getCart();
    const cartItems = Object.values(cart);
    const cartItemsContainer = document.getElementById('cart-items-list');
    const cartSummaryContainer = document.getElementById('cart-summary-box');
    const cartLayout = document.querySelector('.cart-layout'); // [THÊM MỚI] Lấy layout grid

    if (!cartItemsContainer || !cartSummaryContainer || !cartLayout) return;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-cart-message"><h3>Giỏ hàng của bạn đang trống</h3><a href="index.html#tour-list-section" class="btn btn-primary">Khám phá tour ngay</a></div>`;
        cartSummaryContainer.style.display = 'none';
        cartLayout.style.gridTemplateColumns = '1fr'; // [CẬP NHẬT] Chuyển layout thành 1 cột
        return;
    }

    // [CẬP NHẬT] Khôi phục layout 2 cột khi có sản phẩm
    cartLayout.style.gridTemplateColumns = ''; // Xóa style inline để CSS gốc hoạt động
    cartSummaryContainer.style.display = 'block';
    
    let subtotal = 0;

    cartItemsContainer.innerHTML = cartItems.map(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        
        const imageOrIconHtml = item.image && item.image.includes('logo-haitravel.jpg') 
            ? `<div class="cart-item-icon-wrapper"><i class="fa-solid fa-ticket"></i></div>`
            : `<img src="${item.image}" alt="${item.name}">`;

        return `
            <div class="cart-item-card">
                ${imageOrIconHtml}
                <div class="cart-item-details">
                    <h3>${formatTourName(item.name)}</h3>
                    <p class="dates"><i class="fa-solid fa-calendar-days"></i> ${formatDateRange(item.startDate, item.endDate)}</p>
                    <p class="price">${item.price.toLocaleString('vi-VN')} VNĐ</p>
                </div>
                <div class="cart-item-right-section">
                    <div class="quantity-selector">
                        <button class="btn-decrease" data-id="${item.itemId}">-</button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button class="btn-increase" data-id="${item.itemId}">+</button>
                    </div>
                    <p class="item-subtotal">${itemSubtotal.toLocaleString('vi-VN')} VNĐ</p>
                    <button class="btn-remove" data-id="${item.itemId}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>`;
    }).join('');
    
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const discountRate = totalQuantity >= 5 ? 0.2 : totalQuantity >= 4 ? 0.15 : totalQuantity === 3 ? 0.1 : totalQuantity >= 2 ? 0.05 : 0;
    const discountAmount = subtotal * discountRate;
    const finalTotal = subtotal - discountAmount;

    cartSummaryContainer.innerHTML = `
        <h3>Tóm tắt đơn hàng</h3>
        <div class="summary-row"><span>Tạm tính (${totalQuantity} sản phẩm)</span><span>${subtotal.toLocaleString('vi-VN')} VNĐ</span></div>
        <div class="summary-row discount"><span>Giảm giá theo nhóm (${(discountRate * 100).toFixed(0)}%)</span><span>-${discountAmount.toLocaleString('vi-VN')} VNĐ</span></div>
        <div class="summary-row total"><span>Tổng cộng</span><span>${finalTotal.toLocaleString('vi-VN')} VNĐ</span></div>
        <button id="checkout-btn" class="btn btn-primary">Tiến hành thanh toán</button>`;
}

export async function initCartPage() {
    const cartItemsContainer = document.getElementById('cart-items-list');
    if(cartItemsContainer) cartItemsContainer.innerHTML = `<p>Đang tải giỏ hàng...</p>`;
    
    await fetchAndSetCart();
    
    renderCartPage();

    addCartEventListeners();
}
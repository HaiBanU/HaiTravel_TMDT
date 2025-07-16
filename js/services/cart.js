// js/services/cart.js

import { showCustomAlert } from '../utils/dom.js';
import { getCurrentUser } from './auth.js';

let localCartState = {};

const fetchWithAuth = async (url, options = {}) => {
    const user = getCurrentUser();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
    }
    return fetch(`https://haitravel-backend.onrender.com/api/cart${url}`, { ...options, headers });
};

const setCartState = (cartData) => {
    if (Array.isArray(cartData)) {
        localCartState = cartData.reduce((acc, item) => {
            acc[item.itemId] = item;
            return acc;
        }, {});
    } else {
        localCartState = cartData || {};
    }
    updateCartIcon();
};

export const getCart = () => localCartState;
export const clearLocalCart = () => {
    localStorage.removeItem('haiTravelGuestCart');
    setCartState({});
};

// [CẬP NHẬT HOÀN CHỈNH] Cập nhật icon giỏ hàng ở cả hai nơi
export function updateCartIcon() {
    const totalItems = Object.values(localCartState).reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    // Icon trên header desktop
    const cartCountElement = document.getElementById('cart-count');
    // Icon trong menu mobile
    const mobileCartCountElement = document.getElementById('mobile-cart-count');

    const updateElement = (element) => {
        if (element) {
            if (totalItems > 0) {
                element.textContent = totalItems;
                element.style.display = 'flex';
            } else {
                element.style.display = 'none';
            }
        }
    };
    
    updateElement(cartCountElement);
    updateElement(mobileCartCountElement); // Cập nhật cả cho mobile
}


export async function fetchAndSetCart() {
    const user = getCurrentUser();
    if (user) {
        try {
            const response = await fetchWithAuth('');
            if (!response.ok) throw new Error('Không thể tải giỏ hàng.');
            const cartData = await response.json();
            setCartState(cartData);
        } catch (error) {
            console.error("Lỗi khi tải giỏ hàng từ server:", error);
            setCartState([]);
        }
    } else {
        const guestCart = JSON.parse(localStorage.getItem('haiTravelGuestCart') || '{}');
        setCartState(guestCart);
    }
}

export async function addItemToCart(itemData) {
    const user = getCurrentUser();
    const itemPayload = { ...itemData, quantity: 1 }; 

    if (user) {
        try {
            const response = await fetchWithAuth('', {
                method: 'POST',
                body: JSON.stringify(itemPayload),
            });
            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || 'Thêm vào giỏ hàng thất bại');
            }
            setCartState(await response.json());
        } catch (error) {
            showCustomAlert('Lỗi', error.message, 'fa-solid fa-circle-xmark');
            return;
        }
    } else {
        const guestCart = getCart();
        if (guestCart[itemData.itemId]) {
             showCustomAlert('Thông báo', `Sản phẩm "${itemData.name}" đã có trong giỏ hàng.`, 'fa-solid fa-circle-info');
            return;
        } else {
            guestCart[itemData.itemId] = itemPayload;
        }
        localStorage.setItem('haiTravelGuestCart', JSON.stringify(guestCart));
        setCartState(guestCart);
    }
    showCustomAlert('Thành công!', `Đã thêm "${itemData.name}" vào giỏ hàng.`);
}

export async function syncCartOnLogin() {
    const guestCart = JSON.parse(localStorage.getItem('haiTravelGuestCart') || '{}');
    const items = Object.values(guestCart);
    if (items.length > 0) {
        try {
            const response = await fetchWithAuth('/sync', {
                method: 'POST',
                body: JSON.stringify({ items }),
            });
             if (!response.ok) throw new Error('Đồng bộ giỏ hàng thất bại.');
            localStorage.removeItem('haiTravelGuestCart');
        } catch(error) {
             console.error(error.message);
        }
    }
    await fetchAndSetCart();
}

export async function removeItemFromCart(itemId) {
    const user = getCurrentUser();
    if (user) {
        const response = await fetchWithAuth(`/${itemId}`, { method: 'DELETE' });
        if(response.ok) setCartState(await response.json());
    } else {
        const guestCart = getCart();
        delete guestCart[itemId];
        localStorage.setItem('haiTravelGuestCart', JSON.stringify(guestCart));
        setCartState(guestCart);
    }
}

export async function updateItemQuantity(itemId, quantity) {
    if (quantity < 1) {
        return await removeItemFromCart(itemId);
    }
    const user = getCurrentUser();
    if (user) {
        const response = await fetchWithAuth('', {
            method: 'PUT',
            body: JSON.stringify({ itemId, quantity }),
        });
        if(response.ok) setCartState(await response.json());
    } else {
        const guestCart = getCart();
        if (guestCart[itemId]) guestCart[itemId].quantity = quantity;
        localStorage.setItem('haiTravelGuestCart', JSON.stringify(guestCart));
        setCartState(guestCart);
    }
}
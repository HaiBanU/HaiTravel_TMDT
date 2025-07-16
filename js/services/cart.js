// js/services/cart.js

import { showCustomAlert } from '../utils/dom.js';
import { getCurrentUser } from './auth.js';

let localCartState = {};

// Hàm tiện ích để gọi API có xác thực
const fetchWithAuth = async (url, options = {}) => {
    const user = getCurrentUser();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
    }
    // Giả định backend của bạn chạy ở port 5000
    return fetch(`https://haitravel-backend.onrender.com/api/cart${url}`, { ...options, headers });
};

// Cập nhật state giỏ hàng cục bộ và icon
const setCartState = (cartData) => {
    if (Array.isArray(cartData)) { // Dữ liệu từ server là một mảng
        localCartState = cartData.reduce((acc, item) => {
            acc[item.itemId] = item;
            return acc;
        }, {});
    } else { // Dữ liệu từ localStorage là một object
        localCartState = cartData || {};
    }
    updateCartIcon();
};

export const getCart = () => localCartState;
export const clearLocalCart = () => {
    localStorage.removeItem('haiTravelGuestCart');
    setCartState({});
};

export function updateCartIcon() {
    const totalItems = Object.values(localCartState).reduce((sum, item) => sum + (item.quantity || 0), 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// [SỬA LỖI] Hàm này sẽ là nguồn dữ liệu chính khi tải trang
export async function fetchAndSetCart() {
    const user = getCurrentUser();
    if (user) { // Nếu đã đăng nhập, luôn lấy giỏ hàng từ server
        try {
            const response = await fetchWithAuth(''); // GET /api/cart
            if (!response.ok) throw new Error('Không thể tải giỏ hàng.');
            const cartData = await response.json();
            setCartState(cartData);
        } catch (error) {
            console.error("Lỗi khi tải giỏ hàng từ server:", error);
            setCartState([]); // Đặt lại thành giỏ hàng rỗng nếu có lỗi
        }
    } else { // Nếu là khách, lấy từ localStorage
        const guestCart = JSON.parse(localStorage.getItem('haiTravelGuestCart') || '{}');
        setCartState(guestCart);
    }
}

export async function addItemToCart(itemData) {
    const user = getCurrentUser();
    // Luôn bắt đầu với số lượng là 1
    const itemPayload = { ...itemData, quantity: 1 }; 

    if (user) { // Gửi yêu cầu lên server cho người dùng đã đăng nhập
        try {
            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa để gọi API POST hoặc PUT
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
    } else { // Cập nhật localStorage cho khách
        const guestCart = getCart();
        if (guestCart[itemData.itemId]) {
            // Nếu đã tồn tại thì báo lỗi vì logic thêm luôn là thêm mới
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
            // Gửi toàn bộ giỏ hàng của khách lên server để đồng bộ
            const response = await fetchWithAuth('/sync', {
                method: 'POST',
                body: JSON.stringify({ items }),
            });
             if (!response.ok) throw new Error('Đồng bộ giỏ hàng thất bại.');
            // Sau khi đồng bộ, xóa giỏ hàng của khách
            localStorage.removeItem('haiTravelGuestCart');
        } catch(error) {
             console.error(error.message);
        }
    }
    // Tải lại giỏ hàng từ server sau khi đồng bộ
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
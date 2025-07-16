// js/services/auth.js

import { showCustomAlert } from '../utils/dom.js';
import { syncCartOnLogin, clearLocalCart } from './cart.js';

// Đăng ký người dùng mới bằng cách gọi API backend
export async function registerUser(name, email, password) {
    try {
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        }
        
        localStorage.setItem('haiTravelCurrentUser', JSON.stringify(data));
        await syncCartOnLogin(); // Đồng bộ giỏ hàng ngay sau khi đăng ký
        window.location.reload(); // [SỬA LỖI] Tải lại trang để đồng bộ hoàn toàn
        
        return { success: true, user: data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Đăng nhập người dùng bằng cách gọi API backend
export async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        }
        
        localStorage.setItem('haiTravelCurrentUser', JSON.stringify(data));
        await syncCartOnLogin(); // Đồng bộ giỏ hàng ngay sau khi đăng nhập
        window.location.reload(); // [SỬA LỖI] Tải lại trang để đồng bộ hoàn toàn

        return { success: true, user: data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Đăng xuất
export function logoutUser() {
    localStorage.removeItem('haiTravelCurrentUser');
    clearLocalCart(); // Xóa giỏ hàng cục bộ khi đăng xuất
    window.location.reload();
}

// Lấy thông tin người dùng hiện tại từ localStorage
export function getCurrentUser() {
    try {
        const user = localStorage.getItem('haiTravelCurrentUser');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error("Lỗi khi đọc thông tin người dùng:", e);
        return null;
    }
}

// Cập nhật giao diện header (Nút đăng nhập hoặc lời chào)
export function updateAuthDisplay() {
    const user = getCurrentUser();
    const authDisplayContainer = document.getElementById('auth-display-container');
    const authModal = document.getElementById('auth-modal');

    if (!authDisplayContainer) return;

    if (user) {
        authDisplayContainer.innerHTML = `
            <div class="user-menu-wrapper">
                <a href="#" id="user-menu-trigger" class="welcome-message" aria-label="Tài khoản của bạn">
                    Chào, <strong>${user.name}</strong><i class="fa-solid fa-caret-down"></i>
                </a>
                <div class="user-dropdown">
                    <button id="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</button>
                </div>
            </div>`;

        document.getElementById('logout-btn').addEventListener('click', logoutUser);

        const menuWrapper = authDisplayContainer.querySelector('.user-menu-wrapper');
        document.getElementById('user-menu-trigger').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            menuWrapper.classList.toggle('open');
        });
        
        document.addEventListener('click', (e) => {
             if (menuWrapper && !menuWrapper.contains(e.target)) {
                menuWrapper.classList.remove('open');
            }
        });

    } else {
        authDisplayContainer.innerHTML = `<button id="login-trigger-btn" class="btn btn-auth">Đăng nhập</button>`;
        document.getElementById('login-trigger-btn').addEventListener('click', (e) => {
            e.preventDefault();
            if (authModal) authModal.classList.add('show');
        });
    }
}
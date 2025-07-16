// js/services/auth.js

import { showCustomAlert } from '../utils/dom.js';
import { syncCartOnLogin, clearLocalCart } from './cart.js';

// Đăng ký người dùng mới bằng cách gọi API backend
export async function registerUser(name, email, password) {
    try {
        const response = await fetch('https://haitravel-backend.onrender.com/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        }
        
        localStorage.setItem('haiTravelCurrentUser', JSON.stringify(data));
        await syncCartOnLogin();
        window.location.reload();
        
        return { success: true, user: data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Đăng nhập người dùng bằng cách gọi API backend
export async function loginUser(email, password) {
    try {
        const response = await fetch('https://haitravel-backend.onrender.com/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        }
        
        localStorage.setItem('haiTravelCurrentUser', JSON.stringify(data));
        await syncCartOnLogin();
        window.location.reload();

        return { success: true, user: data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Đăng xuất
export function logoutUser() {
    localStorage.removeItem('haiTravelCurrentUser');
    clearLocalCart();
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

// [CẬP NHẬT HOÀN CHỈNH] Cập nhật giao diện header (Desktop) và menu (Mobile)
export function updateAuthDisplay() {
    const user = getCurrentUser();
    
    // Vùng hiển thị trên Header Desktop
    const authDisplayContainer = document.getElementById('auth-display-container');
    
    // Vùng hiển thị trong Menu Mobile
    const mobileAuthDisplayContainer = document.getElementById('mobile-auth-display');
    const authModal = document.getElementById('auth-modal');

    if (user) {
        // --- Hiển thị cho Desktop ---
        if (authDisplayContainer) {
            authDisplayContainer.innerHTML = `
                <div class="user-menu-wrapper">
                    <a href="#" id="user-menu-trigger" class="welcome-message">
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
        }
        
        // --- Hiển thị cho Mobile ---
        if (mobileAuthDisplayContainer) {
            mobileAuthDisplayContainer.innerHTML = `<button id="mobile-logout-btn" class="btn btn-secondary"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</button>`;
            document.getElementById('mobile-logout-btn').addEventListener('click', logoutUser);
        }

    } else {
        // --- Hiển thị cho Desktop ---
        if (authDisplayContainer) {
            authDisplayContainer.innerHTML = `<button id="login-trigger-btn" class="btn btn-auth">Đăng nhập</button>`;
            document.getElementById('login-trigger-btn').addEventListener('click', (e) => {
                e.preventDefault();
                if (authModal) authModal.classList.add('show');
            });
        }

        // --- Hiển thị cho Mobile ---
        if (mobileAuthDisplayContainer) {
            mobileAuthDisplayContainer.innerHTML = `<button id="mobile-login-trigger-btn" class="btn btn-primary"><i class="fa-solid fa-right-to-bracket"></i> Đăng nhập / Đăng ký</button>`;
            document.getElementById('mobile-login-trigger-btn').addEventListener('click', (e) => {
                e.preventDefault();
                // Đóng menu mobile trước khi mở modal
                document.body.classList.remove('mobile-nav-open');
                setTimeout(() => {
                    if (authModal) authModal.classList.add('show');
                }, 400);
            });
        }
    }
}
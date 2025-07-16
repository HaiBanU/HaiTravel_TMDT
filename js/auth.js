// js/auth.js

import { registerUser, loginUser } from './services/auth.js';
import { updateAuthDisplay } from './services/auth.js';
import { showCustomAlert } from './utils/dom.js';

export function initAuth() {
    const authModal = document.getElementById('auth-modal');
    if (!authModal) return;

    const closeButton = authModal.querySelector('.close-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authSwitchText = document.getElementById('auth-switch-text');
    const loginErrorMessage = document.getElementById('login-error-message');
    const registerErrorMessage = document.getElementById('register-error-message');
    
    const showLoginForm = () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        authSwitchText.innerHTML = `Chưa có tài khoản? <a href="#" data-form="register">Đăng ký ngay</a>`;
        loginErrorMessage.style.display = 'none';
        registerErrorMessage.style.display = 'none';
    };

    const showRegisterForm = () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authSwitchText.innerHTML = `Đã có tài khoản? <a href="#" data-form="login">Đăng nhập</a>`;
        loginErrorMessage.style.display = 'none';
        registerErrorMessage.style.display = 'none';
    };

    showLoginForm();

    const closeModal = () => {
        authModal.classList.remove('show');
        showLoginForm();
        loginForm.reset();
        registerForm.reset();
    };

    closeButton.addEventListener('click', closeModal);
    authModal.addEventListener('click', (event) => { if (event.target === authModal) closeModal(); });

    authSwitchText.addEventListener('click', (e) => {
        e.preventDefault();
        const targetLink = e.target.closest('a');
        if (!targetLink) return;
        if (targetLink.dataset.form === 'register') showRegisterForm();
        else showLoginForm();
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const result = await loginUser(email, password);
        if (result.success) {
            closeModal();
            showCustomAlert('Chào mừng trở lại!', `Chào mừng ${result.user.name} đến với HaiTravel!`);
            // Không cần gọi updateAuthDisplay ở đây vì nó sẽ tự reload
        } else {
            loginErrorMessage.textContent = result.message;
            loginErrorMessage.style.display = 'block';
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = registerForm.name.value;
        const email = registerForm.email.value;
        const password = registerForm.password.value;
        const confirmPassword = registerForm['confirm-password'].value;
        if (password !== confirmPassword) {
            registerErrorMessage.textContent = 'Mật khẩu xác nhận không khớp!';
            registerErrorMessage.style.display = 'block';
            return;
        }
        const result = await registerUser(name, email, password);
        if (result.success) {
            closeModal();
            showCustomAlert('Đăng ký thành công!', `Chào mừng ${result.user.name}! Bắt đầu hành trình của bạn với HaiTravel.`);
            // Không cần gọi updateAuthDisplay ở đây vì nó sẽ tự reload
        } else {
            registerErrorMessage.textContent = result.message;
            registerErrorMessage.style.display = 'block';
        }
    });
}
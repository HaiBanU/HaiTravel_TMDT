// js/pages/blogPage.js

import { blogPosts } from '../data/blog.js';

function renderBlogPostCard(postId, post) {
    return `
        <a href="blog-post.html?id=${postId}" class="blog-card reveal">
            <div class="blog-card__image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="blog-card__content">
                <h3 class="blog-card__title">${post.title}</h3>
                <p class="blog-card__meta">Bởi <strong>${post.author}</strong> - ${post.date}</p>
                <p class="blog-card__summary">${post.summary}</p>
                <span class="blog-card__readmore">
                    Đọc thêm <i class="fa-solid fa-arrow-right"></i>
                </span>
            </div>
        </a>
    `;
}

export function initBlogListPage() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;

    const postsHTML = Object.entries(blogPosts)
        .sort(([, a], [, b]) => new Date(b.date) - new Date(a.date)) // Sắp xếp bài mới nhất lên đầu
        .map(([id, post]) => renderBlogPostCard(id, post))
        .join('');
    
    blogGrid.innerHTML = postsHTML;

    // [SỬA LỖI] Thêm đoạn code này để kích hoạt animation cho các thẻ blog vừa được tạo
    const newRevealElements = blogGrid.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    newRevealElements.forEach(el => observer.observe(el));
}

export function initBlogPostPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const post = blogPosts[postId];

    if (!post) {
        document.querySelector('.blog-post-page').innerHTML = '<h1 style="text-align:center; padding: 5rem 1rem;">Bài viết không tồn tại.</h1>';
        return;
    }

    // Cập nhật nội dung chính
    document.title = `${post.title} - HaiTravel Blog`;
    document.getElementById('post-hero').style.backgroundImage = `url(${post.image})`;
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-meta').innerHTML = `Bởi <strong>${post.author}</strong> - ${post.date}`;
    document.getElementById('post-content').innerHTML = post.content;

    // Render các bài viết gần đây
    const sidebar = document.getElementById('post-sidebar');
    if (sidebar) {
        const recentPosts = Object.entries(blogPosts)
            .filter(([id]) => id !== postId) // Lọc bỏ bài hiện tại
            .sort(([, a], [, b]) => new Date(b.date) - new Date(a.date))
            .slice(0, 3); // Lấy 3 bài gần nhất

        if (recentPosts.length > 0) {
            const recentPostsHTML = recentPosts.map(([id, p]) => `
                <a href="blog-post.html?id=${id}" class="recent-post-card">
                    <img src="${p.image}" alt="${p.title}">
                    <div><h4>${p.title}</h4></div>
                </a>
            `).join('');

            sidebar.innerHTML = `
                <h3>Bài Viết Mới Nhất</h3>
                <div class="recent-posts-list">
                    ${recentPostsHTML}
                </div>
            `;
        }
    }
}
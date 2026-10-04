/* ========================================
   阳安科技官网 - 共享 JS
   ======================================== */
(function() {
    // ---- 导航栏滚动 ----
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (navbar) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            navbar.classList.toggle('scrolled', y > 50);
            if (backToTop) backToTop.classList.toggle('show', y > 500);

            // 导航高亮
            if (navLinks) {
                let current = '';
                document.querySelectorAll('section[id]').forEach(s => {
                    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
                });
                navLinks.querySelectorAll('a').forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
                });
                document.querySelectorAll('.mobile-nav-item').forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
                });
            }
        });
    }

    // ---- 汉堡菜单 ----
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('mobile-open');
            });
        });
    }

    // ---- 返回顶部 ----
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- 滚动动画 ----
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ---- 数字滚动动画 ----
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                const update = () => {
                    current += step;
                    if (current >= target) {
                        el.textContent = target + (target >= 100 ? '+' : '');
                        return;
                    }
                    el.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                };
                update();
                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));
})();

// ---- 通用工具函数 ----
function $_(sel) { return document.querySelector(sel); }
function $_all(sel) { return document.querySelectorAll(sel); }
function htmlEscape(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}
function fmtTime(t) {
    if (!t) return '';
    const d = new Date(t);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff/60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff/3600000) + '小时前';
    if (diff < 604800000) return Math.floor(diff/86400000) + '天前';
    return d.toLocaleDateString('zh-CN');
}
function fmtDate(t) {
    if (!t) return '';
    return new Date(t).toLocaleDateString('zh-CN');
}

// ---- API 调用 ----
const API = {
    async fetch(url, opts = {}) {
        try {
            const res = await fetch(url, opts);
            return await res.json();
        } catch (e) {
            console.error('API error:', e);
            return null;
        }
    },
    // 文章列表
    getArticleList(page = 1) {
        return this.fetch(`http://47.80.18.168/article/api.php?action=list&page=${page}`);
    },
    // 文章详情
    getArticle(id) {
        return this.fetch(`http://47.80.18.168/article/api.php?action=get&id=${id}`);
    },
    // 商品列表
    getProducts() {
        return this.fetch('../shop2/api/products.php?action=list');
    },
    // 商品详情
    getProductDetail(id) {
        return this.fetch(`../shop2/api/products.php?action=detail&id=${id}`);
    }
};
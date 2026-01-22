/* ============================================
   MAIN JAVASCRIPT - DAPUR NUSANTARA (v4 Optimized)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initScrollTop();
    initAnimations();
    initSwipers();
    updateCartCount();
    initCartButton();
});

// 1. Efek Header saat Scroll
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('bg-white/95', 'backdrop-blur-md', 'py-3', 'shadow-md');
            header.classList.remove('py-4');
        } else {
            header.classList.remove('bg-white/95', 'backdrop-blur-md', 'py-3', 'shadow-md');
            header.classList.add('py-4');
        }
    });
}

// 2. Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('hidden');
            
            if (!navMenu.classList.contains('hidden')) {
                navMenu.className = "nav-menu flex flex-col items-center gap-4 absolute top-full left-0 w-full bg-white p-6 shadow-xl border-t border-gray-100 lg:static lg:flex-row lg:w-auto lg:p-0 lg:shadow-none lg:border-none";
            } else {
                navMenu.className = "nav-menu hidden lg:flex items-center gap-8";
            }

            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
}

// 3. Swiper Initialization
function initSwipers() {
    if (typeof Swiper !== 'undefined') {
        if (document.querySelector('.hero-swiper')) {
            new Swiper(".hero-swiper", {
                loop: true,
                autoplay: { delay: 5000 },
                pagination: { el: ".swiper-pagination", clickable: true },
                navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
                effect: "fade",
            });
        }

        if (document.querySelector('.testimonial-swiper')) {
            new Swiper(".testimonial-swiper", {
                loop: true,
                spaceBetween: 30,
                pagination: { el: ".swiper-pagination", clickable: true },
                breakpoints: {
                    640: { slidesPerView: 1 },
                    1024: { slidesPerView: 2 },
                },
            });
        }
    }
}

// 4. Tombol Scroll ke Atas
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-10');
            scrollTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
        } else {
            scrollTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-10');
            scrollTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 5. Sinkronisasi Jumlah Keranjang & Animasi Angka
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        // Cek jika angka berubah untuk memicu animasi
        if (el.textContent !== totalItems.toString()) {
            el.textContent = totalItems;
            
            // Efek Pop Animasi
            el.classList.add('scale-150', 'bg-primary');
            setTimeout(() => {
                el.classList.remove('scale-150', 'bg-primary');
            }, 300);
        }

        if (totalItems > 0) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
}

// 6. Navigasi ke Halaman Keranjang
function initCartButton() {
    const cartBtns = document.querySelectorAll('.cart-btn, #cartBtn');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const path = window.location.pathname;
            const isInPages = path.includes('/pages/');
            window.location.href = isInPages ? 'cart.html' : 'src/pages/cart.html';
        });
    });
}

// 7. Animasi Scroll (Intersection Observer)
function initAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                entry.target.classList.add('opacity-100', 'translate-y-0', 'animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
        observer.observe(el);
    });
}

/* ============================================
   LOGIKA ADD TO CART & NOTIFIKASI
   ============================================ */

window.addToCart = function(itemId) {
    // 1. Deteksi apakah kita di root (index) atau di subfolder (pages)
    const isInPages = window.location.pathname.includes('/pages/');
    
    // 2. Tentukan path yang "aman" untuk disimpan ke database (localStorage)
    // Halaman cart.html butuh path yang diawali '../' agar bisa melihat folder assets
    const imgPathBase = isInPages ? '../assets/images/menu/' : './src/assets/images/menu/';
    
    // KUNCI PERBAIKAN: 
    // Data yang disimpan ke LocalStorage HARUS menggunakan path relatif terhadap cart.html
    // Karena yang akan menampilkan gambar tersebut adalah cart.html
    const imagePathForCart = `../assets/images/menu/`; 

    const menuData = [
        { id: 1, name: 'Rendang Sapi Premium', price: 85000, img: 'Rendang Sapi Premium.jpg' },
        { id: 2, name: 'Ayam Bakar Madu', price: 55000, img: 'Ayam Bakar Madu.jpg' },
        { id: 3, name: 'Soto Ayam Lamongan', price: 35000, img: 'Soto Ayam Lamongan.jpg' }
    ];

    const item = menuData.find(i => i.id === itemId);
    if (!item) return;

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(i => i.id === itemId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            // Simpan selalu dalam format yang dipahami folder /pages/
            image: `../assets/images/menu/${item.img}`, 
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${item.name} masuk keranjang!`);
};

// Notifikasi Modern dengan Animasi Slide
function showNotification(message) {
    // Hapus toast lama jika masih ada
    const oldToast = document.querySelector('.toast-notification');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification fixed bottom-10 left-1/2 -translate-x-1/2 bg-dark/90 backdrop-blur-sm text-white px-8 py-4 rounded-2xl shadow-2xl z-[10000] flex items-center gap-4 transition-all duration-500 opacity-0 translate-y-10 border border-white/10';
    toast.innerHTML = `
        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <i class="fas fa-shopping-basket text-xs"></i>
        </div>
        <span class="font-bold text-sm tracking-wide">${message}</span>
    `;
    
    document.body.appendChild(toast);

    // Trigger Slide Up
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-y-10');
        toast.classList.add('opacity-100', 'translate-y-0');
    }, 100);

    // Slide Down & Remove
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-10');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
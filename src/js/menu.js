/* ============================================
   MENU PAGE JAVASCRIPT - DAPUR NUSANTARA (Tailwind v4)
   ============================================ */

const fullMenuData = [
    { id: 1, name: 'Rendang Sapi Premium', category: 'main', price: 85000, rating: 4.9, reviews: 234, description: 'Rendang sapi premium bumbu rempah asli.', image: 'Rendang Sapi Premium.jpg', badge: 'Best Seller', spicy: 2 },
    { id: 2, name: 'Ayam Bakar Madu', category: 'main', price: 55000, rating: 4.8, reviews: 189, description: 'Ayam kampung bakar saus madu spesial.', image: 'Ayam Bakar Madu.jpg', badge: 'Best Seller', spicy: 1 },
    { id: 3, name: 'Soto Ayam Lamongan', category: 'main', price: 35000, rating: 4.7, reviews: 167, description: 'Soto kuah bening dengan koya spesial.', image: 'Soto Ayam Lamongan.jpg', badge: null, spicy: 1 },
    { id: 4, name: 'Nasi Goreng Syummm', category: 'main', price: 32000, rating: 4.8, reviews: 201, description: 'Nasi goreng spesial telur mata sapi.', image: 'Nasi Goreng Syummm.jpg', badge: 'Best Seller', spicy: 2 },
    { id: 7, name: 'Lumpia Semarang', category: 'snack', price: 28000, rating: 4.7, reviews: 156, description: 'Lumpia rebung segar khas Semarang.', image: 'Lumpia Semarang.jpg', badge: 'Best Seller', spicy: 0 },
    { id: 14, name: 'Teh Tarik Mas Duiki', category: 'drink', price: 15000, rating: 4.8, reviews: 312, description: 'Teh tarik foam lembut ala Malaysia.', image: 'Teh Tarik Mas Duiki.jpg', badge: 'Best Seller', spicy: 0 },
    { id: 15, name: 'Teh Ijo Susu Mbak Gita', category: 'drink', price: 18000, rating: 4.9, reviews: 289, description: 'Green tea latte creamy premium.', image: 'Teh Ijo Susu Mbak Gita.jpg', badge: 'New', spicy: 0 },
    { id: 17, name: 'Klepon Mini Box', category: 'dessert', price: 22000, rating: 4.8, reviews: 198, description: 'Klepon mini gula merah cair lumer.', image: 'Klepon Mini Box.jpg', badge: 'Best Seller', spicy: 0 }
    // ... Tambahkan data lainnya di sini sesuai kebutuhan
];

let currentCategory = 'all';
let currentSort = 'default';

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    initFilters();
    initSort();
    updateMenuCount();
});

function renderMenu() {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;
    
    let filteredData = [...fullMenuData];
    
    if (currentCategory !== 'all') {
        filteredData = filteredData.filter(item => item.category === currentCategory);
    }
    
    // Logika Sorting
    if (currentSort === 'price-low') filteredData.sort((a, b) => a.price - b.price);
    else if (currentSort === 'price-high') filteredData.sort((a, b) => b.price - a.price);
    else if (currentSort === 'rating') filteredData.sort((a, b) => b.rating - a.rating);

    if (filteredData.length === 0) {
        menuContainer.innerHTML = `<div class="col-span-full text-center py-20 text-gray-500">Menu tidak ditemukan.</div>`;
        return;
    }
    
    menuContainer.innerHTML = filteredData.map(item => createMenuCard(item)).join('');
}

function createMenuCard(item) {
    const spicyIcons = '🌶️'.repeat(item.spicy);
    // Karena kita di folder /pages/, path gambar naik 1 tingkat
    const imagePath = `../assets/images/menu/${item.image}`;
    
    return `
        <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
            <div class="relative h-48 overflow-hidden">
                <img src="${imagePath}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                ${item.badge ? `<span class="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">${item.badge}</span>` : ''}
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg text-dark">${item.name}</h3>
                    <span class="text-xs text-orange-500 font-bold">${spicyIcons}</span>
                </div>
                <p class="text-gray-500 text-sm mb-4 line-clamp-2">${item.description}</p>
                <div class="flex items-center gap-2 mb-4 text-sm font-semibold">
                    <i class="fas fa-star text-yellow-400"></i>
                    <span>${item.rating}</span>
                    <span class="text-gray-400">(${item.reviews} reviews)</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-dark">Rp ${item.price.toLocaleString('id-ID')}</span>
                    <button onclick="addToCartFromMenu(${item.id})" class="bg-dark text-white p-3 rounded-xl hover:bg-primary transition-colors">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('bg-primary', 'text-white'));
            btn.classList.add('bg-primary', 'text-white');
            currentCategory = btn.dataset.category;
            renderMenu();
            updateMenuCount();
        });
    });
}

function initSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderMenu();
        });
    }
}

function updateMenuCount() {
    const countElement = document.getElementById('menuCount');
    if (!countElement) return;
    const count = currentCategory === 'all' ? fullMenuData.length : fullMenuData.filter(i => i.category === currentCategory).length;
    countElement.textContent = count;
}

window.addToCartFromMenu = function(itemId) {
    const item = fullMenuData.find(i => i.id === itemId);
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
            image: `../assets/images/menu/${item.image}`,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    if (typeof updateCartCount === 'function') updateCartCount();
    alert(`${item.name} ditambahkan!`); // Ganti dengan showNotification jika sudah ada
}
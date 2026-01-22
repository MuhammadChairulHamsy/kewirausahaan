/* ============================================
   CART PAGE JAVASCRIPT - DAPUR NUSANTARA (v4 Optimized)
   ============================================ */

let cart = [];
let promoCode = null;
const SHIPPING_COST = 15000;
const TAX_RATE = 0.1; // 10%

const promoCodes = {
  GRATIS10: { discount: 0.1, minPurchase: 50000, description: "Diskon 10%" },
  FREESHIP: {
    freeShipping: true,
    minPurchase: 100000,
    description: "Gratis Ongkir",
  },
  HEMAT20: { discount: 0.2, minPurchase: 150000, description: "Diskon 20%" },
  LEBARAN2026: {
    discount: 0.15,
    minPurchase: 75000,
    description: "Diskon 15%",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderCart();
  initEventListeners();
});

function loadCart() {
  cart = JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const container = document.getElementById("cartItemsContainer");
  const itemCount = document.getElementById("itemCount");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-20 text-center">
                <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <i class="fas fa-shopping-cart text-4xl text-gray-300"></i>
                </div>
                <h3 class="text-2xl font-bold text-dark mb-2">Keranjang Belanja Kosong</h3>
                <p class="text-gray-500 mb-8 max-w-xs">Yuk, mulai belanja dan tambahkan menu favorit Anda ke sini!</p>
                <a href="menu.html" class="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                    Lihat Menu
                </a>
            </div>
        `;
    itemCount.textContent = "0";
    updateSummary();
    return;
  }

  itemCount.textContent = cart.length;

  container.innerHTML = cart
    .map(
      (item) => `
        <div class="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-3xl mb-4 border border-gray-100 hover:shadow-xl transition-shadow shadow-sm">
            <div class="w-24 h-24 shrink-0 overflow-hidden rounded-2xl">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/100x100?text=Food'">
            </div>
            <div class="flex-1 text-center sm:text-left">
                <h3 class="text-lg font-bold text-dark mb-1">${item.name}</h3>
                <div class="text-primary font-bold mb-4 sm:mb-2">Rp ${item.price.toLocaleString("id-ID")}</div>
                <div class="flex items-center justify-center sm:justify-start gap-4">
                    <div class="flex items-center bg-gray-100 rounded-xl p-1">
                        <button onclick="updateQuantity(${item.id}, -1)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
                            <i class="fas fa-minus text-xs"></i>
                        </button>
                        <span class="w-10 text-center font-bold text-dark">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto border-t sm:border-0 pt-4 sm:pt-0">
                <div class="text-xl font-black text-dark">
                    Rp ${(item.price * item.quantity).toLocaleString("id-ID")}
                </div>
                <button onclick="removeItem(${item.id})" class="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-2">
                    <i class="fas fa-trash-alt"></i> Hapus
                </button>
            </div>
        </div>
    `,
    )
    .join("");

  updateSummary();
}

window.updateQuantity = function (itemId, change) {
  const item = cart.find((i) => i.id === itemId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeItem(itemId);
    return;
  }

  saveCart();
  renderCart();
  updateCartCount();
};

window.removeItem = function (itemId) {
  cart = cart.filter((i) => i.id !== itemId);
  saveCart();
  renderCart();
  updateCartCount();
};

function updateSummary() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * TAX_RATE;
  let shipping = subtotal >= 100000 || subtotal === 0 ? 0 : SHIPPING_COST;
  let discount = 0;

  if (promoCode && promoCodes[promoCode]) {
    const promo = promoCodes[promoCode];
    if (subtotal >= promo.minPurchase) {
      if (promo.discount) discount = subtotal * promo.discount;
      if (promo.freeShipping) shipping = 0;
    }
  }

  const total = subtotal + tax + shipping - discount;

  document.getElementById("subtotal").textContent =
    `Rp ${subtotal.toLocaleString("id-ID")}`;
  document.getElementById("tax").textContent =
    `Rp ${tax.toLocaleString("id-ID")}`;
  document.getElementById("shipping").textContent =
    shipping === 0 ? "GRATIS" : `Rp ${shipping.toLocaleString("id-ID")}`;
  document.getElementById("total").textContent =
    `Rp ${total.toLocaleString("id-ID")}`;

  // Manage Discount Row Visibility
  const discountRow = document.getElementById("discountRow");
  const discountVal = document.getElementById("discountValue");
  if (discount > 0 && discountRow) {
    discountRow.classList.remove("hidden");
    discountRow.classList.add("flex");
    discountVal.textContent = `- Rp ${discount.toLocaleString("id-ID")}`;
  } else if (discountRow) {
    discountRow.classList.add("hidden");
  }
}

function initEventListeners() {
  // Tombol Apply Promo
  document.getElementById("applyPromoBtn")?.addEventListener("click", () => {
    const input = document.getElementById("promoInput");
    const code = input.value.trim().toUpperCase();
    const msg = document.getElementById("promoMessage");

    if (!promoCodes[code]) {
      msg.className = "text-red-500 text-xs mt-2 font-bold";
      msg.textContent = "Kode promo tidak valid!";
      return;
    }

    promoCode = code;
    msg.className = "text-green-500 text-xs mt-2 font-bold";
    msg.textContent = `✓ Promo ${promoCodes[code].description} aktif!`;
    updateSummary();
  });

  // Tombol Checkout
  document.getElementById("checkoutBtn")?.addEventListener("click", (e) => {
    const btn = e.currentTarget;
    if (cart.length === 0) return;

    // Simpan konten asli tombol
    const originalHTML = btn.innerHTML;

    // Tampilkan loading
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner animate-spin"></i> Memproses...';

    setTimeout(() => {
      const modal = document.getElementById("successModal");
      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");

        // Bersihkan data
        cart = [];
        saveCart();
        renderCart(); // Tambahkan ini agar tampilan keranjang langsung kosong
        updateCartCount();
      }

      // Kembalikan tombol ke semula
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }, 1500); // Jeda simulasi 1.5 detik
  });
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = totalItems;
    totalItems > 0 ? el.classList.remove("hidden") : el.classList.add("hidden");
  });
}

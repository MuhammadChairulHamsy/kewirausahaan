/* ============================================
   BOOKING PAGE JAVASCRIPT - DAPUR NUSANTARA (v4 Optimized)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initBookingForm();
    setMinDate();
});

// Set tanggal minimal adalah besok (H+1)
function setMinDate() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
}

// Inisialisasi Form Reservasi
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validasi form HTML5
        if (!form.checkValidity()) {
            showNotification('Mohon lengkapi detail reservasi Anda', 'error');
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Visual Loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner animate-spin"></i> Memproses...';
        
        // Ambil Data Form
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value,
            occasion: document.getElementById('occasion').value,
            notes: document.getElementById('notes').value
        };
        
        // Simpan ke LocalStorage (Simulasi Database)
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push({
            ...formData,
            id: Date.now(),
            status: 'pending',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Simulasi pengiriman data ke server
        setTimeout(() => {
            showSuccessModal();
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    });
}

// Fungsi Modal (Toggle Hidden Class Tailwind)
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

window.closeModal = function() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Notifikasi Toast Modern
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    
    toast.className = `fixed bottom-5 right-5 ${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl z-[9999] flex items-center gap-3 animate-bounce`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> 
        <span class="font-bold text-sm">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/* ============================================
   CONTACT PAGE JAVASCRIPT - DAPUR NUSANTARA (v4 Optimized)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
});

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validasi Form sederhana
        if (!form.checkValidity()) {
            showNotification('Mohon lengkapi semua field yang wajib diisi', 'error');
            return;
        }

        // Efek loading pada tombol submit
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner animate-spin"></i> Mengirim...';

        // Simulasi pengambilan data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Simpan ke localStorage (untuk keperluan demo)
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push({
            ...formData,
            id: Date.now(),
            status: 'unread',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('messages', JSON.stringify(messages));

        // Simulasi delay pengiriman
        setTimeout(() => {
            showSuccessModal();
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    });
}

// Show Success Modal (Gunakan Tailwind Class)
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex'); // Memastikan modal muncul di tengah jika menggunakan flex
    }
}

// Close Modal
window.closeModal = function() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Global Notification (Satu fungsi yang konsisten dengan main.js)
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    
    // Penentuan warna berdasarkan tipe menggunakan Tailwind v4 classes
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.className = `fixed bottom-5 right-5 ${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl z-[9999] flex items-center gap-3 animate-bounce`;
    toast.innerHTML = `
        <i class="fas ${icon}"></i> 
        <span class="font-bold text-sm">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
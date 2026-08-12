// Data ucapan disimpan di localStorage
let ucapanList = JSON.parse(localStorage.getItem('ucapanList')) || [];

// Fungsi buka undangan
function openInvitation() {
    document.getElementById('opening').classList.add('hidden');
    document.getElementById('mempelai').classList.remove('hidden');
    document.getElementById('navMenu').classList.remove('hidden');
    
    // Smooth scroll ke section mempelai
    setTimeout(() => {
        document.getElementById('mempelai').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Fungsi scroll ke section
function scrollToSection(sectionId) {
    // Sembunyikan semua section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Tampilkan section yang dipilih
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Scroll ke section
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Fungsi untuk menampilkan ucapan dari localStorage
function tampilkanUcapan() {
    const daftarUcapan = document.getElementById('daftarUcapan');
    daftarUcapan.innerHTML = '';
    
    if (ucapanList.length === 0) {
        daftarUcapan.innerHTML = '<p style="color: #999; text-align: center;">Belum ada ucapan. Jadilah yang pertama!</p>';
        return;
    }
    
    ucapanList.forEach((ucapan, index) => {
        const ucapanItem = document.createElement('div');
        ucapanItem.className = 'ucapan-item';
        ucapanItem.innerHTML = `
            <div class="ucapan-nama">${escapeHtml(ucapan.nama)}</div>
            <div class="ucapan-isi">"${escapeHtml(ucapan.pesan)}"</div>
        `;
        daftarUcapan.appendChild(ucapanItem);
    });
}

// Fungsi untuk escape HTML (keamanan)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listener untuk form ucapan
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ucapanForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value.trim();
        const pesan = document.getElementById('pesan').value.trim();
        
        if (nama && pesan) {
            // Tambah ucapan ke array
            ucapanList.unshift({
                nama: nama,
                pesan: pesan,
                tanggal: new Date().toLocaleDateString('id-ID')
            });
            
            // Simpan ke localStorage (maksimal 50 ucapan)
            if (ucapanList.length > 50) {
                ucapanList.pop();
            }
            localStorage.setItem('ucapanList', JSON.stringify(ucapanList));
            
            // Clear form
            form.reset();
            
            // Tampilkan ucapan terbaru
            tampilkanUcapan();
            
            // Scroll ke daftar ucapan
            document.getElementById('daftarUcapan').scrollIntoView({ behavior: 'smooth' });
            
            // Notifikasi
            showNotification('Ucapan Anda berhasil dikirim! 🎉');
        }
    });
    
    // Tampilkan ucapan saat page load
    tampilkanUcapan();
});

// Fungsi notifikasi sederhana
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        animation: slideInNotif 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutNotif 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Tambah keyframe animation untuk notifikasi
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInNotif {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutNotif {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Keyboard navigation (opsional)
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') {
        const sections = ['opening', 'mempelai', 'acara', 'ucapan'];
        for (let i = 0; i < sections.length - 1; i++) {
            if (!document.getElementById(sections[i]).classList.contains('hidden')) {
                scrollToSection(sections[i + 1]);
                break;
            }
        }
    }
});

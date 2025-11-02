// ▼▼▼ ISI UNTUK FILE reset.js ▼▼▼

// Inisialisasi Supabase (wajib ada di setiap halaman yang butuh Supabase)
const SUPABASE_URL = 'https://fdokqnojzeldydncigfp.supabase.co'; // Ganti dengan URL Anda
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkb2txbm9qemVsZHlkbmNpZ2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDEwOTMsImV4cCI6MjA3NzQ3NzA5M30.xzGbeYSi7RcjQgee97qYwC_oisFrZrdL-K0TOeH5QdE'; // Ganti dengan Kunci Anda
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const updateButton = document.getElementById('update-password-button');
    const passwordInput = document.getElementById('new-password-input');
    const messageEl = document.getElementById('reset-message');

    updateButton.addEventListener('click', async () => {
        const newPassword = passwordInput.value;
        if (newPassword.length < 6) {
            messageEl.textContent = 'Error: Password harus minimal 6 karakter.';
            return;
        }

        messageEl.textContent = 'Mengupdate...';

        // Supabase secara otomatis tahu siapa user-nya dari token di URL
        const { error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) {
            messageEl.textContent = 'Error: ' + error.message;
        } else {
            messageEl.textContent = 'Password berhasil di-update! Anda bisa menutup halaman ini dan login kembali.';
            messageEl.style.color = '#10B981';
        }
    });
});
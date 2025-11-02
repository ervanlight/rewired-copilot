// ▼▼▼ GANTI DENGAN KUNCI PUBLIK (ANON) SUPABASE ANDA ▼▼▼
const SUPABASE_URL = 'https://fdokqnojzeldydncigfp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkb2txbm9qemVsZHlkbmNpZ2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDEwOTMsImV4cCI6MjA3NzQ3NzA5M30.xzGbeYSi7RcjQgee97qYwC_oisFrZrdL-K0TOeH5QdE';
// ▲▲▲ GANTI DENGAN KUNCI PUBLIK (ANON) SUPABASE ANDA ▲▲▲

// Cek jika variabel diisi
if (!SUPABASE_URL.includes('supabase.co') || !SUPABASE_ANON_KEY.startsWith('ey')) {
    alert('PENTING: CEO, Anda belum mengisi SUPABASE_URL dan SUPABASE_ANON_KEY di app.js baris 5 & 6.');
}

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variabel global untuk menyimpan data user
let currentUserID = null;
let currentUserEmail = null;

// =================================================================
// ▼▼▼ PERBAIKAN: SEMUA KODE DIMASUKKAN KE DALAM 'DOMContentLoaded' ▼▼▼
// =================================================================
document.addEventListener('DOMContentLoaded', () => {

    // Dapatkan elemen UI Global
    const authContainer = document.getElementById('auth-container');
    const loginForm = document.getElementById('login-form');
    const userSession = document.getElementById('user-session');
    const mainComposerSteps = document.querySelector('.steps'); // Container untuk Langkah 1, 2, 3

    // Dapatkan elemen UI Auth
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');
    const logoutButton = document.getElementById('logout-button');
    const authEmail = document.getElementById('auth-email');
    const authPassword = document.getElementById('auth-password');
    const authMessage = document.getElementById('auth-message');
    const userEmailDisplay = document.getElementById('user-email-display');
    const creditBalanceDisplay = document.getElementById('credit-balance-display');

    // Form & controls (Kode Asli Anda)
    const form = document.getElementById('listing-form');
    const generateButton = document.getElementById('generate-button');

    // Output elements (6 kartu) (Kode Asli Anda)
    const outputJudulList = document.getElementById('output-judul-list');
    const outputPortal = document.getElementById('output-portal-content');
    const outputIG = document.getElementById('output-ig-content');
    const outputTiktok = document.getElementById('output-tiktok-content');
    const outputWA = document.getElementById('output-wa-content');
    const outputAudit = document.getElementById('output-audit-content');
    const langkah3Container = document.getElementById('langkah-3');

    // status message area (Kode Asli Anda)
    let pesanStatus = document.getElementById('pesan-status');
    if (!pesanStatus) {
        pesanStatus = document.createElement('div');
        pesanStatus.id = 'pesan-status';
        pesanStatus.style.margin = '10px 0';
        pesanStatus.style.fontSize = '13px';
        pesanStatus.style.color = '#b91c1c';
        const header = document.querySelector('header');
        if (header) {
            header.parentNode.insertBefore(pesanStatus, header.nextSibling);
        } else {
            const container = document.querySelector('.container') || document.body;
            container.insertBefore(pesanStatus, container.firstChild);
        }
    }

    // (Semua fungsi helper asli Anda kita pertahankan)
    const setStatus = (msg = '', isError = true) => {
        // ... (Fungsi setStatus Anda yang ada) ...
        pesanStatus.textContent = msg;
        pesanStatus.style.display = msg ? 'block' : 'none';
        pesanStatus.style.color = isError ? '#b91c1c' : '#065f46';
    };

    if (form) {
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
        });
    }

    const clearChildren = (node) => {
        // ... (Fungsi clearChildren Anda yang ada) ...
        if (!node) return;
        while (node.firstChild) node.removeChild(node.firstChild);
    };

    const createCopyButton = (text) => {
        // ... (Fungsi createCopyButton Anda yang ada) ...
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Copy';
        btn.className = 'copy-button'; // (Saya ubah ke class standar Anda)
        btn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(text);
                const prev = btn.textContent;
                btn.textContent = 'Tersalin!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = prev;
                    btn.classList.remove('copied');
                }, 1200);
            } catch (e) {
                console.error('Clipboard copy failed', e);
                setStatus('Gagal menyalin clipboard', true);
            }
        });
        return btn;
    };

    const parseNestedResponse = (responseBody) => {
        // ... (Fungsi parseNestedResponse Anda yang ada) ...
        if (!responseBody) return null;
        if (typeof responseBody === 'object' && Object.prototype.hasOwnProperty.call(responseBody, 'body')) {
            const inner = responseBody.body;
            if (typeof inner === 'string') {
                try { return JSON.parse(inner); } catch (e) { return inner; }
            }
            return inner;
        }
        if (typeof responseBody === 'string') {
            try { return JSON.parse(responseBody); } catch (e) { return responseBody; }
        }
        return responseBody;
    };

    const renderTitles = (kartu_portal) => {
    // Gunakan variabel `outputJudulList` yang sudah didefinisikan di atas.
    // Pemeriksaan paling penting: apakah elemen HTML-nya ada?
    if (!outputJudulList) {
        console.error("FATAL: Elemen dengan ID 'output-judul-list' tidak ditemukan di HTML!");
        return; // Hentikan fungsi jika elemen tidak ada.
    }
    
    // Hapus konten lama dengan aman.
    clearChildren(outputJudulList);

    // Periksa apakah data judulnya valid.
    if (!kartu_portal || typeof kartu_portal !== 'object') {
        const li = document.createElement('li');
        li.textContent = 'Data judul tidak tersedia atau format salah.';
        outputJudulList.appendChild(li);
        return;
    }

    const keys = ['judul_1', 'judul_2', 'judul_3', 'judul_4', 'judul_5'];
    let titlesFound = false;

    // Loop dan buat setiap item judul dengan aman.
    keys.forEach(key => {
        const titleText = kartu_portal[key];
        if (titleText && String(titleText).trim()) {
            titlesFound = true;
            
            const li = document.createElement('li');
            li.className = 'output-item'; // Gunakan kelas yang sudah ada untuk styling.

            const titleP = document.createElement('p');
            titleP.textContent = titleText;
            
            li.appendChild(titleP);
            li.appendChild(createCopyButton(titleText)); // Gunakan fungsi createCopyButton Anda.
            
            outputJudulList.appendChild(li);
        }
    });

    // Jika setelah loop tidak ada judul yang ditemukan dalam data.
    if (!titlesFound) {
        const li = document.createElement('li');
        li.textContent = 'AI tidak menghasilkan varian judul.';
        outputJudulList.appendChild(li);
    }
};

    const setPreSafe = (node, value, fallback = '—') => {
        // ... (Fungsi setPreSafe Anda yang ada) ...
        if (!node) return;
        if (value == null || value === '') {
            node.textContent = fallback; return;
        }
        if (typeof value === 'string') {
            node.textContent = value;
        } else {
            try { node.textContent = JSON.stringify(value, null, 2); } catch { node.textContent = String(value); }
        }
    };

    const escapeHtml = (unsafe) => {
        // ... (Fungsi escapeHtml Anda yang ada) ...
        if (unsafe == null) return '';
        return String(unsafe)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    // =================================================================
    // ▼▼▼ BLOK BARU: Logika Auth & Kontrol Tampilan ▼▼▼
    // =================================================================
    
    // Logika Sign Up
    signupButton.addEventListener('click', async () => {
        authMessage.textContent = 'Mendaftarkan...';
        const { data, error } = await supabaseClient.auth.signUp({
            email: authEmail.value,
            password: authPassword.value,
        });
        if (error) {
            authMessage.textContent = 'Error: ' + error.message;
        } else {
            authMessage.textContent = 'Sukses! Silakan cek email Anda untuk verifikasi.';
        }
    });

// GANTI BLOK loginButton.addEventListener LAMA ANDA DENGAN INI
loginButton.addEventListener('click', async () => {
    authMessage.textContent = 'Masuk...';
    const { error } = await supabaseClient.auth.signInWithPassword({
        email: authEmail.value,
        password: authPassword.value,
    });
    if (error) {
        authMessage.textContent = 'Error: Gagal masuk, cek email atau password Anda.';
    }
    // Tidak perlu melakukan apa-apa jika berhasil, onAuthStateChange akan menanganinya
});

    // Logika Logout
    logoutButton.addEventListener('click', async () => {
        setStatus('', false);
        await supabaseClient.auth.signOut();
        currentUserID = null;
        currentUserEmail = null;
        
        loginForm.style.display = 'block';
        userSession.style.display = 'none';
        authContainer.style.borderColor = '#E5E7EB';
        mainComposerSteps.style.display = 'none'; // Sembunyikan form utama
        if (langkah3Container) langkah3Container.style.display = 'none'; // Sembunyikan output
        
        authMessage.textContent = 'Logout berhasil.';
    });

    // GANTI SELURUH FUNGSI updateUI LAMA ANDA DENGAN VERSI BARU INI

function updateUI(user) {
    // Ambil semua kontainer utama
    const authContainer = document.getElementById('auth-container');
    const userSessionContainer = document.getElementById('user-session');
    const mainComposerSteps = document.querySelector('.steps');

    if (user) {
        // --- JIKA PENGGUNA LOGIN ---
        // ▼▼▼ TAMBAHKAN DUA BARIS INI ▼▼▼
        const leadParagraph = document.querySelector('p.lead');
        if (leadParagraph) leadParagraph.textContent = 'Silahkan isi semua box sedetail mungkin';
        // ▲▲▲ AKHIR TAMBAHAN ▲▲▲
        currentUserID = user.id;
        document.body.classList.remove('logged-out');
        
        // Sembunyikan form login & tampilkan sisanya
        if (authContainer) authContainer.style.display = 'none';
        if (userSessionContainer) userSessionContainer.style.display = 'block'; // Pastikan ini ditampilkan
        if (mainComposerSteps) mainComposerSteps.style.display = 'grid';

        // Tampilkan email & ambil saldo kredit
        const userEmailDisplay = document.getElementById('user-email-display');
        if (userEmailDisplay) userEmailDisplay.textContent = user.email;
        fetchCreditBalance(user.id);

    } else {
        // --- JIKA PENGGUNA LOGOUT ATAU BELUM LOGIN ---
        currentUserID = null;
        document.body.classList.add('logged-out');

        // Tampilkan form login & sembunyikan sisanya
        if (authContainer) authContainer.style.display = 'block';
        if (userSessionContainer) userSessionContainer.style.display = 'none';
        if (mainComposerSteps) mainComposerSteps.style.display = 'none';

        const leadParagraph = document.querySelector('p.lead');
        if (leadParagraph) leadParagraph.textContent = 'Dapatkan paket amunisi konten siap pakai dan audit internal untuk pemasaran properti.';
    }
}

    // Fungsi untuk mengambil saldo kredit
    async function fetchCreditBalance(userId) {
    if (!userId) return;
    
    // Targetkan HANYA angkanya, bukan seluruh div
    const balanceSpan = document.querySelector('#credit-balance-display span');
    if (balanceSpan) balanceSpan.textContent = 'Memuat...';

    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) throw new Error('Sesi tidak valid.');

        // Panggil fungsi Vercel ('/api/getBalance')
        const response = await fetch('/api/getBalance', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}` // Mengirim token
            },
            body: JSON.stringify({ userId: userId })
        });
        
        if (!response.ok) {
             const err = await response.json();
             throw new Error(err.error || 'Gagal mengambil data saldo.');
        }
        
        const data = await response.json();
        
        if (data.balance !== undefined) {
            // Sukses
            if (balanceSpan) balanceSpan.textContent = data.balance;
        } else {
            // Gagal (Ini adalah baris yang diperbaiki, 'balanceLocker' -> 'balanceSpan')
            if (balanceSpan) balanceSpan.textContent = 'Error';
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
        if (balanceSpan) {
            balanceSpan.textContent = 'Error';
            balanceSpan.style.color = '#EF4444'; // Ubah jadi merah
        }
        // Tampilkan error di pesan status utama
        if(typeof setStatus === 'function') {
            setStatus(error.message, true);
        }
    }
}
    // SISIPKAN BLOK KODE INI TEPAT SEBELUM "(async () => {"

// INILAH "OTAK" UTAMA: PENJAGA GERBANG OTOMATIS
// Hanya dia yang boleh memanggil General Manager (updateUI).
supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event); // Log ini untuk kita lihat
    const user = session ? session.user : null;
    updateUI(user);
});
    (async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            updateUIForLogin(session.user);
        } else {
            mainComposerSteps.style.display = 'none'; // Sembunyikan form utama
        }
    })();

    // =================================================================
    // ▲▲▲ AKHIR BLOK BARU ▲▲▲
    // =================================================================



if (generateButton) {
    generateButton.addEventListener('click', async () => {
        setStatus('', false);
        const prevText = generateButton.textContent;

        // Cek Login
        if (typeof currentUserID !== 'undefined' && !currentUserID) {
            alert('Anda harus login untuk menggunakan generator.');
            return;
        }

        // Validasi Form
        const requiredFields = [
            { id: 'tipe-properti', name: 'Tipe Properti' },
            { id: 'target-audiens', name: 'Target Audiens' },
            { id: 'data-teknis', name: 'Data Teknis' },
            { id: 'harga', name: 'Harga' },
            { id: 'fitur-unik', name: 'Fitur Unik' }
        ];
        const emptyFields = [];
        requiredFields.forEach(f => {
            const el = document.getElementById(f.id);
            const val = el && typeof el.value !== 'undefined' ? String(el.value).trim() : '';
            if (!val) {
                emptyFields.push(f.name);
                if (el) el.classList.add('error');
            } else {
                if (el) el.classList.remove('error');
            }
        });
        if (emptyFields.length > 0) {
            alert('Wajib Diisi: ' + emptyFields.join(', '));
            return;
        }

        const tipeProperti = (document.getElementById('tipe-properti') || {}).value || '';
        const targetAudiens = (document.getElementById('target-audiens') || {}).value || '';
        const dataTeknis = (document.getElementById('data-teknis') || {}).value || '';
        const fiturUnik = (document.getElementById('fitur-unik') || {}).value || '';
        const nadaSuara = (document.getElementById('nadaSuara') || {}).value || '';
        const harga = (document.getElementById('harga') || {}).value || '';
        
        const payload = { 
            userId: typeof currentUserID !== 'undefined' ? currentUserID : null,
            tipeProperti, targetAudiens, dataTeknis, fiturUnik, nadaSuara, harga 
        };

        generateButton.disabled = true;
        generateButton.textContent = 'Menganalisis & Meracik...';
        
        // Pastikan kita bisa menemukan kontainer output
        const outputContainer = document.getElementById('langkah-3');
        if (outputContainer) {
            outputContainer.style.display = 'none';
        } else {
            console.error("KRUSIAL: Elemen dengan ID 'langkah-3' tidak ditemukan di HTML!");
        }


        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session) throw new Error('Sesi Anda telah berakhir, silakan login ulang.');

            const resp = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload)
            });
            
            if (!resp.ok) {
                let serverError = await resp.text().catch(() => resp.statusText);
                try {
                    const errJson = JSON.parse(serverError);
                    serverError = errJson.error || serverError;
                } catch (e) {}
                throw new Error(serverError);
            }

            const responseBody = await resp.json();
            const data = parseNestedResponse(responseBody);
            
            console.log("DATA MENTAH DARI AI:", data);
            
            if (!data || typeof data !== 'object') {
                setStatus('Response tidak sesuai format JSON.', true);
                return;
            }

            // --- Mulai Render ---
            const kartu_portal = data.kartu_portal ?? null;
            const kartu_ig = data.kartu_ig ?? null;
            const kartu_tiktok = data.kartu_tiktok ?? null;
            const kartu_wa = data.kartu_wa ?? null;
            const audit_risiko = data.audit_risiko ?? null;
            const kartu_fb = data.kartu_fb ?? null; // Anda punya kartu_fb di JSON

            renderTitles(kartu_portal);

            // Render Portal
            if (kartu_portal) {
                const descHtml = kartu_portal.deskripsi ? '<div class="portal-content">' + escapeHtml(kartu_portal.deskripsi) + '</div>' : '';
                const seoHtml = kartu_portal.seo_keywords ? '<div class="seo-keywords">SEO Keywords: ' + escapeHtml(kartu_portal.seo_keywords) + '</div>' : '';
                if (outputPortal) outputPortal.innerHTML = descHtml + seoHtml;
            } else {
                if (outputPortal) outputPortal.textContent = 'Data portal tidak tersedia.';
            }
            
            // Render IG
            if (kartu_ig) {
                setPreSafe(outputIG, [kartu_ig.caption, kartu_ig.hashtags].filter(Boolean).join('\n\n'));
            } else {
                setPreSafe(outputIG, 'Data Instagram tidak tersedia.');
            }
            
            // Render TikTok
            if (kartu_tiktok) {
                const hooks = [`Hook 1: ${kartu_tiktok.hook_1}`, `Hook 2: ${kartu_tiktok.hook_2}`, `Hook 3: ${kartu_tiktok.hook_3}`];
                setPreSafe(outputTiktok, `${hooks.join('\n')}\n\nSkrip PSR:\n${kartu_tiktok.skrip_psr}`);
            } else {
                setPreSafe(outputTiktok, 'Data TikTok tidak tersedia.');
            }
            
            // Render WA
            setPreSafe(outputWA, kartu_wa || 'Data WhatsApp tidak tersedia.');

            // Render Audit Risiko
            if (audit_risiko && audit_risiko.points) {
                clearChildren(outputAudit);
                const titleElement = document.createElement('h4');
                titleElement.textContent = `⚡ ${audit_risiko.title}`;
                outputAudit.appendChild(titleElement);
                const listElement = document.createElement('ul');
                listElement.className = 'audit-list';
                audit_risiko.points.forEach(point => {
                    const itemElement = document.createElement('li');
                    itemElement.className = 'audit-item';
                    itemElement.innerHTML = `<p><strong>Verifikasi:</strong> ${escapeHtml(point.verifikasi)}</p><p><strong>Detail Analisis:</strong> ${escapeHtml(point.detail)}</p><p><strong>Potensi Risiko:</strong> ${escapeHtml(point.risiko)}</p>`;
                    listElement.appendChild(itemElement);
                });
                outputAudit.appendChild(listElement);
            } else {
                setPreSafe(outputAudit, 'Data Audit Risiko tidak tersedia.');
            }

            setStatus('Generate selesai', false);

        } catch (error) {
            console.error('TERJADI KECELAKAAN:', error);
            setStatus('Error: ' + error.message, true);
        } finally {
            // --- INI PERBAIKAN UTAMA ---
            // Pastikan tirai SELALU terbuka, baik berhasil maupun gagal
            if (outputContainer) {
                outputContainer.style.display = 'block';
            }
            // -------------------------

            generateButton.disabled = false;
            generateButton.textContent = prevText || 'Generate Konten';

            // Update saldo kredit setelah semua selesai
            if (typeof fetchCreditBalance === 'function' && typeof currentUserID !== 'undefined') {
                fetchCreditBalance(currentUserID);
            }
        }
    });
}

    // =================================================================
    // ▼▼▼ BLOK BARU: Listener untuk Tombol Copy Statis (yang hilang) ▼▼▼
    // =================================================================
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            if (!card) return;

            // Cari elemen konten (pre, .output-text)
            const contentContainer = card.querySelector('pre, .output-text');
            if (!contentContainer) return;
            
            const textToCopy = contentContainer.textContent;

            if (textToCopy && textToCopy !== '—') {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    button.textContent = 'Tersalin!';
                    button.classList.add('copied');
                    setTimeout(() => {
                        button.textContent = 'Copy';
                        button.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Gagal menyalin:', err);
                    setStatus('Gagal menyalin ke clipboard.', true);
                });
            }
        });
    });
    // =================================================================
    // ▲▲▲ AKHIR BLOK BARU ▲▲▲
    // =================================================================



// --- (MULAI) KODE OTENTIKASI PENGGUNA ---
// Tambahkan seluruh blok ini ke akhir file app.js Anda

// 1. Inisialisasi Klien Supabase (Pastikan ini ada di bagian atas file Anda juga)

// 2. Ambil semua elemen HTML yang kita butuhkan



// 3. Fungsi untuk menangani Login dan Daftar


// 4. Pasang "pendengar" ke tombol-tombol
loginButton.addEventListener('click', handleLogin);
signupButton.addEventListener('click', handleSignUp);
logoutButton.addEventListener('click', handleLogout);

// 5. INILAH BAGIAN YANG HILANG: "Otak" Pemantau Sesi
// onAuthStateChange adalah "penjaga" yang otomatis berjalan setiap kali
// status login pengguna berubah (login, logout, atau saat halaman pertama kali dimuat).
supabaseClient.auth.onAuthStateChange((event, session) => {
    const user = session ? session.user : null;
    updateUI(user);
});

// 6. Fungsi untuk memperbarui tampilan berdasarkan status login


// 7. Fungsi untuk mengambil saldo kredit dari database
// GANTI SELURUH FUNGSI fetchCreditBalance LAMA ANDA DENGAN INI


// Panggil updateUI saat halaman pertama kali dimuat untuk mengatur tampilan awal
updateUI(null);

});


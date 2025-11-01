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
        // ... (Fungsi renderTitles Anda yang ada) ...
        clearChildren(outputJudulList);
        if (!outputJudulList) return;
        if (!kartu_portal || typeof kartuportal !== 'object') {
            // ...
            return;
        }
        const keys = ['judul_1', 'judul_2', 'judul_3', 'judul_4', 'judul_5'];
        let any = false;
        keys.forEach(k => {
            const v = kartu_portal[k];
            if (v && String(v).trim().length) {
                any = true;
                const li = document.createElement('li');
                li.className = 'output-item';
                const title = document.createElement('p');
                title.textContent = v;
                li.appendChild(title);
                const btn = createCopyButton(v); // Menggunakan fungsi Anda
                li.appendChild(btn);
                outputJudulList.appendChild(li);
            }
        });
        // ...
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

    // Logika Login
    loginButton.addEventListener('click', async () => {
        authMessage.textContent = 'Masuk...';
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: authEmail.value,
            password: authPassword.value,
        });
        if (error) {
            authMessage.textContent = 'Error: Gagal masuk, cek email atau password Anda.';
        } else if (data.user) {
            authMessage.textContent = '';
            updateUIForLogin(data.user);
        }
    });

    // Logika Logout
    logoutButton.addEventListener('click', async () => {
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

    // Fungsi untuk update UI setelah login
    function updateUIForLogin(user) {
        currentUserID = user.id;
        currentUserEmail = user.email;

        loginForm.style.display = 'none';
        userSession.style.display = 'block';
        authContainer.style.borderColor = '#10B981';
        userEmailDisplay.textContent = `Selamat datang, ${currentUserEmail}`;
        
        mainComposerSteps.style.display = 'grid'; // Tampilkan form utama
        
        fetchCreditBalance(user.id);
    }

    // Fungsi untuk mengambil saldo kredit
    async function fetchCreditBalance(userId) {
        if (!userId) return;
        creditBalanceDisplay.textContent = 'Memuat...';
        
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session) throw new Error('Sesi tidak valid.');

            // Panggil fungsi Netlify ('getBalance')
            const response = await fetch('/.netlify/functions/getBalance', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}` // Mengirim token
                },
                body: JSON.stringify({ userId: userId })
            });
            
            if (!response.ok) throw new Error('Gagal mengambil data saldo.');
            const data = await response.json();
            
            if (data.balance !== undefined) {
                creditBalanceDisplay.textContent = data.balance;
            } else {
                creditBalanceDisplay.textContent = 'Error';
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
            creditBalanceDisplay.textContent = 'Error';
        }
    }

    // Cek sesi saat halaman dimuat
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
            
            // =================================================================
            // ▼▼▼ MODIFIKASI: Cek Login & ID Pengguna ▼▼▼
            // =================================================================
            if (!currentUserID) {
                alert('Anda harus login untuk menggunakan generator.');
                setStatus('Sesi tidak ditemukan, silakan login ulang.', true);
                return;
            }
            // =================================================================
            // ▲▲▲ AKHIR MODIFIKASI ▲▲▲
            // =================================================================

            const prevText = generateButton.textContent;
            
            // (Blok validasi Anda sudah sempurna, kita pertahankan)
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
                // ... (logika focus Anda sudah bagus) ...
                return;
            }

            // (Blok payload Anda kita MODIFIKASI)
            const payload = {
                // ▼▼▼ TAMBAHAN BARU ▼▼▼
                userId: currentUserID, 
                // ▲▲▲ AKHIR TAMBAHAN ▲▲▲
                tipeProperti: (document.getElementById('tipe-properti') || {}).value || '',
                targetAudiens: (document.getElementById('target-audiens') || {}).value || '',
                dataTeknis: (document.getElementById('data-teknis') || {}).value || '',
                fiturUnik: (document.getElementById('fitur-unik') || {}).value || '',
                nadaSuara: (document.getElementById('nadaSuara') || {}).value || '',
                harga: (document.getElementById('harga') || {}).value || ''
            };

            generateButton.disabled = true;
            generateButton.textContent = 'Meminta AI... (Bisa 30 detik)';
            if (langkah3Container) langkah3Container.style.display = 'none';

            try {
                const { data: { session } } = await supabaseClient.auth.getSession();
                if (!session) throw new Error('Sesi Anda telah berakhir, silakan login ulang.');

                const resp = await fetch('/.netlify/functions/generate', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        // ▼▼▼ TAMBAHAN BARU: Kirim Token Auth ▼▼▼
                        'Authorization': `Bearer ${session.access_token}`
                        // ▲▲▲ AKHIR TAMBAHAN ▲▲▲
                    },
                    body: JSON.stringify(payload)
                });

                let responseBody;
                if (!resp.ok) {
                    const errTxt = await resp.text().catch(() => '');
                    console.error('Generate API returned non-OK:', resp.status, errTxt);
                    let serverError = errTxt || resp.statusText;
                    try {
                        const errJson = JSON.parse(errTxt);
                        serverError = errJson.error || errTxt; 
                    } catch(e) {}
                    setStatus('Server error: ' + serverError, true);
                    try { responseBody = JSON.parse(errTxt); } catch { responseBody = errTxt; }
                } else {
                    try { responseBody = await resp.json(); } catch (err) {
                        const txt = await resp.text();
                        try { responseBody = JSON.parse(txt); } catch { responseBody = txt; }
                    }
                }
                
                const data = parseNestedResponse(responseBody);
                console.log("DATA MENTAH DARI AI:", data);

                if (!data || typeof data !== 'object') {
                    // ... (logika error Anda sudah bagus) ...
                    return;
                }

                // (SEMUA BLOK RENDER OUTPUT ANDA SUDAH SEMPURNA, KITA PERTAHANKAN)
                const kartu_portal = data.kartu_portal ?? null;
                const kartu_ig = data.kartu_ig ?? null;
                const kartu_tiktok = data.kartu_tiktok ?? null;
                const kartu_wa = data.kartu_wa ?? null;
                const audit_risiko = data.audit_risiko ?? null;

                renderTitles(kartu_portal);

                if (kartu_portal && (kartu_portal.deskripsi || kartu_portal.seo_keywords)) {
                    // ... (logika render portal Anda sudah bagus) ...
                } else {
                    // ...
                }

                if (kartu_ig) {
                    // ... (logika render IG Anda sudah bagus) ...
                } else {
                    // ...
                }

                if (kartu_tiktok) {
                    // ... (logika render TikTok Anda sudah bagus) ...
                } else {
                    // ...
                }

                if (kartu_wa) {
                    // ... (logika render WA Anda sudah bagus) ...
                } else {
                    // ...
                }
                
                if (audit_risiko && Array.isArray(audit_risiko.points) && audit_risiko.points.length > 0) {
                    // ... (logika render Audit Anda sudah bagus) ...
                } else {
                    // ...
                }

                setStatus('Generate selesai', false);
                if (langkah3Container) langkah3Container.style.display = 'block';

                // ▼▼▼ TAMBAHAN BARU: Update saldo setelah berhasil generate ▼▼▼
                fetchCreditBalance(currentUserID);

            } catch (error) {
                console.error('Error generate:', error);
                setStatus('Terjadi error saat meminta generate: ' + (error && error.message ? error.message : String(error)), true);
                if (langkah3Container) langkah3Container.style.display = 'block';
            } finally {
                generateButton.disabled = false;
                generateButton.textContent = prevText || 'Generate Konten';
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

});
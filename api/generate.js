// 1. Muat .env secara paksa
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.development.local') });

// 2. Impor library
const { createClient } = require('@supabase/supabase-js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// 3. JANGAN inisialisasi client di sini

// --- Fungsi Helper untuk Kredit (Tidak berubah) ---
async function checkAndDecrementCredit(supabase, userId) {
    const { data: userData, error: fetchError } = await supabase
        .from('user_credits')
        .select('credits_balance')
        .eq('user_id', userId)
        .single();

    if (fetchError) {
        if (fetchError.code === 'PGRST116') {
            throw new Error('Data kredit pengguna tidak ditemukan. Hubungi admin.');
        }
        throw new Error('Gagal memverifikasi pengguna: ' + fetchError.message);
    }

    if (userData.credits_balance <= 0) {
        throw new Error('Kredit Anda habis. Silakan lakukan top-up.');
    }

    const newBalance = userData.credits_balance - 1;
    const { error: updateError } = await supabase
        .from('user_credits')
        .update({ credits_balance: newBalance })
        .eq('user_id', userId);

    if (updateError) {
        throw new Error('Gagal mengupdate saldo kredit: ' + updateError.message);
    }
    return true;
}

// --- FUNGSI PROMPT INTI ANDA (v1.3 - TIDAK DISENTUH) ---
function createMasterPrompt(input) {
  const {
    tipeProperti = '',
    targetAudiens = '',
    dataTeknis = '',
    fiturUnik = '',
    nadaSuara = '',
    harga = ''
  } = input || {};

  return `
Anda adalah "REWIRED COPILOT" v1.3 — PENULIS KONTEN PROPERTI PROFESIONAL.

// SISIPKAN BLOK INI:

# PERATURAN KREATIVITAS UTAMA (WAJIB DIIKUTI DI SEMUA OUTPUT COPYWRITING):
- **VARIASIKAN STRUKTUR KALIMAT:** Jangan memulai setiap kalimat dengan subjek yang sama. Gunakan kombinasi kalimat pendek yang tegas dan kalimat panjang yang deskriptif.
- **GUNAKAN DIKSI YANG KAYA:** Hindari pengulangan kata sifat yang sama (misal: "strategis", "menarik", "ideal"). Cari sinonim atau cara lain untuk mendeskripsikan sebuah konsep.
- **GUNAKAN TEKNIK RETORIKA:** Gunakan pertanyaan retoris ("Bayangkan memulai pagi Anda dengan pemandangan danau..."), analogi, dan bahasa kiasan untuk membuat tulisan lebih hidup.
- **JADILAH DINAMIS:** Setiap kali Anda menulis, bertindaklah seolah-olah ini adalah pertama kalinya Anda mendeskripsikan properti ini. Tunjukkan antusiasme dan temukan sudut pandang yang unik.

// AKHIR DARI BLOK SISIPAN

# --- (MULAI PERUBAHAN v1) ---

# LANGKAH UTAMA: GAYA BAHASA & NADA SUARA (PERATURAN WAJIB)
Nada Suara Pilihan: ${nadaSuara}
Gunakan ini sebagai filter utama untuk SEMUA copywriting yang Anda hasilkan. Sesuaikan DIKSI, STRUKTUR KALIMAT, dan PANGGILAN EMOSI berdasarkan pilihan ini.
- Profesional: Formal, to the point, fokus pada data dan ROI (Return on Investment). Hindari bahasa bunga dan emoji berlebihan.
- Persuasif: Gunakan storytelling, fokus pada benefit emosional, ajak audiens membayangkan memiliki properti tersebut. Gunakan kata-kata yang membangkitkan keinginan.
- Informatif: Netral, jelas, dan fokus pada fakta. Seperti seorang jurnalis atau ensiklopedia. Prioritaskan keakuratan data.
- Santai: Gunakan bahasa sehari-hari, sapaan akrab (misal: "buat kamu yang lagi cari..."), dan emoji yang relevan untuk membangun kedekatan.

# --- (AKHIR PERUBAHAN v1) ---


=== LANGKAH 0: AUDIT INPUT (Insight Broker) ===
- Sebelum menulis, ANALISIS "Data Teknis" yang diberikan.
- Cari dan normalisasi data standar: LT (Luas Tanah), LB (Luas Bangunan), KT (Jumlah Kamar Tidur), KM (Jumlah Kamar Mandi), Legalitas (SHM / HGB / IMB / status sertifikat), Listrik (daya / 1 phase / 3 phase).
- Catat apakah setiap item ada, tidak jelas, atau hilang.

=== LANGKAH X: AUDIT RISIKO & VALIDASI DATA (INSIGHT BROKER) ===

# --- (MULAI BLOK BARU UNTUK AUDIT RISIKO v3.0) ---

# PERAN & KONTEKS: Khusus untuk bagian ini, Anda adalah konsultan properti senior DAN seorang analis data. Tugas Anda ganda: pertama, validasi kewajaran data yang diinput pengguna. Kedua, berikan checklist verifikasi (due diligence) yang tajam kepada broker.

# PROSES BERPIKIR WAJIB (KHUSUS UNTUK AUDIT RISIKO):

1.  **EVALUASI KRITIS & DETEKSI ANOMALI DATA INPUT:** Ini adalah langkah pertama dan terpenting. Jangan terima data mentah-mentah. Analisis semua input ('tipe_properti', 'data_teknis', 'harga') untuk menemukan potensi kejanggalan, inkonsistensi, atau "red flags".

  -   **Validasi Legalitas vs Tipe Properti:** Apakah jenis sertifikat yang disebut di 'data_teknis' sesuai dengan 'tipe_properti'? (Contoh Red Flag: input "Apartemen" dengan "SHM", seharusnya **SHMSRS**).

  -   **Validasi Ukuran (LT vs LB):** Apakah Luas Bangunan (LB) lebih besar dari Luas Tanah (LT)? Jika ya, ini wajar untuk bangunan bertingkat, tapi berikan catatan "Pastikan IMB/PBG sesuai untuk bangunan X lantai". Jika tidak wajar (misal: tanah kosong tapi LB > 0), tandai sebagai anomali.

  -   **Validasi Kewajaran Harga:** Apakah 'harga' yang diinput terlihat terlalu murah atau terlalu mahal untuk kombinasi 'tipe_properti' dan 'data_teknis' (terutama ukuran dan lokasi jika ada)? Beri saran agar broker melakukan riset komparatif (cek NJOP & harga pasar sekitar).

  -   **Validasi Kelengkapan Data:** Apakah ada informasi krusial yang hilang dari 'data_teknis'? (Contoh: Tidak ada info IMB/PBG, tidak ada info daya listrik, tidak ada info hadap properti). Catat ini sebagai poin yang harus segera dicari tahu oleh broker.


2.  **CHECKLIST VERIFIKASI MENDALAM (4 PILAR):** Setelah mengevaluasi data, buat 7-10 poin verifikasi detail berdasarkan 4 pilar. Integrasikan temuan dari Langkah 1 ke dalam poin-poin ini.

    -   **A. Pilar Legalitas & Perizinan:** (Contoh terintegrasi: "Sertifikat disebutkan SHM, namun untuk Apartemen seharusnya SHMSRS. Wajib verifikasi TIPE sertifikat asli di BPN dan pastikan tidak berstatus agunan.")

    -   **B. Pilar Fisik & Teknis:** (Contoh terintegrasi: "Daya listrik tidak disebutkan. Wajib verifikasi kapasitas terpasang dan apakah cukup untuk kebutuhan properti [misal: gudang/ruko].")

    -   **C. Pilar Lingkungan & Zonasi:** Cek risiko banjir, peruntukan zonasi di RDTR, dan kondisi keamanan lingkungan.

    -   **D. Pilar Finansial & Transaksi:** Cek biaya tersembunyi (IPL), potensi kenaikan NJOP, dan legalitas status over kredit.


# STRUKTUR OUTPUT (KHUSUS UNTUK "audit_risiko"):

- Hasilkan sebuah object JSON bernama "audit_risiko".

- Di dalamnya harus ada 'title' dan sebuah array 'points'.

- Setiap item di dalam 'points' harus memiliki tiga key: 'verifikasi' (apa yang harus dicek), 'detail' (bagaimana cara mengeceknya dan hasil analisis data Anda), dan 'risiko' (konsekuensi jika diabaikan).

# --- (AKHIR DARI BLOK BARU UNTUK AUDIT RISIKO v3.0) ---

  # END LANGKAH X — lanjutkan ke LANGKAH 1..5 untuk konten pemasaran seperti biasa
- LANGKAH 0 (v2) — ATURAN ANTI-HALUSINASI (lebih ketat):
  - DILARANG KERAS berasumsi atau menambah atribut yang TIDAK disebutkan. Semua klaim harus ditautkan ke "Data Teknis" atau "Fitur Unik".
  - AI harus 100% RELEVAN dengan "Tipe Properti". Contoh tegas: jika tipe = "Gudang", JANGAN menyebut "kamar tidur", "kos", "mahasiswa", atau fitur hunian lainnya. Jika tipe = "Ruko", fokus pada fungsi ruko/dagang, bukan fitur hunian.
  - Jika informasi tidak tersedia, sebutkan placeholder eksak, mis. "Harga tidak disediakan", "Status legalitas tidak disebutkan".

=== LANGKAH 1: ANALISIS INPUT & PERMATA ===
- Catat 2-3 fakta teknis valid dari "Data Teknis".
- Identifikasi 2-3 "Permata" (selling points factual) yang nyata dari input.

=== LANGKAH 2: TENTUKAN THE BIG IDEA (Metode Ryan Serhant) — WAJIB SEBELUM MENULIS
- Temukan 1 (satu) "THE BIG IDEA": nilai jual emosional / lifestyle yang berdasar fakta input.
- The Big Idea harus menjadi benang merah untuk semua output.

=== LANGKAH 3: P-S-R (PROBLEM - STRUGGLE - RESOLUTION)
- Koneksikan Permata + Target Audiens ke format P-S-R untuk hooks dan skrip.

=== LANGKAH 4: TONE ===
# DIHAPUS - Instruksi TONE sekarang menjadi PERATURAN UTAMA di awal. Baris ini sengaja dibiarkan kosong.

=== LANGKAH 5: SEMPURNAKAN OUTPUT (CTA + HASHTAGS)
- Setelah semua teks dibuat, tambahkan 1 Call To Action (CTA) yang relevan di akhir setiap output promosi AND append 3–5 hashtag relevan (format: #tag tanpa spasi).
- Pastikan CTA + hashtags ada di akhir dari:
  - kartu_ig.caption (tambahkan CTA + 3–5 hashtag)
  - kartu_tiktok.skrip_psr (tambahkan CTA + 3–5 hashtag)
  - kartu_fb (tambahkan CTA + 3–5 hashtag)
  - kartu_wa (tambahkan CTA + 3–5 hashtag)

=== PERINTAH KUALITAS TAMBAHAN ===
- Portal SEO content (kartu_portal.deskripsi) MUST be substantially longer for search optimization:
  - Generate AT LEAST 3 paragraphs and aim for MINIMUM 250 words total when the input allows. If data is sparse, be explicit and use placeholders (see LANGKAH 0) but still produce 3 paragraphs with guidance for the broker.
  - Paragraph breakdown (required):
    1) Short, attention-grabbing summary that includes THE BIG IDEA.
    2) Detailed technical description and location advantages (use facts from Data Teknis and Fitur Unik); include nearby facilities/transport if present in input.
    3) Call-to-action + note on legal/price status (e.g., 'Harga: ...' or 'Harga tidak disediakan') and next steps for buyer/contact.
  - Also output a concise "seo_keywords" string (comma-separated) based on the content.
  # --- (MULAI PERUBAHAN v2) ---
  - **WAJIB:** Tulis seluruh konten portal dengan ${nadaSuara}.
  # --- (AKHIR PERUBAHAN v2) ---


- Instagram narrative (kartu_ig.caption) MUST prioritize storytelling and mobile readability:
  - Produce at least 4 short paragraphs (separated by blank lines). Use line breaks liberally so each paragraph reads well on mobile.
  - Paragraph breakdown (required):
    1) Hook or provocative question to grab attention.
    2) Lifestyle / emotional framing tied to THE BIG IDEA.
    3) Property features / Fitur Unik in vivid language.
    4) Strong CTA (contact/visit) + appended hashtags (3-5).
  # --- (MULAI PERUBAHAN v3) ---
  - **WAJIB:** Tulis caption dengan gaya ${nadaSuara}, sesuaikan diksi dan panggilan emosinya.
  # --- (AKHIR PERUBAHAN v3) ---


- Facebook long-form (kartu_fb) MUST be at least 150 words. WAJIB ditulis dengan gaya ${nadaSuara}. Include data points and THE BIG IDEA; end with CTA + hashtags.
- TikTok skrip_psr must be concise (<=100 words). WAJIB ditulis dengan gaya ${nadaSuara}. Include P-S-R, THE BIG IDEA, CTA + hashtags.
- WA must be <=50 words. WAJIB ditulis dengan gaya ${nadaSuara}. End with CTA + hashtags.

- IMPORTANT: Do NOT change the brevity or format of these outputs which must remain concise and point-form: kartu_portal.judul_1..5 (titles), kartu_tiktok hooks.

=== OUTPUT: JSON v1.3 (HANYA JSON FINAL, TANPA PENJELASAN) ===
- Keluarkan SATU object JSON dengan tepat 6 keys:
  - kartu_portal (harus berisi judul_1..judul_5, deskripsi, seo_keywords)
  - kartu_ig
  - kartu_tiktok
  - kartu_fb
  - kartu_wa
  - kartu_audit
  - audit_risiko

- kartu_portal.judul_1 .. judul_5 = 5 variasi judul SEO-friendly yang menggunakan THE BIG IDEA.
- kartu_ig = { "caption": ".... (>=100 words, CTA + hashtags)", "hashtags": "#..., #..., #..." }
- kartu_tiktok = { "hook_1": "...", "hook_2": "...", "hook_3": "...", "skrip_psr": "... (<=100 words, CTA + hashtags)" }
- kartu_fb = "Long-form narrative (>=150 words) ending with CTA + hashtags"
- kartu_wa = "Short WA blast (<=50 words) ending with CTA + hashtags"
- audit_risiko = { "title": "...", "points": [ { "verifikasi": "...", "detail": "...", "risiko": "..." } ] }

- If information is missing, DO NOT INVENT — use explicit placeholders like "Harga tidak disediakan" or "Status legalitas tidak disediakan".
- All outputs must adhere to all rules.

FORMAT EXAMPLE (ONLY for schema reference — DO NOT output this example in final):
{
  "kartu_portal": { "judul_1":"...","judul_2":"...","judul_3":"...","judul_4":"...","judul_5":"...","deskripsi":"...","seo_keywords":"..., ..." },
  "kartu_ig": { "caption":"...(>=100 words)... CTA. #tag1 #tag2 #tag3", "hashtags":"#tag1,#tag2,#tag3" },
  "kartu_tiktok": { "hook_1":"...","hook_2":"...","hook_3":"...","skrip_psr":"...(<=100 words)... CTA. #tag1 #tag2 #tag3" },
  "kartu_fb": "...(>=150 words)... CTA. #tag1 #tag2 #tag3",
  "kartu_wa": "...(<=50 words)... CTA. #tag1 #tag2",
  "audit_risiko": { "title": "...", "points": [ { "verifikasi": "...", "detail": "...", "risiko": "..." } ] }
}

USE INPUT CONTEXT:
- Tipe Properti: "${tipeProperti}"
- Target Audiens: "${targetAudiens}"
- Data Teknis: "${dataTeknis}"
- Fitur Unik: "${fiturUnik}"
- Harga: "${harga}"

PRICE HANDLING (SINGKAT):
- Jika 'harga' diberikan (non-empty), sertakan penyebutan harga singkat di 'kartu_portal.deskripsi' (contoh: "Harga: 1.5 M — nego") dan gunakan referensi harga bila relevan pada CTA.
- Jika 'harga' kosong atau tidak diberikan, gunakan placeholder eksak "Harga tidak disediakan" di 'kartu_portal.deskripsi' dan tambahkan instruksi verifikasi di 'kartu_audit'.

KELUARKAN HANYA SATU JSON FINAL YANG VALID SESUAI SPESIFIKASI DI ATAS. JANGAN MENAMBAHKAN PENJELASAN APA PUN.
`.trim();
}


// --- FUNGSI UTAMA (VERCEL HANDLER) ---
module.exports = async (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const API_URL = 'https://api.openai.com/v1/chat/completions';

  // Keamanan: Hanya izinkan POST
  if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY');
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
  }

  try {
    // ▼▼▼ PERBAIKAN: INISIALISASI SUPABASE DIMULAI DI SINI ▼▼▼
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Kunci Supabase (URL atau Service Key) tidak ditemukan.');
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    // ▲▲▲ AKHIR BLOK PERBAIKAN ▲▲▲

    const inputBroker = req.body || {}; // Ambil dari req.body

    // ▼▼▼ SUNTIKAN KODE KREDIT ▼▼▼
    const { userId } = inputBroker;
    if (!userId) {
        return res.status(401).json({ error: 'Tidak terautentikasi (User ID tidak ada). Silakan login ulang.' });
    }
    // Cek & kurangi kredit. Lemparkan 'supabase' ke dalam fungsi.
    await checkAndDecrementCredit(supabase, userId);
    // ▲▲▲ AKHIR SUNTIKAN KODE KREDIT ▲▲▲

    const masterPrompt = createMasterPrompt(inputBroker);

   const payload = {
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        { role: "system", content: masterPrompt },
        {
          role: "user",
          content: "Generate the JSON v1.3 package now. Output MUST be a single valid JSON object only. DO NOT output any extra commentary."
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('OpenAI API error', response.status, errText);
      return res.status(response.status || 500).json({ error: 'OpenAI API error', details: errText || response.statusText });
    }

    const data = await response.json();


    // --- BLOK PARSING ROBUST ANDA (VERSI BERSIH FINAL) ---
// (Perlu Anda cek di sekitar baris 300)
let generatedContent = null;
try {
  const first = Array.isArray(data.choices) && data.choices.length > 0 ? data.choices[0] : null;
  let raw = null;

  if (first) {
    if (first.message && first.message.content) {
      raw = first.message.content;
    } else if (first.content) {
      raw = first.content;
    } else if (first.text) {
      raw = first.text;
    } else {
      raw = first;
    }
  } else {
    raw = data;
  }

  if (typeof raw === 'string') {
    const t = raw.trim();
    if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
      try {
        generatedContent = JSON.parse(t);
      } catch (e) {
        generatedContent = raw;
      }
    } else {
      generatedContent = raw;
    }
  } else {
    generatedContent = raw;
  }
} catch (e) {
  generatedContent = data;
}
// --- AKHIR BLOK PARSING ROBUST ANDA ---

    return res.status(200).json(generatedContent);

  } catch (error) {
    console.error('Vercel function error:', error);
    return res.status(400).json({ error: error.message || 'Internal Server Error' });
  }
};
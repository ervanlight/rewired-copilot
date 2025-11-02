// 1. Muat .env secara paksa
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.development.local') });

// 2. Impor library
const { createClient } = require('@supabase/supabase-js');

// 3. JANGAN inisialisasi client di sini

// 4. FORMAT VERCEL: Gunakan module.exports
module.exports = async (req, res) => {
    // 5. Keamanan POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 6. Inisialisasi Klien (HANYA saat dibutuhkan)
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Kunci Supabase (URL atau Service Key) tidak ditemukan.');
        }
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { userId } = req.body; // Ambil dari req.body (bukan event.body)

        if (!userId) {
            return res.status(400).json({ error: 'User ID tidak ada.' });
        }

        // 7. Ambil Saldo Kredit
        const { data: userData, error: fetchError } = await supabase
            .from('user_credits')
            .select('credits_balance')
            .eq('user_id', userId)
            .single();

        if (fetchError) {
            throw new Error('Gagal mengambil data kredit: ' + fetchError.message);
        }

        // 8. Sukses: Kembalikan JSON (gaya Vercel)
        return res.status(200).json({ balance: userData.credits_balance });

    } catch (error) {
        console.error('Error di getBalance function:', error);
        // 9. Error: Kembalikan JSON (gaya Vercel)
        return res.status(500).json({ error: error.message });
    }
};
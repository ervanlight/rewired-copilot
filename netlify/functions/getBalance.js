const { createClient } = require('@supabase/supabase-js');

// Inisialisasi Klien Supabase (Menggunakan Kunci Rahasia)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    // 1. Keamanan: Hanya izinkan POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const { userId } = JSON.parse(event.body);

        // 2. Validasi Kritis: Cek apakah userId ada
        if (!userId) {
            return { statusCode: 400, body: JSON.stringify({ error: 'User ID tidak ada.' }) };
        }

        // 3. Ambil Saldo Kredit
        const { data: userData, error: fetchError } = await supabase
            .from('user_credits')
            .select('credits_balance')
            .eq('user_id', userId)
            .single(); // Ambil satu baris

        if (fetchError) {
            throw new Error('Gagal mengambil data kredit: ' + fetchError.message);
        }

        // 4. Sukses: Kembalikan saldo
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ balance: userData.credits_balance }),
        };

    } catch (error) {
        // 5. Tangani Error
        console.error('Error di getBalance function:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
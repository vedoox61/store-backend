const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// POST — إرسال رسالة
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'كل الحقول مطلوبة' });
    }

    const { data, error } = await supabase
        .from('messages')
        .insert([{ name, email, message }])
        .select();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: '✅ تم إرسال رسالتك بنجاح!' });
});

// GET — جلب كل الرسائل (للأدمين)
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;
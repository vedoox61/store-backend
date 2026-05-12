const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// POST — إنشاء طلب جديد
router.post('/', async (req, res) => {
    const { customer_name, customer_email, product_id, quantity, total } = req.body;
    
    const { data, error } = await supabase
        .from('orders')
        .insert([{ customer_name, customer_email, product_id, quantity, total }])
        .select();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// GET — جلب كل الطلبات
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*, products(name, price)')
        .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// PUT — تغيير status الطلب
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

module.exports = router;
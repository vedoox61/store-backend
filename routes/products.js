const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// GET — جلب كل المنتجات
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*');
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST — إضافة منتج جديد
router.post('/', async (req, res) => {
    const { name, price, description, image_url, stock } = req.body;
    
    const { data, error } = await supabase
        .from('products')
        .insert([{ name, price, description, image_url, stock }])
        .select();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// PUT — تعديل منتج
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, description, image_url, stock } = req.body;
    
    const { data, error } = await supabase
        .from('products')
        .update({ name, price, description, image_url, stock })
        .eq('id', id)
        .select();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// DELETE — حذف منتج
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: '✅ تم حذف المنتج' });
});

module.exports = router;
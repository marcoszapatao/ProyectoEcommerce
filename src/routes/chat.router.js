import express from 'express';

const router = express.Router();

router.get('/chatea', (req, res) => {
    res.render('chat',{});
})

export default router;
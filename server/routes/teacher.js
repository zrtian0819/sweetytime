import express from 'express';
import db from '#configs/mysql.js';
const router = express.Router();

// 抓取所有教師資料
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM teacher');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

// 抓取特定教師詳細資料
router.get('/teacherDetail/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM teacher WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teacher detail' });
  }
});

export default router;


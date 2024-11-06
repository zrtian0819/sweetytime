import express from 'express';
import db from '#configs/mysql.js';
const router = express.Router();

// 抓取所有教師資料，並根據關鍵字、狀態和專長進行篩選
router.get('/', async (req, res) => {
  const { keyword, status, expertise } = req.query;
  const params = [];
  let query = 'SELECT * FROM teacher WHERE 1=1';

  // 關鍵字篩選
  if (keyword) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    const likeKeyword = `%${keyword}%`;
    params.push(likeKeyword, likeKeyword);
  }

  // 狀態篩選
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  // 專長篩選
  if (expertise) {
    const expertiseArray = expertise.split(',');
    const expertiseConditions = expertiseArray.map(() => 'expertise LIKE ?').join(' OR ');
    query += ` AND (${expertiseConditions})`;
    expertiseArray.forEach((exp) => params.push(`%${exp}%`));
  }

  try {
    const [rows] = await db.query(query, params);
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

// 新增專長選項的 API
router.get('/expertise-options', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT expertise FROM teacher');
    const expertiseOptions = rows.map(row => row.expertise);
    res.json(expertiseOptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expertise options' });
  }
});

export default router;



// import express from 'express';
// import db from '#configs/mysql.js';
// const router = express.Router();

// // 抓取所有教師資料，並根據關鍵字和狀態篩選
// router.get('/', async (req, res) => {
//   const { keyword, status } = req.query;
//   const params = [];
//   let query = 'SELECT * FROM teacher WHERE 1=1';

//   // 關鍵字篩選
//   if (keyword) {
//     query += ' AND (name LIKE ? OR expertise LIKE ?)';
//     const likeKeyword = `%${keyword}%`;
//     params.push(likeKeyword, likeKeyword);
//   }

//   // 狀態篩選
//   if (status) {
//     query += ' AND status = ?';
//     params.push(status);
//   }

//   try {
//     const [rows] = await db.query(query, params);
//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch teachers' });
//   }
// });

// // 抓取特定教師詳細資料
// router.get('/teacherDetail/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const [rows] = await db.query('SELECT * FROM teacher WHERE id = ?', [id]);
//     if (rows.length > 0) {
//       res.json(rows[0]);
//     } else {
//       res.status(404).json({ error: 'Teacher not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch teacher detail' });
//   }
// });

// export default router;
import express from 'express';
import db from '#configs/mysql.js';
const router = express.Router();

// 抓取所有教師資料，並根據關鍵字和狀態篩選
router.get('/', async (req, res) => {
  const { keyword, status } = req.query;
  const params = [];
  let query = 'SELECT * FROM teacher WHERE 1=1';

  // 關鍵字篩選
  if (keyword) {
    query += ' AND (name LIKE ? OR expertise LIKE ?)';
    const likeKeyword = `%${keyword}%`;
    params.push(likeKeyword, likeKeyword);
  }

  // 狀態篩選
  if (status) {
    query += ' AND status = ?';
    params.push(status);
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

export default router;

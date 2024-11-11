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

//   // 狀態篩選，使用 activation 欄位
//   if (status === 'active') {
//     query += ' AND activation = 1';
//   } else if (status === 'inactive') {
//     query += ' AND activation = 0';
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

// // 切換教師啟用狀態
// router.put('/toggleStatus/:id', async (req, res) => {
//   const { id } = req.params;
//   const { activation } = req.body; // activation should be 1 (啟用) or 0 (停用)

//   try {
//     // 更新指定教師的 activation 狀態
//     const [result] = await db.query('UPDATE teacher SET activation = ? WHERE id = ?', [activation, id]);

//     if (result.affectedRows > 0) {
//       res.json({ message: 'Teacher status updated successfully' });
//     } else {
//       res.status(404).json({ error: 'Teacher not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update teacher status' });
//   }
// });

// export default router;

import express from 'express';
import db from '#configs/mysql.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// 使用 `multer` 保持原檔名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // 使用原始檔名
  },
});

const upload = multer({ storage: storage });

// 抓取所有教師資料
router.get('/', async (req, res) => {
  const { keyword, status } = req.query;
  const params = [];
  let query = 'SELECT * FROM teacher WHERE 1=1';

  if (keyword) {
    query += ' AND (name LIKE ? OR expertise LIKE ?)';
    const likeKeyword = `%${keyword}%`;
    params.push(likeKeyword, likeKeyword);
  }

  if (status === 'active') {
    query += ' AND activation = 1';
  } else if (status === 'inactive') {
    query += ' AND activation = 0';
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

// 切換教師啟用狀態
router.put('/toggleStatus/:id', async (req, res) => {
  const { id } = req.params;
  const { activation } = req.body;

  try {
    const [result] = await db.query('UPDATE teacher SET activation = ? WHERE id = ?', [activation, id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Teacher status updated successfully', newStatus: activation });
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update teacher status' });
  }
});

// 新增教師資料
router.post('/', upload.single('img_path'), async (req, res) => {
  const { name, description, expertise, experience, education, licence, awards, activation } = req.body;
  const imgPath = req.file ? req.file.originalname : 'default.png';

  try {
    const [result] = await db.query(
      'INSERT INTO teacher (name, description, expertise, experience, education, licence, awards, activation, img_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, expertise, experience, education, licence, awards, activation, imgPath]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'Teacher added successfully', teacherId: result.insertId });
    } else {
      res.status(400).json({ error: 'Failed to add teacher' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add teacher' });
  }
});

// 更新教師資料並僅保留圖片檔名
router.put('/:id', upload.single('img_path'), async (req, res) => {
  const { id } = req.params;
  const { name, description, expertise, experience, education, licence, awards, activation } = req.body;
  const imgPath = req.file ? req.file.originalname : req.body.img_path;

  try {
    const [result] = await db.query(
      'UPDATE teacher SET name = ?, description = ?, expertise = ?, experience = ?, education = ?, licence = ?, awards = ?, activation = ?, img_path = ? WHERE id = ?',
      [name, description, expertise, experience, education, licence, awards, activation, imgPath, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'Teacher updated successfully' });
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

export default router;


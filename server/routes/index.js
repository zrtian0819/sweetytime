import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

export default router

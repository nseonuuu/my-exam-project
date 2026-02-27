const express = require('express');
const router = express.Router();
const { grade } = require('../controllers/gradeController');
const authCheck = require('../middlewares/authCheck');

router.post('/', authCheck, grade); // 로그인한 사용자만 채점 가능

module.exports = router;
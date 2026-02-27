const express = require('express');
const router = express.Router();
const { getExams, getQuestions } = require('../controllers/examController');

router.get('/', getExams);
router.get('/:subjectId/questions', getQuestions);

module.exports = router;
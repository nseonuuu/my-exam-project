const express = require('express');
const router = express.Router();
const { updateAnswer } = require('../controllers/answerController');
const authCheck = require('../middlewares/authCheck');

router.patch('/:answerId', authCheck, updateAnswer);

module.exports = router;
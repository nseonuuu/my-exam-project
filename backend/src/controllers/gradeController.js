const { gradeExam } = require('../services/gradingService');

const grade = async (req, res) => {
  const { subjectId, userAnswers } = req.body;
  const userId = req.user.id; // authCheck 미들웨어가 주입

  if (!subjectId || !Array.isArray(userAnswers)) {
    return res.status(400).json({ message: 'subjectId와 userAnswers 배열이 필요합니다.' });
  }

  try {
    const result = await gradeExam({ userId, subjectId, userAnswers });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '채점 오류', error: err.message });
  }
};

module.exports = { grade };
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 시험 목록 조회 (드롭다운용)
const getExams = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      include: { subjects: true }
    });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

// 특정 과목의 정답 목록 조회
const getQuestions = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const questions = await prisma.question.findMany({
      where: { subjectId: Number(subjectId) },
      orderBy: { questionNumber: 'asc' }
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

module.exports = { getExams, getQuestions };
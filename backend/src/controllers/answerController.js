const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateAnswer = async (req, res) => {
  const { answerId } = req.params;
  const { difficulty, importance, memo } = req.body;

  try {
    const updated = await prisma.userAnswer.update({
      where: { id: Number(answerId) },
      data: { difficulty, importance, memo }
    });

    res.json({ message: '메모 저장 완료', data: updated });
  } catch (err) {
    res.status(500).json({ message: '저장 오류', error: err.message });
  }
};

module.exports = { updateAnswer };
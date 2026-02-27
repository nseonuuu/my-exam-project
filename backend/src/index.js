const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const answerRoutes = require('./routes/answerRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// 라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/grade', gradeRoutes);
app.use('/api/answers', answerRoutes);

app.get('/', (req, res) => {
  res.json({ message: '기출채점기 서버 정상 동작 중 ✅' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
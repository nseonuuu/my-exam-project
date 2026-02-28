import api from './axiosInstance';

// 시험 목록 조회 (드롭다운용)
export const fetchExamList = () =>
  api.get('/api/exams');

// 특정 시험의 정답 목록 조회
export const fetchCorrectAnswers = (subjectId) =>
  api.get(`/api/exams/${subjectId}/questions`);

// 채점 결과 저장
export const submitGrade = (payload) =>
  api.post('/api/grade', payload);

// 메모/난이도/중요도 저장
export const updateAnswerMemo = (answerId, data) =>
  api.patch(`/api/answers/${answerId}`, data);

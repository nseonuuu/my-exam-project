import api from './axiosInstance';

// 시험 목록 조회 (드롭다운용)
export const fetchExamList = () =>
  api.get('/api/exams');

// 특정 시험의 정답 목록 조회
export const fetchCorrectAnswers = (subjectId) =>
  axios.get(`${BASE_URL}/api/exams/${subjectId}/answers`);

// 채점 결과 저장
export const submitGrade = (payload) =>
  axios.post(`${BASE_URL}/api/grade`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

// 메모/난이도/중요도 저장
export const updateAnswerMemo = (answerId, data) =>
  axios.patch(`${BASE_URL}/api/answers/${answerId}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
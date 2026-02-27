import api from './axiosInstance';

// 과목별 점수 기록 전체 조회 (그래프용)
export const fetchScoreHistory = () =>
  api.get('/api/records/history');

// 유형별 오답 통계 조회
export const fetchTypeStats = () =>
  axios.get(`${BASE_URL}/api/records/type-stats`, authHeader());

// 오답노트 목록 조회 (필터 파라미터 포함)
export const fetchWrongAnswers = (params) =>
  axios.get(`${BASE_URL}/api/answers/wrong`, { ...authHeader(), params });
  // params 예시: { subject: '언어논리', importance: 3, sort: 'date' }

// 커스텀 시험 등록
export const createCustomExam = (payload) =>
  axios.post(`${BASE_URL}/api/custom-exams`, payload, authHeader());

// 커스텀 시험 목록 조회
export const fetchCustomExams = () =>
  axios.get(`${BASE_URL}/api/custom-exams`, authHeader());
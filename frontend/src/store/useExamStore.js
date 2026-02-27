// src/store/useExamStore.js
import { create } from 'zustand';

const useExamStore = create((set, get) => ({
  // ─── 상태(State) ───────────────────────────────
  activeExams: [],        // 열려있는 탭 목록
  currentTabId: null,     // 현재 선택된 탭 ID

  // ─── 탭 관련 액션 ──────────────────────────────

  // 새 탭 추가 (시험 선택 드롭다운 확정 시 호출)
  addTab: (examInfo) => {
    const isDuplicate = get().activeExams.some(
      (e) =>
        e.examInfo.year    === examInfo.year &&
        e.examInfo.subject === examInfo.subject &&
        e.examInfo.booklet === examInfo.booklet
    );

    if (isDuplicate) {
      alert('이미 열려있는 시험지입니다.');
      return;
    }

    const newTab = {
      tabId: `tab_${Date.now()}`,
      examInfo,                        // { year, subject, booklet }
      userAnswers: Array(40).fill(null), // 40문항 빈 배열
      isGraded: false,
      score: null,
      gradeResult: [],                 // 문항별 채점 결과 배열
    };
    set((state) => ({
      activeExams: [...state.activeExams, newTab],
      currentTabId: newTab.tabId,      // 추가하면 바로 해당 탭으로 이동
    }));
  },

  // 탭 닫기
  removeTab: (tabId) => {
    set((state) => {
      const filtered = state.activeExams.filter((e) => e.tabId !== tabId);
      return {
        activeExams: filtered,
        currentTabId: filtered.length > 0
          ? filtered[filtered.length - 1].tabId
          : null,
      };
    });
  },

  // 탭 전환
  switchTab: (tabId) => set({ currentTabId: tabId }),

  // ─── 답안 입력 액션 ────────────────────────────

  // 특정 탭의 특정 문항 답안 업데이트
  setAnswer: (tabId, questionIndex, answer) => {
    set((state) => ({
      activeExams: state.activeExams.map((exam) =>
        exam.tabId === tabId
          ? {
              ...exam,
              userAnswers: exam.userAnswers.map((a, i) =>
                i === questionIndex ? answer : a
              ),
            }
          : exam
      ),
    }));
  },

  // ─── 채점 결과 저장 액션 ───────────────────────

  setGraded: (tabId, score, gradeResult) => {
    set((state) => ({
      activeExams: state.activeExams.map((exam) =>
        exam.tabId === tabId
          ? { ...exam, isGraded: true, score, gradeResult }
          : exam
      ),
    }));
  },

  // ─── 현재 탭 데이터 조회 (편의용 셀렉터) ────────
  getCurrentExam: () => {
    const { activeExams, currentTabId } = get();
    return activeExams.find((e) => e.tabId === currentTabId) ?? null;
  },
}));

export default useExamStore;
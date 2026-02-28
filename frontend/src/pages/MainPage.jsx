import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useExamStore from '../store/useExamStore';
import MultiTabBoard from '../features/exam/MultiTabBoard';
import OmrSheet from '../features/exam/OmrSheet';
import ResultSummary from '../features/result/ResultSummary';
import QuestionDetail from '../features/result/QuestionDetail';
import { fetchExamList } from '../api/examApi';

export default function MainPage() {
  const { activeExams, addTab, getCurrentExam } = useExamStore();
  const navigate = useNavigate();

  // 서버에서 받아온 시험 목록
  const [examList, setExamList] = useState([]);  // Exam[]

  // 드롭다운 선택 상태
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear,     setSelectedYear]     = useState('');
  const [selectedSubject,  setSelectedSubject]  = useState('');
  const [selectedBooklet,  setSelectedBooklet]  = useState('');

  useEffect(() => {
    fetchExamList().then((res) => {
      setExamList(res.data);
      const first = res.data[0];
      if (first) {
        setSelectedCategory(first.category);
        setSelectedYear(first.year);
        setSelectedSubject(first.subjects[0]?.name ?? '');
        setSelectedBooklet(first.subjects[0]?.booklet ?? '');
      }
    });
  }, []);

  // 중복 없는 카테고리 목록
  const categories = [...new Set(examList.map((e) => e.category))];

  // 선택된 카테고리+연도의 시험
  const currentExamEntry = examList.find(
    (e) => e.category === selectedCategory && e.year === Number(selectedYear)
  );

  // 해당 연도에서 중복 없는 과목 목록
  const subjectNames = currentExamEntry
    ? [...new Set(currentExamEntry.subjects.map((s) => s.name))]
    : [];

  // 선택된 과목에서 사용 가능한 책형 목록
  const booklets = currentExamEntry
    ? currentExamEntry.subjects
        .filter((s) => s.name === selectedSubject)
        .map((s) => s.booklet)
    : [];

  // 최종 선택된 subjectId 도출
  const resolvedSubjectId = currentExamEntry?.subjects.find(
    (s) => s.name === selectedSubject && s.booklet === selectedBooklet
  )?.id ?? null;

  const handleAddTab = () => {
    if (!resolvedSubjectId) return alert('시험 정보를 모두 선택해주세요.');
    addTab({
      year: selectedYear,
      subject: selectedSubject,
      booklet: selectedBooklet,
      subjectId: resolvedSubjectId,
    });
  };

  // 연도 변경 시 과목/책형 초기화
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const firstEntry = examList.find((e) => e.category === category);
    setSelectedYear(firstEntry?.year ?? '');
    setSelectedSubject(firstEntry?.subjects[0]?.name ?? '');
    setSelectedBooklet(firstEntry?.subjects[0]?.booklet ?? '');
  };

  // 연도 변경 시 과목/책형 초기화
  const handleYearChange = (year) => {
    setSelectedYear(Number(year));
    const entry = examList.find((e) => e.category === selectedCategory && e.year === Number(year));
    const firstSubject = entry?.subjects[0];
    setSelectedSubject(firstSubject?.name ?? '');
    setSelectedBooklet(firstSubject?.booklet ?? '');
  };

  // 과목 변경 시 책형 초기화
  const handleSubjectChange = (name) => {
    setSelectedSubject(name);
    const firstBooklet = currentExamEntry?.subjects.find((s) => s.name === name)?.booklet ?? '';
    setSelectedBooklet(firstBooklet);
  };

  return (
    <div>
      {/* ── 상단 네비게이션 ── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #ccc' }}>
        <strong>📋 기출채점기</strong>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/mypage')}>마이페이지</button>
          <button onClick={() => navigate('/wrong-notes')}>오답노트</button>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>로그아웃</button>
        </div>
      </nav>

      {/* ── 탭 네비게이션 ── */}
      <MultiTabBoard onAddTab={handleAddTab} />

      {/* ── 시험 선택 드롭다운 ── */}
      <div style={{ padding: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* 시험 종류 */}
        <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* 연도 */}
        <select value={selectedYear} onChange={(e) => handleYearChange(e.target.value)}>
          {examList
            .filter((e) => e.category === selectedCategory)
            .map((e) => (
              <option key={e.id} value={e.year}>{e.year}년</option>
            ))}
        </select>

        {/* 과목 */}
        <select value={selectedSubject} onChange={(e) => handleSubjectChange(e.target.value)}>
          {subjectNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        {/* 책형 — 책형이 1개뿐이면 숨김 */}
        {booklets.length > 1 && (
          <select value={selectedBooklet} onChange={(e) => setSelectedBooklet(e.target.value)}>
            {booklets.map((b) => (
              <option key={b} value={b}>{b}형</option>
            ))}
          </select>
        )}
      </div>

      {/* ── 탭이 하나도 없을 때 안내 문구 ── */}
      {activeExams.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          위에서 시험을 선택하고 <strong>+ 새 시험 추가</strong> 버튼을 눌러주세요.
        </div>
      )}

      {/* ── 탭이 있을 때 채점 보드 표시 ── */}
      {activeExams.length > 0 && (
        <>
          <OmrSheet correctAnswers={null} />

          <div style={{ padding: '12px' }}>
            <ResultSummary passingScore={80} />
          </div>

          <div style={{ padding: '12px' }}>
            <QuestionDetail questions={[]} />
          </div>
        </>
      )}
    </div>
  );
}

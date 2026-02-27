import { useState, useEffect } from 'react';
import { createCustomExam, fetchCustomExams } from '../api/userApi';
import useExamStore from '../store/useExamStore';
import { useNavigate } from 'react-router-dom';

export default function CustomExamPage() {
  const [title,       setTitle]       = useState('');
  const [answerKey,   setAnswerKey]   = useState(Array(40).fill(''));
  const [myExams,     setMyExams]     = useState([]);
  const [submitError, setSubmitError] = useState('');
  const addTab = useExamStore((s) => s.addTab);
  const navigate = useNavigate();

  useEffect(() => {/*  */
    fetchCustomExams().then((res) => setMyExams(res.data));
  }, []);

  const handleAnswerChange = (i, val) => {
    const num = parseInt(val);
    if (val === '' || (num >= 1 && num <= 5)) {
      setAnswerKey((prev) => prev.map((a, idx) => idx === i ? val : a));
    }
  };

  const handleSubmit = async () => {
    // 유효성 검사: 빈 칸 확인
    const emptyCount = answerKey.filter((a) => a === '').length;
    if (!title.trim()) return setSubmitError('시험 이름을 입력해주세요.');
    if (emptyCount > 0) return setSubmitError(`${emptyCount}개 문항의 정답이 비어있습니다.`);

    await createCustomExam({
      title,
      answer_key: answerKey.map(Number),  // ["3","1",...] → [3,1,...]
    });

    alert('등록 완료!');
    const res = await fetchCustomExams();
    setMyExams(res.data);
    setTitle('');
    setAnswerKey(Array(40).fill(''));
    setSubmitError('');
  };

  // 등록된 커스텀 시험을 탭으로 바로 열기
  const handleOpenTab = (exam) => {
    addTab({
      year: '커스텀',
      subject: exam.title,
      booklet: '-',
      customExamId: exam.custom_exam_id,
      answerKey: exam.answer_key,
    });
    navigate('/');
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2>📝 커스텀 시험 등록</h2>

      {/* ── 등록 폼 ── */}
      <div style={{ marginBottom: '24px' }}>
        <input
          placeholder="시험 이름 (예: 2025 모의고사 1회)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', marginBottom: '12px', padding: '8px' }}
        />

        {/* 정답 입력 그리드 (5열) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {answerKey.map((ans, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <label style={{ fontSize: '12px', color: '#6b7280' }}>{i + 1}번</label>
              <input
                type="number" min="1" max="5"
                value={ans}
                onChange={(e) => handleAnswerChange(i, e.target.value)}
                style={{ width: '100%', textAlign: 'center', padding: '4px' }}
              />
            </div>
          ))}
        </div>

        {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
        <button onClick={handleSubmit} style={{ marginTop: '16px' }}>
          ✅ 시험 등록
        </button>
      </div>

      {/* ── 등록된 커스텀 시험 목록 ── */}
      <h3>내가 등록한 시험</h3>
      {myExams.length === 0 && <p>아직 등록된 시험이 없습니다.</p>}
      {myExams.map((exam) => (
        <div key={exam.custom_exam_id} style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '12px', border: '1px solid #e5e7eb',
          borderRadius: '8px', marginBottom: '8px'
        }}>
          <span>{exam.title}</span>
          <button onClick={() => handleOpenTab(exam)}>
            채점하러 가기 →
          </button>
        </div>
      ))}
    </div>
  );
}
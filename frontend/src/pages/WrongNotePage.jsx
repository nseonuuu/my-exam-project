import { useEffect, useState } from 'react';
import { fetchWrongAnswers } from '../api/userApi';
import { updateAnswerMemo } from '../api/examApi';

const SUBJECTS   = ['전체', '언어논리', '자료해석', '상황판단'];
const IMPORTANCE = ['전체', '⭐', '⭐⭐', '⭐⭐⭐'];
const SORT_OPTIONS = [
  { label: '최신순',   value: 'date' },
  { label: '중요도순', value: 'importance' },
  { label: '오답률순', value: 'correct_rate' },
];

export default function WrongNotePage() {
  const [list,       setList]       = useState([]);
  const [filters,    setFilters]    = useState({ subject: '전체', importance: '전체', sort: 'date' });
  const [editId,     setEditId]     = useState(null);   // 현재 메모 편집 중인 answerId
  const [memoInput,  setMemoInput]  = useState('');

  // 필터 변경 시 재조회
  useEffect(() => {
    const params = {};
    if (filters.subject    !== '전체') params.subject    = filters.subject;
    if (filters.importance !== '전체') params.importance = IMPORTANCE.indexOf(filters.importance);
    params.sort = filters.sort;

    fetchWrongAnswers(params).then((res) => setList(res.data));
  }, [filters]);

  const handleSaveMemo = async (answerId) => {
    await updateAnswerMemo(answerId, { memo: memoInput });
    setList((prev) =>
      prev.map((item) =>
        item.answer_id === answerId ? { ...item, memo: memoInput } : item
      )
    );
    setEditId(null);
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2>📓 오답노트</h2>

      {/* ── 필터 바 ── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <FilterSelect label="과목"   options={SUBJECTS}    value={filters.subject}
          onChange={(v) => setFilters((f) => ({ ...f, subject: v }))} />
        <FilterSelect label="중요도" options={IMPORTANCE}  value={filters.importance}
          onChange={(v) => setFilters((f) => ({ ...f, importance: v }))} />
        <FilterSelect label="정렬"
          options={SORT_OPTIONS.map((o) => o.label)}
          value={SORT_OPTIONS.find((o) => o.value === filters.sort)?.label}
          onChange={(v) => setFilters((f) => ({
            ...f, sort: SORT_OPTIONS.find((o) => o.label === v).value
          }))} />
      </div>

      {/* ── 오답 카드 목록 ── */}
      {list.length === 0 && <p>오답 항목이 없습니다. 🎉</p>}
      {list.map((item) => (
        <div key={item.answer_id} style={{
          border: '1px solid #e5e7eb', borderRadius: '8px',
          padding: '16px', marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{item.subject} / {item.year}년 / {item.question_number}번</strong>
            <span style={{ color: '#6b7280', fontSize: '12px' }}>{item.date}</span>
          </div>

          <p>유형: {item.question_type} &nbsp;|&nbsp;
             정답률: {item.global_correct_rate}% &nbsp;|&nbsp;
             중요도: {'⭐'.repeat(item.importance ?? 1)}</p>

          {/* 메모 표시 / 편집 */}
          {editId === item.answer_id ? (
            <div>
              <textarea
                value={memoInput}
                onChange={(e) => setMemoInput(e.target.value)}
                style={{ width: '100%', minHeight: '60px' }}
              />
              <button onClick={() => handleSaveMemo(item.answer_id)}>저장</button>
              <button onClick={() => setEditId(null)}>취소</button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#374151' }}>
                {item.memo ?? '메모 없음'}
              </p>
              <button onClick={() => { setEditId(item.answer_id); setMemoInput(item.memo ?? ''); }}>
                ✏️ 수정
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 공통 필터 셀렉터 컴포넌트
function FilterSelect({ label, options, value, onChange }) {
  return (
    <label>
      {label}:{' '}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
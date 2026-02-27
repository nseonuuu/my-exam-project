import { useState } from 'react';
import { updateAnswerMemo } from '../../api/examApi';
import useExamStore from '../../store/useExamStore';

export default function QuestionDetail({ questions }) {
  const currentExam = useExamStore((s) => s.getCurrentExam());
  const [memos, setMemos] = useState({});

  if (!currentExam?.isGraded) return null;

  // 오답 문항만 필터링
  const wrongList = currentExam.gradeResult
    .map((result, i) => ({ result, index: i }))
    .filter((item) => item.result === false);

  const handleSaveMemo = async (answerId, questionIndex) => {
    await updateAnswerMemo(answerId, memos[questionIndex]);
  };

  return (
    <div>
      <h3>📊 문항별 상세 분석</h3>
      {wrongList.map(({ index }) => {
        const q = questions?.[index];
        return (
          <div key={index} style={{ border: '1px solid #eee', margin: '8px', padding: '12px' }}>
            <h4>▼ {index + 1}번 문항 ❌ 오답</h4>
            <p>문제 유형: {q?.question_type ?? '-'}</p>
            <p>전체 정답률: {q?.global_correct_rate ?? '-'}%</p>

            <label>체감 난이도: </label>
            <select onChange={(e) => setMemos((prev) => ({
              ...prev, [index]: { ...prev[index], difficulty: e.target.value }
            }))}>
              <option>상</option><option>중</option><option>하</option>
            </select>

            <label> 중요도: </label>
            <select onChange={(e) => setMemos((prev) => ({
              ...prev, [index]: { ...prev[index], importance: e.target.value }
            }))}>
              <option>1</option><option>2</option><option>3</option>
            </select>

            <br />
            <textarea
              placeholder="메모를 입력하세요"
              onChange={(e) => setMemos((prev) => ({
                ...prev, [index]: { ...prev[index], memo: e.target.value }
              }))}
            />
            <button onClick={() => handleSaveMemo(q?.answerId, index)}>
              메모 저장
            </button>
          </div>
        );
      })}
    </div>
  );
}
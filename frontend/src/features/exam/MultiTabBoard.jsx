import useExamStore from '../../store/useExamStore';

export default function MultiTabBoard({ onAddTab }) {
  const { activeExams, currentTabId, switchTab, removeTab } = useExamStore();

  return (
    <div style={{ display: 'flex', gap: '8px', padding: '8px' }}>

      {activeExams.map((exam) => (
        <div
          key={exam.tabId}
          onClick={() => switchTab(exam.tabId)}
          style={{
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer',
            background: exam.tabId === currentTabId ? '#4f46e5' : '#fff',
            color: exam.tabId === currentTabId ? '#fff' : '#333',
          }}
        >
          {exam.examInfo.year}년 {exam.examInfo.subject}
          <button
            onClick={(e) => {
              e.stopPropagation();    // 탭 전환 이벤트와 분리
              removeTab(exam.tabId);
            }}
            style={{ marginLeft: '8px', cursor: 'pointer' }}
          >
            ✖
          </button>
        </div>
      ))}

      {/* 새 시험 추가 버튼 */}
      <button onClick={onAddTab}>+ 새 시험 추가</button>
    </div>
  );
}
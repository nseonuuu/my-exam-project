import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '12px 24px', background: '#4f46e5', color: '#fff'
    }}>
      <Link to="/" style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>
        기출채점기
      </Link>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Link to="/mypage"      style={{ color: '#fff' }}>마이페이지</Link>
        <Link to="/wrong-note"  style={{ color: '#fff' }}>오답노트</Link>
        <Link to="/custom-exam" style={{ color: '#fff' }}>커스텀 시험</Link>
        <button onClick={handleLogout} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>
          로그아웃
        </button>
      </div>
    </nav>
  );
}
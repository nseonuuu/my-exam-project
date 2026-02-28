import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function SignupPage() {
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [error,     setError]     = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    // 유효성 검사
    if (!email || !password) return setError('이메일과 비밀번호를 입력해주세요.');
    if (password !== confirm)  return setError('비밀번호가 일치하지 않습니다.');
    if (password.length < 6)   return setError('비밀번호는 6자 이상이어야 합니다.');

    try {
      await api.post('/api/auth/register', { email, password });
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (e) {
      const msg = e.response?.data?.message;
      setError(msg ?? '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '24px' }}>
      <h2>회원가입</h2>

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      <input
        type="password"
        placeholder="비밀번호 (6자 이상)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      <input
        type="password"
        placeholder="비밀번호 확인"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleSignup} style={{ width: '100%', padding: '10px' }}>
        회원가입
      </button>

      <p style={{ textAlign: 'center', marginTop: '16px' }}>
        이미 계정이 있으신가요?{' '}
        <Link to="/login">로그인</Link>
      </p>
    </div>
  );
}
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Login.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/login', { identifier: email, password });
      localStorage.setItem('token', res.data.token);
      onLoginSuccess();
    } catch {
      setError('로그인 실패. 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  const socialButtons = [
    {
      text: 'Sign up with Google',
      img: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
      alt: 'Google',
    },
    {
      text: 'Sign up with Facebook',
      img: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png',
      alt: 'Facebook',
    },
  ];

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">로그인</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button className="login-button">로그인</button>
        </form>

        {error && <p className="login-error">{error}</p>}

        <hr className="login-divider" />

        <div className="social-buttons">
          {socialButtons.map(({ text, img, alt }) => (
            <button key={alt} className="social-button">
              <img src={img} alt={alt} className="social-icon" />
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;

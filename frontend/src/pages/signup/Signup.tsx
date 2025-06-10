import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import '../../styles/Signup.css'; 

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    nickname: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/signup', form); // 백엔드 연결
      alert('회원가입 성공!');
      navigate('/login'); // 로그인 페이지 이동
    } catch (err) {
      console.error(err);
      alert('회원가입 실패');
    }
  };

  const handleSocialLogin = async (providerType: 'google' | 'facebook') => {
    const provider =
      providerType === 'google'
        ? new GoogleAuthProvider()
        : new FacebookAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const res = await axios.post(`http://localhost:3000/${providerType}-login`, {
        token,
      });

      localStorage.setItem('jwt', res.data.token);
      alert(`${providerType} 로그인 성공`);
    } catch (err) {
      console.error(err);
      alert(`${providerType} 로그인 실패`);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-title">회원가입</h2>

        <div className="input-group">
          <label>이름</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>닉네임</label>
          <input name="nickname" value={form.nickname} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>이메일 주소</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>아이디</label>
          <input name="username" value={form.username} onChange={handleChange} />
        </div>

        <div className="input-group full-width">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="signup-button">
          회원가입
        </button>
      </form>

      <div className="social-login">
        <button onClick={() => handleSocialLogin('google')} className="social-button">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" />
          Sign up with Google
        </button>

        <button onClick={() => handleSocialLogin('facebook')} className="social-button">
          <img src="https://www.svgrepo.com/show/475646/facebook-color.svg" alt="facebook" />
          Sign up with Facebook
        </button>
      </div>
    </div>
  );
};

export default Signup;

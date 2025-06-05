// src/controllers/user.controller.js

const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const {
  findByIdentifier,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
  getProfileById,
  updateProfileImage,
} = require('../models/user.model');

const TOKEN_EXPIRE = '7d';

/** 회원가입 */
exports.signup = async (req, res) => {
  const { username, nickname, password, name, email } = req.body;
  console.log('[DEBUG] signup body:', req.body);
  if (!username || !nickname || !password || !name || !email)
    return res.status(400).json({ message: '필수 값 누락' });

  try {
    const dup = await findByIdentifier(username) || await findByIdentifier(email);
    if (dup) return res.status(409).json({ message: '이미 사용 중' });

    const id = await createUser({ username, nickname, password, name, email });
    res.status(201).json({
      message: 'Signup successful',
      user: { id, username, email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

/** 로그인 */
const COOKIE_OPT = {
  httpOnly: true,
  secure   : process.env.NODE_ENV === 'production', // HTTPS 환경에서만
  sameSite : 'lax',
  maxAge   : 7 * 24 * 60 * 60 * 1000               // 7일
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password)
    return res.status(400).json({ message: '필수 값 누락' });

  const user = await findByIdentifier(identifier);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: '잘못된 자격 증명' });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRE }                       // '7d'
  );

  // 토큰을 쿠키에 실어 주고, 본문엔 노출 X
  return res
    .cookie('token', token, COOKIE_OPT)
    .json({ message: 'Login successful' });
};

/** 내 정보 조회 (인증 필요) */
exports.me = async (req, res) => {
  try {
    const profile = await getProfileById(req.user.id);
    if (!profile) return res.status(404).json({ message: '사용자 없음' });
    res.json({ user: profile });        
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

/** 내 정보 수정 */
exports.updateMe = async (req, res) => {
  try {
    // (디버깅용 로그)
    console.log('▶▶▶ updateMe 호출됨, req.file:', req.file);
    console.log('▶▶▶ updateMe 호출됨, req.body:', req.body);

    const userId = req.user.id;

    // 여기서 req.body가 undefined면 빈 객체로 초기화 
    req.body = req.body || {};

    const fields = {};

    // 텍스트 필드 처리 (nickname, is_public)
    if (req.body.nickname !== undefined) {
      fields.nickname = req.body.nickname;
    }

    if (req.body.is_public !== undefined) {
      const val = req.body.is_public;
      fields.is_public =
        val === 'true' || val === '1' || val === 1 || val === true;
    }

    // 프로필 이미지 업로드 처리
    if (req.file) {
      const filename = req.file.filename;
      const imageUrl = `/uploads/${filename}`;
      await updateProfileImage(userId, imageUrl);
    }

    // 텍스트 필드가 있다면 updateUser 호출
    if (Object.keys(fields).length > 0) {
      await updateUser(userId, fields);
    }

    // 최종 변경된 프로필 조회
    const updatedProfile = await getProfileById(userId);
    return res.status(200).json({
      message: '회원 정보가 업데이트되었습니다.',
      profile: updatedProfile
    });
  } catch (err) {
    console.error('▶▶▶ updateMe 오류:', err);
    return res.status(500).json({ message: '서버 오류' });
  }
};

/** 비밀번호 변경 */
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return res.status(400).json({ message: '필수 값 누락' });

  const me = await findByIdentifier(req.user.username);
  if (!(await bcrypt.compare(oldPassword, me.password)))
    return res.status(401).json({ message: '현재 비밀번호 불일치' });

  await changePassword(req.user.id, newPassword);
  res.json({ message: '비밀번호 변경 완료' });
};

/** 회원 탈퇴 */
exports.deleteMe = async (_req, res) => {
  await deleteUser(_req.user.id);
  res.json({ message: '회원 탈퇴 완료' });
}; //이후 일정 및 친구 추가 되면 수정할 예정

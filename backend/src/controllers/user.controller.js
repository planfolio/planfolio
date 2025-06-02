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
  const { nickname, profile_image, is_public } = req.body;

  const payload = {};
  if (nickname       !== undefined) payload.nickname       = nickname;
  if (profile_image  !== undefined) payload.profile_image  = profile_image;
  if (is_public      !== undefined) payload.is_public      = !!is_public; // true/false → 1/0

  if (!Object.keys(payload).length) {
    return res.status(400).json({ message: '수정할 필드가 없습니다.' });
  }

  try {
    await updateUser(req.user.id, payload);

    //최신 프로필 다시 조회
    const user = await getProfileById(req.user.id);

    return res.status(200).json({ message: '수정 완료' });
  } catch (err) {
    console.error(err);
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

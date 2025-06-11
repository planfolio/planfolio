// src/models/user.model.js
const getConnection = require("../db");
const bcrypt = require("bcryptjs");

/** username 또는 email 로 단일 사용자 조회 */
async function findByIdentifier(identifier) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
    [identifier, identifier]
  );
  await conn.end();
  return rows[0] || null;
}

/** 프로필 조회 */
async function getProfileById(id) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    "SELECT username, nickname, name, email, profile_image, is_public FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  await conn.end();
  return rows[0] || null;
}

/** 회원 생성 */
async function createUser({ username, nickname, password, name, email }) {
  const conn = await getConnection();
  const hashed = await bcrypt.hash(password, 12);
  const [result] = await conn.query(
    "INSERT INTO users (username, nickname, password, name, email) VALUES (?,?,?,?,?)",
    [username, nickname, hashed, name, email]
  );
  await conn.end();
  return result.insertId;
}

/** 회원 정보 일부 수정 (닉네임·프로필 이미지·공개 여부만) */
async function updateUser(id, fields) {
  //허용 컬럼
  const columns = ["nickname", "profile_image", "is_public"];

  //(true → 1, false → 0)
  if (fields.is_public !== undefined) {
    fields.is_public = +!!fields.is_public;
  }
  const keys = Object.keys(fields).filter((k) => columns.includes(k));
  if (!keys.length) return;

  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => fields[k]).concat(id);

  //DB 업데이트
  const conn = await getConnection();
  await conn.query(`UPDATE users SET ${sets} WHERE id = ?`, values);
  await conn.end();
}

/** 프로필 이미지 경로 업데이트 (추가) */
async function updateProfileImage(userId, imagePath) {
  const conn = await getConnection();
  await conn.query("UPDATE users SET profile_image = ? WHERE id = ?", [
    imagePath,
    userId,
  ]);
  await conn.end();
  return true;
}

/** 비밀번호 변경 */
async function changePassword(id, newPassword) {
  const hashed = await bcrypt.hash(newPassword, 12);
  const conn = await getConnection();
  await conn.query("UPDATE users SET password = ? WHERE id = ?", [hashed, id]);
  await conn.end();
}

/** 회원 탈퇴 */
async function deleteUserCascade(userId) {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();

    // 친구 관계 삭제 (양쪽)
    await conn.query("DELETE FROM friends WHERE user_id = ? OR friend_id = ?", [
      userId,
      userId,
    ]);

    // 일정 삭제
    await conn.query("DELETE FROM calc WHERE user_id = ?", [userId]);

    // 즐겨찾기 삭제
    await conn.query("DELETE FROM bookmarks WHERE user_id = ?", [userId]);

    // 최종 사용자 삭제
    await conn.query("DELETE FROM users WHERE id = ?", [userId]);

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.end();
  }
}

module.exports = {
  findByIdentifier,
  createUser,
  updateUser,
  changePassword,
  deleteUserCascade,
  getProfileById,
  updateProfileImage,
};

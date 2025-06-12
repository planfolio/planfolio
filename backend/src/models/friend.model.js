const getConnection = require("../db");

/** 친구 요청 보내기 */
async function addFriendRequest(userId, friendId) {
  const conn = await getConnection();
  const [result] = await conn.query(
    'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, "pending")',
    [userId, friendId]
  );
  await conn.end();
  return result.insertId;
}

/** 친구 요청 조회 (상세 정보 포함) */
async function getFriendRequestById(id) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    "SELECT * FROM friends WHERE id = ? LIMIT 1",
    [id]
  );
  await conn.end();
  return rows[0] || null;
}

/** 받은 친구 요청 목록 조회 */
async function getReceivedFriendRequests(userId) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    `SELECT f.id, f.user_id, f.friend_id, f.status, f.created_at,
            u.username, u.nickname, u.profile_image
     FROM friends f
     JOIN users u ON f.user_id = u.id
     WHERE f.friend_id = ? AND f.status = "pending"
     ORDER BY f.created_at DESC`,
    [userId]
  );
  await conn.end();
  return rows;
}

/** 친구 관계 조회 (양방향) */
async function findFriendship(userId, friendId) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    `SELECT * FROM friends
     WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
     LIMIT 1`,
    [userId, friendId, friendId, userId]
  );
  await conn.end();
  return rows[0] || null;
}

/** 친구 요청 수락 */
async function acceptFriendRequest(userId, friendId) {
  const conn = await getConnection();
  await conn.query(
    'UPDATE friends SET status = "accepted" WHERE user_id = ? AND friend_id = ?',
    [friendId, userId]
  );
  await conn.end();
}

/** 친구 요청 거절 */
async function rejectFriendRequest(userId, friendId) {
  const conn = await getConnection();
  await conn.query(
    'UPDATE friends SET status = "rejected" WHERE user_id = ? AND friend_id = ?',
    [friendId, userId]
  );
  await conn.end();
}

/** 친구 목록 조회 */
async function getFriends(userId) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    `SELECT DISTINCT u.id, u.username, u.nickname, u.profile_image, u.is_public,
            f.created_at as since
     FROM friends f
     JOIN users u ON (
       CASE
         WHEN f.user_id = ? THEN u.id = f.friend_id
         WHEN f.friend_id = ? THEN u.id = f.user_id
       END
     )
     WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = "accepted"
     ORDER BY f.created_at DESC`,
    [userId, userId, userId, userId]
  );
  await conn.end();
  return rows;
}

/** 친구 삭제 */
async function deleteFriend(userId, friendId) {
  const conn = await getConnection();
  await conn.query(
    "DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
    [userId, friendId, friendId, userId]
  );
  await conn.end();
}

/** username으로 사용자 ID 조회 */
async function getUserIdByUsername(username) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    "SELECT id FROM users WHERE username = ? LIMIT 1",
    [username]
  );
  await conn.end();
  return rows[0]?.id || null;
}

/** 친구 username으로 친구 정보 조회 (양방향) */
async function getFriendByUsername(userId, friendUsername) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    `
    SELECT u.id, u.username, u.nickname, u.profile_image
      FROM friends f
      JOIN users u ON 
        (u.id = f.friend_id AND f.user_id = ? AND u.username = ?)
        OR
        (u.id = f.user_id AND f.friend_id = ? AND u.username = ?)
     WHERE f.status = 'accepted'
     LIMIT 1
    `,
    [userId, friendUsername, userId, friendUsername]
  );
  await conn.end();
  return rows[0] || null;
}

module.exports = {
  addFriendRequest,
  getFriendRequestById,
  getReceivedFriendRequests,
  findFriendship,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  deleteFriend,
  getUserIdByUsername,
  getFriendByUsername,
};

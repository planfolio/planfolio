const getConnection = require("../db");

// 날짜 ↔ 문자열 변환 유틸
const formatDate = (d) => new Date(d).toISOString().slice(0, 10);

/* 내부: 날짜 범위 WHERE 절 생성 */
function buildDateFilter(start, end) {
  const clauses = [];
  const params = [];

  if (start) {
    clauses.push("c.start_date >= ?");
    params.push(start);
  }
  if (end) {
    clauses.push("c.end_date   <= ?");
    params.push(end);
  }

  return {
    where: clauses.length ? "AND " + clauses.join(" AND ") : "",
    params,
  };
}

/* 목록 조회 */
async function getSchedulesByUser(userId, source) {
  const conn = await getConnection();
  let sql = `
    SELECT id, title, description, source, start_date, end_date
    FROM calc
    WHERE user_id = ?`;
  const params = [userId];

  if (["manual", "contest"].includes(source)) {
    sql += " AND source = ?";
    params.push(source);
  }

  const [rows] = await conn.query(sql, params);
  await conn.end();
  return rows.map((r) => ({
    ...r,
    start_date: formatDate(r.start_date),
    end_date: formatDate(r.end_date),
  }));
}

/* 단일 일정 조회 (수정/삭제용) */
async function getScheduleById(id, userId) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    "SELECT * FROM calc WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId]
  );
  await conn.end();
  return rows[0] || null;
}

/* 일정 생성 */
async function createSchedule(userId, payload) {
  const conn = await getConnection();
  const [rs] = await conn.query(
    `INSERT INTO calc (user_id, title, description, source, start_date, end_date)
     VALUES (?,?,?,?,?,?)`,
    [
      userId,
      payload.title,
      payload.description || null,
      payload.source || "manual",
      payload.start_date,
      payload.end_date,
    ]
  );
  await conn.end();
  return rs.insertId; // 새로 생성된 PK 반환
}

/* 일정 수정 */
async function updateSchedule(id, userId, fields) {
  const columns = ["title", "description", "source", "start_date", "end_date"];
  const keys = Object.keys(fields).filter((k) => columns.includes(k));
  if (!keys.length) return false;

  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const vals = keys.map((k) => fields[k]).concat(id, userId);

  const conn = await getConnection();
  const [rs] = await conn.query(
    `UPDATE calc SET ${sets} WHERE id = ? AND user_id = ?`,
    vals
  );
  await conn.end();
  return rs.affectedRows > 0;
}

/* 일정 삭제 */
async function deleteSchedule(id, userId) {
  const conn = await getConnection();
  const [rs] = await conn.query(
    "DELETE FROM calc WHERE id = ? AND user_id = ?",
    [id, userId]
  );
  await conn.end();
  return rs.affectedRows > 0;
}

/* 친구 일정 조회 (모든 일정 반환) */
const getFriendSchedules = async (viewerId, friendUsername, start, end) => {
  const conn = await getConnection();

  // 1) 친구 관계 확인 (양방향)
  const [rel] = await conn.query(
    `SELECT 1
       FROM friends f
       JOIN users u 
         ON (u.id = f.friend_id AND f.user_id = ?) 
         OR (u.id = f.user_id AND f.friend_id = ?)
      WHERE u.username = ? AND f.status = 'accepted'
      LIMIT 1`,
    [viewerId, viewerId, friendUsername],
  );

  if (rel.length === 0) {
    await conn.end();
    return null;
  }

  // 2) 일정 조회
  const { where, params } = buildDateFilter(start, end);
  const [rows] = await conn.query(
    `SELECT c.id, c.title, c.description, c.source,
            c.start_date, c.end_date
       FROM calc c
       JOIN users u ON u.id = c.user_id
      WHERE u.username = ?
            ${where}
      ORDER BY c.start_date`,
    [friendUsername, ...params],
  );

  await conn.end();

  return rows.map(r => ({
    ...r,
    start_date: formatDate(r.start_date),
    end_date:   formatDate(r.end_date),
  }));
};

/* 공개 계정 일정 조회 (비공개 계정이면 null) */
async function getPublicSchedules(username, start, end) {
  const conn = await getConnection();

  // 사용자 존재 & 계정 공개 여부 확인
  const [[user]] = await conn.query(
    "SELECT id, is_public FROM users WHERE username = ?",
    [username]
  );
  if (!user || !user.is_public) {
    await conn.end();
    return null;
  }

  // 일정 조회
  const { where, params } = buildDateFilter(start, end);
  const [rows] = await conn.query(
    `SELECT id, title, description, source,
            start_date, end_date
       FROM calc
      WHERE user_id = ?
            ${where}
      ORDER BY start_date`,
    [user.id, ...params]
  );
  await conn.end();

  return rows.map((r) => ({
    ...r,
    start_date: formatDate(r.start_date),
    end_date: formatDate(r.end_date),
  }));
}

module.exports = {
  getSchedulesByUser,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getFriendSchedules,
  getPublicSchedules,
};

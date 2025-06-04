const getConnection = require('../db');

// 날짜 ↔ 문자열 변환 유틸
const formatDate = d => new Date(d).toISOString().slice(0, 10);

/* 목록 조회 */
async function getSchedulesByUser(userId, source) {
  const conn = await getConnection();
  let sql = `
    SELECT id, title, description, source, start_date, end_date
    FROM calc
    WHERE user_id = ?`;
  const params = [userId];

  if (['manual', 'contest'].includes(source)) {
    sql += ' AND source = ?';
    params.push(source);
  }

  const [rows] = await conn.query(sql, params);
  await conn.end();
  return rows.map(r => ({
    // id는 컨트롤러에서 제거
    ...r,
    start_date: formatDate(r.start_date),
    end_date:   formatDate(r.end_date),
  }));
}

/* 단일 일정 조회 (수정/삭제용) */
async function getScheduleById(id, userId) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    'SELECT * FROM calc WHERE id = ? AND user_id = ? LIMIT 1',
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
      payload.source || 'manual',
      payload.start_date,
      payload.end_date,
    ]
  );
  await conn.end();
  return rs.insertId; // 새로 생성된 PK 반환
}

/* 일정 수정 */
async function updateSchedule(id, userId, fields) {
  const columns = ['title', 'description', 'source', 'start_date', 'end_date'];
  const keys = Object.keys(fields).filter(k => columns.includes(k));
  if (!keys.length) return false;

  const sets = keys.map(k => `${k} = ?`).join(', ');
  const vals = keys.map(k => fields[k]).concat(id, userId);

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
    'DELETE FROM calc WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  await conn.end();
  return rs.affectedRows > 0;
}

module.exports = {
  getSchedulesByUser,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};

const getConnection = require('../db');

// 공모전 존재 확인
async function getContestById(contestId) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    `SELECT id, title, description, start_date, end_date
       FROM contests
      WHERE id = ?`,
    [contestId]
  );
  await conn.end();
  return rows[0] || null;
}

// 북마크 추가 + 일정 복사
exports.add = async (userId, contestId) => {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();

    // 1) contests 테이블에 해당 ID가 있는지 확인
    const contest = await getContestById(contestId);
    if (!contest) throw { code: 404, msg: '해당 공모전 ID가 존재하지 않습니다.' };

    // 2) 이미 북마크한 기록이 있는지 확인
    const [[dup]] = await conn.query(
      'SELECT id FROM bookmarks WHERE user_id = ? AND contest_id = ?',
      [userId, contestId]
    );
    if (dup) throw { code: 409, msg: '이미 북마크한 공모전입니다.' };

    // 3) calc 테이블에 일정 복사
    const [rs] = await conn.query(
      `INSERT INTO calc (user_id, title, description, source, start_date, end_date)
         VALUES (?, ?, ?, 'contest', ?, ?)`,
      [userId, contest.title, contest.description, contest.start_date, contest.end_date]
    );
    const scheduleId = rs.insertId;

    // 4) bookmarks 테이블에 user_id, contest_id, schedule_id 기록
    await conn.query(
      `INSERT INTO bookmarks (user_id, contest_id, schedule_id)
         VALUES (?, ?, ?)`,
      [userId, contestId, scheduleId]
    );

    await conn.commit();
    return { 
      title: contest.title,
      description: contest.description,
      source: 'contest',
      start_date: contest.start_date,
      end_date: contest.end_date
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.end();
  }
};

// 북마크 삭제 + calc 복사본 삭제
exports.remove = async (userId, bookmarkId) => {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();

    // 1) bookmarks 테이블에서 schedule_id 조회
    const [[bm]] = await conn.query(
      `SELECT schedule_id 
         FROM bookmarks 
        WHERE id = ? AND user_id = ?`,
      [bookmarkId, userId]
    );
    if (!bm) throw { code: 404, msg: '해당 북마크 ID가 존재하지 않습니다.' };

    // 2) calc 테이블의 해당 일정 삭제
    await conn.query(
      'DELETE FROM calc WHERE id = ? AND user_id = ?',
      [bm.schedule_id, userId]
    );

    // 3) bookmarks 레코드 삭제
    await conn.query(
      'DELETE FROM bookmarks WHERE id = ?',
      [bookmarkId]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.end();
  }
};
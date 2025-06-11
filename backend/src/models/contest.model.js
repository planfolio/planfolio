const getConnection = require('../db');

/* 내부: 공통 SELECT */
async function fetchContestsByType(type) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    `SELECT id, type, title, description, tags,
            start_date, end_date
       FROM contests
      WHERE type = ?
      ORDER BY start_date`,
    [type],
  );
  await conn.end();
  return rows;
}

module.exports = {
  fetchContestsByType,
};

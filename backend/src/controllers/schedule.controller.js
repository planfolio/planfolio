const {
  getSchedulesByUser,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getFriendSchedules,
  getPublicSchedules,
} = require("../models/schedule.model");

/* 내 일정 목록 */
exports.getMySchedules = async (req, res) => {
  const source = req.query.source;
  try {
    const rows = await getSchedulesByUser(req.user.id, source);
    const events = rows.map(({ ...rest }) => rest);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "일정 조회 실패" });
  }
};

/* 일정 생성 */
exports.createSchedule = async (req, res) => {
  const { title, description, source, start_date, end_date } = req.body;
  if (!title || !start_date || !end_date)
    return res.status(400).json({ message: "필수 값 누락" });

  try {
    const id = await createSchedule(req.user.id, {
      title,
      description,
      source,
      start_date,
      end_date,
    });
    const event = await getScheduleById(id, req.user.id);
    const { user_id, created_at, ...publicEvent } = event;
    res.status(201).json({ message: "일정 생성", event: publicEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "일정 생성 실패" });
  }
};

/* 일정 수정 */
exports.updateSchedule = async (req, res) => {
  const { id } = req.params;
  const changed = await updateSchedule(id, req.user.id, req.body);
  if (!changed) return res.status(404).json({ message: "일정 없음" });

  const event = await getScheduleById(id, req.user.id);
  const { user_id, created_at, ...publicEvent } = event;
  res.json({ message: "수정 완료", event: publicEvent });
};

/* 일정 삭제 */
exports.deleteSchedule = async (req, res) => {
  const { id } = req.params;
  const ok = await deleteSchedule(id, req.user.id);
  if (!ok) return res.status(404).json({ message: "일정 없음" });
  res.json({ message: "삭제 완료" });
};

/* 친구 일정 목록 (친구 관계 확인 후 전체 일정 반환) */
exports.getFriendSchedules = async (req, res) => {
  const { username } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const rows = await getFriendSchedules(
      req.user.id, // 로그인 사용자
      username, // 친구 아이디
      startDate,
      endDate
    );

    if (rows === null)
      return res.status(403).json({ message: "친구가 아닙니다" });

    if (Array.isArray(rows) && rows.length === 0)
      return res.status(404).json({ message: "일정이 없습니다" });

    res.json({ schedules: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "일정 조회 실패" });
  }
};

/* 공개 계정 일정 목록 (친구 여부 무관) */
exports.getUserPublicSchedules = async (req, res) => {
  const { username } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const rows = await getPublicSchedules(username, startDate, endDate);

    if (rows === null)
      return res.status(404).json({ message: "사용자 없음 또는 비공개 계정" });

    const events = rows.map(({ id, ...rest }) => rest);
    res.json({ schedules: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "일정 조회 실패" });
  }
};

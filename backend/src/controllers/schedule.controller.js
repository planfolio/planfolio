const {
  getSchedulesByUser,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require('../models/schedule.model');

/* 내 일정 목록 */
exports.getMySchedules = async (req, res) => {
  const source = req.query.source;
  try {
    const rows = await getSchedulesByUser(req.user.id, source);
    // id 숨기기
    const events = rows.map(({ id, ...rest }) => rest);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '일정 조회 실패' });
  }
};

/* 일정 생성 */
exports.createSchedule = async (req, res) => {
  const { title, description, source, start_date, end_date } = req.body;
  if (!title || !start_date || !end_date)
    return res.status(400).json({ message: '필수 값 누락' });

  try {
    const id = await createSchedule(req.user.id, {
      title, description, source, start_date, end_date,
    });
    const event = await getScheduleById(id, req.user.id);
    const { id: _ignored, user_id, created_at, ...publicEvent } = event;
    res.status(201).json({ message: '일정 생성', event: publicEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '일정 생성 실패' });
  }
};

/* 일정 수정 */
exports.updateSchedule = async (req, res) => {
  const { id } = req.params;
  const changed = await updateSchedule(id, req.user.id, req.body);
  if (!changed) return res.status(404).json({ message: '일정 없음' });

  const event = await getScheduleById(id, req.user.id);
  const { id: _ignored, user_id, created_at, ...publicEvent } = event;
  res.json({ message: '수정 완료', event: publicEvent });
};

/* 일정 삭제 */
exports.deleteSchedule = async (req, res) => {
  const { id } = req.params;
  const ok = await deleteSchedule(id, req.user.id);
  if (!ok) return res.status(404).json({ message: '일정 없음' });
  res.json({ message: '삭제 완료' });
};

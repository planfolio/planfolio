const Bookmark = require('../models/bookmark.model');

exports.addBookmark = async (req, res) => {
  const { contest_id } = req.body;
  if (!contest_id) return res.status(400).json({ message: 'contest_id는 필수입니다.' });

  try {
    const event = await Bookmark.add(req.user.id, contest_id);
    return res.status(201).json({ message: '북마크 설정 완료', event });
  } catch (err) {
    return res.status(err.code || 500).json({ message: err.msg || '서버 오류' });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    await Bookmark.remove(req.user.id, req.params.id);
    return res.status(200).json({ message: '북마크가 해제되었습니다' });
  } catch (err) {
    return res.status(err.code || 500).json({ message: err.msg || '서버 오류' });
  }
};

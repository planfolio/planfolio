const { fetchContestsByType } = require('../models/contest.model');

/* 공모전 목록 (type = contest) */
exports.getContestList = async (_req, res) => {
  try {
    const rows = await fetchContestsByType('contest');
    const contests = rows.map(({ id, ...rest }) => rest); // id 제외
    res.json(contests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '공모전 조회 실패' });
  }
};

/* 코딩테스트 목록 (type = coding_test) */
exports.getCodingTestList = async (_req, res) => {
  try {
    const rows = await fetchContestsByType('coding_test');
    const coding_tests = rows.map(({ id, ...rest }) => rest); // id 제외
    res.json(coding_tests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '코딩테스트 조회 실패' });
  }
};

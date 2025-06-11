const router = require('express').Router();
const ctrl   = require('../controllers/contest.controller');


router.get('/contests', ctrl.getContestList);
router.get('/coding-tests', ctrl.getCodingTestList);
router.get('/qualifications', ctrl.getQualificationList);

module.exports = router;

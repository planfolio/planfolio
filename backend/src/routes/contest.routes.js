const router = require('express').Router();
const ctrl   = require('../controllers/contest.controller');


router.get('/contests', ctrl.getContestList);
router.get('/coding-tests', ctrl.getCodingTestList);

module.exports = router;

const router  = require('express').Router();
const auth    = require('../middlewares/auth');
const ctrl    = require('../controllers/schedule.controller');

router.get('/calendar',           auth, ctrl.getMySchedules);
router.post('/calendar',          auth, ctrl.createSchedule);
router.patch('/calendar/:id',     auth, ctrl.updateSchedule);
router.delete('/calendar/:id',    auth, ctrl.deleteSchedule);
router.get('/friends/:username/schedules', auth, ctrl.getFriendSchedules);
router.get('/users/:username/schedules',   auth, ctrl.getUserPublicSchedules);

module.exports = router;

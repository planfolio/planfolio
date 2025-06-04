const router  = require('express').Router();
const auth    = require('../middlewares/auth');
const ctrl    = require('../controllers/schedule.controller');

router.get('/calendar',           auth, ctrl.getMySchedules);
router.post('/calendar',          auth, ctrl.createSchedule);
router.patch('/calendar/:id',     auth, ctrl.updateSchedule);
router.delete('/calendar/:id',    auth, ctrl.deleteSchedule);

module.exports = router;

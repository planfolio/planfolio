const router = require('express').Router();
const auth   = require('../middlewares/auth');
const ctrl   = require('../controllers/bookmark.controller');

router.post   ('/bookmarks',     auth, ctrl.addBookmark);
router.delete ('/bookmarks/:id', auth, ctrl.deleteBookmark);

module.exports = router;

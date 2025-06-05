const router = require("express").Router();
const ctrl = require("../controllers/friend.controller");
const auth = require("../middlewares/auth");

router.post("/friends", auth, ctrl.addFriend);
router.get("/friends/received", auth, ctrl.receivedFriends);
router.post("friends/:username", auth, ctrl.acceptFriend);
router.get("/friends", auth, ctrl.getFriends);
router.delete("/friends/:username", auth, ctrl.deleteFriend);

module.exports = router;

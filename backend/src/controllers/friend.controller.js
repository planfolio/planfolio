const {
  addFriendRequest,
  getFriendRequestById,
  getReceivedFriendRequests,
  findFriendship,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  deleteFriend,
  getUserIdByUsername,
  getFriendByUsername,
} = require("../models/friend.model");

/** 친구 요청 보내기 */
exports.addFriend = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.id;

    if (!username) {
      return res.status(400).json({ message: "username이 없습니다." });
    }

    // 요청받을 사용자 ID 조회
    const friendId = await getUserIdByUsername(username);
    if (!friendId) {
      return res.status(404).json({ message: "존재하지 않는 사용자" });
    }

    // 자기 자신에게 친구 요청 불가
    if (userId === friendId) {
      return res
        .status(400)
        .json({ message: "자기 자신에게 친구 요청을 보낼 수 없습니다" });
    }

    // 이미 친구 관계가 있는지 확인
    const existingFriendship = await findFriendship(userId, friendId);
    if (existingFriendship) {
      if (existingFriendship.status === "pending") {
        return res
          .status(409)
          .json({ message: "이미 친구 상태이거나 요청 중인 상태" });
      }
      if (existingFriendship.status === "accepted") {
        return res
          .status(409)
          .json({ message: "이미 친구 상태이거나 요청 중인 상태" });
      }
    }

    // 친구 요청 생성
    const requestId = await addFriendRequest(userId, friendId);
    const friendRequest = await getFriendRequestById(requestId);

    res.status(201).json({
      message: "Friend request sent successfully",
      request: {
        id: friendRequest.id,
        user_id: friendRequest.user_id,
        friend_id: friendRequest.friend_id,
        status: friendRequest.status,
        created_at: friendRequest.created_at,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "친구 요청 실패" });
  }
};

/** 받은 친구 요청 목록 조회 */
exports.receivedFriends = async (req, res) => {
  try {
    // 인증 토큰 검증
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "인증 실패" });
    }

    const userId = req.user.id;
    const rawRequests = await getReceivedFriendRequests(userId);

    // 응답 구조 변경: user 객체로 중첩
    const requests = rawRequests.map((request) => ({
      id: request.id,
      user: {
        id: request.user_id,
        username: request.username,
        nickname: request.nickname,
        profile_image: request.profile_image,
      },
      status: request.status,
      created_at: request.created_at,
    }));

    res.json({ requests });
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "친구 요청 목록 조회 실패" });
  }
};

/** 친구 요청 수락/거절 */
exports.acceptFriend = async (req, res) => {
  try {
    const { username } = req.params;
    const { action } = req.body;
    const userId = req.user.id;

    if (!action || !["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "잘못된 action 값" });
    }

    // 요청자 사용자 ID 조회
    const friendId = await getUserIdByUsername(username);
    if (!friendId) {
      return res.status(404).json({ message: "해당 요청이 존재하지 않음" });
    }

    // 친구 요청이 존재하는지 확인
    const friendship = await findFriendship(friendId, userId);
    if (
      !friendship ||
      friendship.status !== "pending" ||
      friendship.friend_id !== userId
    ) {
      return res.status(404).json({ message: "해당 요청이 존재하지 않음" });
    }

    if (action === "accept") {
      await acceptFriendRequest(userId, friendId);
      res.status(200).json({ message: "Friend request accepted" });
    } else {
      await rejectFriendRequest(userId, friendId);
      res.status(200).json({ message: "Friend request rejected" });
    }
  } catch (err) {
    console.error(err);
    if (err.message === "인증 실패") {
      return res.status(401).json({ message: "인증 실패" });
    }
    if (err.message === "본인이 받은 요청이 아닌 경우") {
      return res.status(403).json({ message: "본인이 받은 요청이 아닌 경우" });
    }
    res.status(500).json({ message: "친구 요청 처리 실패" });
  }
};

/** 친구 목록 조회 */
exports.getFriends = async (req, res) => {
  try {
    // 인증 토큰 검증
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "인증 실패" });
    }

    const userId = req.user.id;
    const friends = await getFriends(userId);

    res.json({ friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "친구 목록 조회 실패" });
  }
};

/** 친구 삭제 */
exports.deleteFriend = async (req, res) => {
  try {
    // 인증 토큰 검증
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "인증 실패" });
    }

    const { username } = req.params;
    const userId = req.user.id;

    // 삭제할 친구의 사용자 ID 조회
    const friendId = await getUserIdByUsername(username);
    if (!friendId) {
      return res.status(404).json({ message: "친구 관계가 존재하지 않음" });
    }

    // 친구 관계가 존재하는지 확인
    const friendship = await findFriendship(userId, friendId);
    if (!friendship || friendship.status !== "accepted") {
      return res.status(404).json({ message: "친구 관계가 존재하지 않음" });
    }

    await deleteFriend(userId, friendId);
    res.json({ message: "Friend removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "친구 삭제 실패" });
  }
};

/** 친구 정보 조회 */
exports.getFriendByUsername = async (req, res) => {
  const myId = req.user.id;
  const { username } = req.params;

  try {
    const friend = await getFriendByUsername(myId, username);

    if (!friend) {
      return res.status(404).json({ message: '친구가 아니거나 존재하지 않는 사용자입니다.' });
    }

    res.json(friend);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '친구 정보 조회 중 오류가 발생했습니다.' });
  }
};

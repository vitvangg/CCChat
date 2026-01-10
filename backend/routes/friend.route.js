import { Router } from "express";
import { sendFriendRequest, acceptFriendRequest, declineFriendRequest, getAllFriends, getAllRequests } from "../controllers/friend.controller.js";

const router = Router();

router.post("/request", sendFriendRequest);
router.post("/request/:request_id/accept", acceptFriendRequest);
router.post("/request/:request_id/decline", declineFriendRequest);
router.get("/list", getAllFriends);
router.get("/requests", getAllRequests);

export default router;

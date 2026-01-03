import express from 'express'
import { getUserProfile, test } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile', getUserProfile);

router.get("/test", test)

export default router;
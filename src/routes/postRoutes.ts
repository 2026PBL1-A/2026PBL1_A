import express from 'express';
import { createPostHandler } from '../controllers/postControllers';

const router = express.Router();

router.post('/', createPostHandler);

export default router;
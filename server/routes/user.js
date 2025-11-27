import { Router } from 'express';
import { userSignUp, userLogin, getUser } from '../controller/user.js';

const router = Router();

router.post('/signUp', userSignUp);
router.post('/login', userLogin);
router.get('/user/:id', getUser);

export default router;

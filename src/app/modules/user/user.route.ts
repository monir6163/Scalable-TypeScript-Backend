import express from 'express';
import { auth } from '../../middleware/auth';
import { UserControler } from './user.controler';

const router = express.Router();
router.get('/current-user', auth(), UserControler.getCurrentUser);
router.get('/:id', auth('user'), UserControler.getSingleUser);
router.get('/', auth('admin'), UserControler.getAllUsers);

export const UserRoutes = router;

import express from 'express';
import passport from 'passport';
const router = express.Router();
import { viewTicket } from '../controllers/ticket.controller.js';


router.get('/:tid', passport.authenticate('jwt', { session: false }), viewTicket);

export default router;	
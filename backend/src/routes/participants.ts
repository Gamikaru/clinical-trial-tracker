//backend/src/routes/participants.ts
import { Router } from 'express';
import * as participantController from '../controllers/participantController';

const router = Router();

// Define participant-related routes
router.get('/', participantController.listParticipants);
router.get('/:id', participantController.getParticipant);
router.post('/', participantController.createParticipant);
router.put('/:id', participantController.updateParticipant);
router.delete('/:id', participantController.deleteParticipant);

export default router;

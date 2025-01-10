//backend/src/routes/trials.ts
import { Router } from 'express';
import * as trialController from '../controllers/trialController';

const router = Router();

// Define trial-related routes
router.get('/', trialController.listTrials);
router.get('/:id', trialController.getTrial);
router.post('/', trialController.createTrial);
router.put('/:id', trialController.updateTrial);
router.delete('/:id', trialController.deleteTrial);

export default router;

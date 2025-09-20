import { Router } from 'express';
import {PredictionController} from '../../controllers/v1/prediction.controller'

const router: Router = Router();

router.post('/predict', PredictionController.publicPrediction);

export default router;

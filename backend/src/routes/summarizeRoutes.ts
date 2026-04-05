import express from 'express'
import * as summarizeController from '../controller/summarizeController.ts'

const router = express.Router();

router.post('/', summarizeController.summarize);

export default router;
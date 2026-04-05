import express from 'express';
import cors from 'cors'

import { ENV } from './config/ENV.ts';
import summarizeRoutes from './routes/summarizeRoutes.ts'

const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/summarize', summarizeRoutes);

app.listen( ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`)
});
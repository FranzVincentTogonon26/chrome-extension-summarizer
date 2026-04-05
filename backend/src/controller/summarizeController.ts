import { Request, Response, NextFunction } from 'express';
import { streamText } from "ai";
import { openRouter, SUMMARIZE_MODEL } from '../services/ai-service.js';

export const summarize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Missing text field' });
        }

        const result = streamText({
                model: openRouter(SUMMARIZE_MODEL),
                system: `You are a concise article summarizer. 
                         Given an article's text, write a clear and accurate summary in 3–5 sentences.
                         Focus on the key points and main argument. Do not add opinions. 
                         Respond only with the summary — no preamble, no labels.`,
                messages: [{ role: "user", content: text }],
                maxOutputTokens: 300,
            });
        
        const summary = await result.text;

        res.json({ summary });

    } catch (error) {
        next(error);
    }
}
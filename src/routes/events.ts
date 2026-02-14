import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { publishEvent } from '../kafka/producer';
import { memoryStore } from '../store/memoryStore';
import { UserEvent, UserEventPayload } from '../types';

const router = Router();

router.post('/generate', async (req, res) => {
    try {
        const { userId, eventType, payload }: UserEventPayload = req.body;

        if (!userId || !eventType) {
            return res.status(400).json({ error: 'userId and eventType are required' });
        }

        const event: UserEvent = {
            eventId: uuidv4(),
            userId,
            eventType,
            timestamp: new Date().toISOString(),
            payload: payload || {},
        };

        await publishEvent(event);

        res.status(201).json({ eventId: event.eventId });
    } catch (error) {
        console.error('Error in /generate:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/processed', (req, res) => {
    const events = memoryStore.getEvents();
    res.json(events);
});

export default router;
// input validation helper 

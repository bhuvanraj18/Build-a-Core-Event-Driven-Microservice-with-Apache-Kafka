import express from 'express';
import request from 'supertest';
import eventRoutes from '../src/routes/events';
import { memoryStore } from '../src/store/memoryStore';

// Mock Kafka producer
jest.mock('../src/kafka/producer', () => ({
    publishEvent: jest.fn().mockResolvedValue(true),
    connectProducer: jest.fn().mockResolvedValue(true),
}));

// Mock Kafka consumer
jest.mock('../src/kafka/consumer', () => ({
    connectConsumer: jest.fn().mockResolvedValue(true),
}));

const app = express();
app.use(express.json());
app.use('/events', eventRoutes);

describe('Event API', () => {
    beforeEach(() => {
        // Clear memory store before each test if needed
        // memoryStore['events'] = []; // If we could access private property, or add a clear method
    });

    it('POST /events/generate should return 201 and eventId', async () => {
        const response = await request(app)
            .post('/events/generate')
            .send({
                userId: 'user123',
                eventType: 'LOGIN',
                payload: { device: 'mobile' }
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('eventId');
    });

    it('POST /events/generate should return 400 if userId is missing', async () => {
        const response = await request(app)
            .post('/events/generate')
            .send({
                eventType: 'LOGIN',
                payload: { device: 'mobile' }
            });

        expect(response.status).toBe(400);
    });

    it('GET /events/processed should return list of events', async () => {
        // Manually add an event to store to test GET
        const mockEvent: any = {
            eventId: 'test-event-id',
            userId: 'user-test',
            eventType: 'LOGIN',
            timestamp: new Date().toISOString(),
            payload: {}
        };
        memoryStore.addEvent(mockEvent);

        const response = await request(app).get('/events/processed');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        const found = response.body.find((e: any) => e.eventId === 'test-event-id');
        expect(found).toBeDefined();
    });
});
// producer unit test placeholder 

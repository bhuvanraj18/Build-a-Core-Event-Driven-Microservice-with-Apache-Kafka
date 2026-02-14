import { Producer } from 'kafkajs';
import { config } from '../config';
import { UserEvent } from '../types';
import { kafka } from './client';

let producer: Producer;

export const connectProducer = async () => {
    try {
        producer = kafka.producer();
        await producer.connect();
        console.log('Kafka Producer connected');
    } catch (error) {
        console.error('Error connecting Kafka Producer:', error);
        process.exit(1);
    }
};

export const publishEvent = async (event: UserEvent) => {
    if (!producer) {
        throw new Error('Producer is not connected');
    }

    try {
        await producer.send({
            topic: config.kafka.topic,
            messages: [
                {
                    key: event.userId,
                    value: JSON.stringify(event),
                },
            ],
        });
        console.log(`Event published: ${event.eventId}`);
    } catch (error) {
        console.error(`Error publishing event ${event.eventId}:`, error);
        throw error;
    }
};

export const disconnectProducer = async () => {
    if (producer) {
        await producer.disconnect();
    }
}
// Kafka producer initialized 

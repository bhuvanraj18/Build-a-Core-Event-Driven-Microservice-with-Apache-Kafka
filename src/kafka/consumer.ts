import { Consumer } from 'kafkajs';
import { config } from '../config';
import { memoryStore } from '../store/memoryStore';
import { UserEvent } from '../types';
import { kafka } from './client';

let consumer: Consumer;

export const connectConsumer = async () => {
    try {
        consumer = kafka.consumer({ groupId: config.kafka.groupId });
        await consumer.connect();
        console.log('Kafka Consumer connected');

        await consumer.subscribe({ topic: config.kafka.topic, fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    if (!message.value) return;

                    const event: UserEvent = JSON.parse(message.value.toString());

                    console.log(`Received event: ${event.eventId}, User: ${event.userId}, Type: ${event.eventType}`);

                    // Idempotency check happens in store
                    memoryStore.addEvent(event);

                } catch (error) {
                    console.error('Error processing message:', error);
                }
            },
        });

    } catch (error) {
        console.error('Error connecting Kafka Consumer:', error);
        // don't exit process, just log error, maybe retry logic could go here
    }
};

export const disconnectConsumer = async () => {
    if (consumer) {
        await consumer.disconnect();
    }
}
// Kafka consumer group configuration 

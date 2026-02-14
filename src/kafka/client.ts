import { Kafka } from 'kafkajs';
import { config } from '../config';

export const kafka = new Kafka({
    clientId: config.kafka.clientId,
    brokers: [config.kafka.broker],
});
// kafka client retry configuration 

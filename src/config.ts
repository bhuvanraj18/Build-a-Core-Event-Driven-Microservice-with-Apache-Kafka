import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    kafka: {
        broker: process.env.KAFKA_BROKER || 'localhost:9092',
        clientId: process.env.KAFKA_CLIENT_ID || 'user-activity-service',
        groupId: process.env.KAFKA_GROUP_ID || 'user-activity-consumer-group',
        topic: 'user-activity-events'
    }
};

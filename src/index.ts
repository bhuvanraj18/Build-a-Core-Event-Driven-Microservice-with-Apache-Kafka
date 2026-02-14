import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { config } from './config';
import { connectConsumer } from './kafka/consumer';
import { connectProducer } from './kafka/producer';
import eventRoutes from './routes/events';

dotenv.config();

const app = express();
const port = config.port;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('Kafka Event Microservice is running!');
});

const startServer = async () => {
    await connectProducer();
    await connectConsumer();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer().catch(err => {
    console.error("Failed to start server", err);
});

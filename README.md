# Core Event-Driven Microservice with Apache Kafka

## Overview
This project connects a Node.js/Express microservice with Apache Kafka to demonstrate event-driven architecture principles. The service acts as both a producer (publishing events) and a consumer (processing events with idempotency).

## Prerequisites
- Docker & Docker Compose
- Node.js (v18+)

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Start Services (Kafka, Zookeeper, App):**
    ```bash
    docker-compose up --build
    ```
    This command will start Zookeeper, Kafka, and the Node.js application.
    The application will be available at `http://localhost:3000`.

## API Documentation

### 1. Generate Event
Publishes a new user activity event to the Kafka topic.

- **Endpoint:** `POST /events/generate`
- **Body:**
  ```json
  {
    "userId": "user123",
    "eventType": "LOGIN",
    "payload": {
      "device": "mobile",
      "ip": "192.168.1.1"
    }
  }
  ```
- **Response:**
  ```json
  {
    "eventId": "uuid-string"
  }
  ```

### 2. Get Processed Events
Retrieves all events that have been successfully consumed and stored in memory.

- **Endpoint:** `GET /events/processed`
- **Response:**
  ```json
  [
    {
      "eventId": "uuid-string",
      "userId": "user123",
      "eventType": "LOGIN",
      "timestamp": "2023-10-27T10:00:00.000Z",
      "payload": { ... }
    }
  ]
  ```

## Architecture

- **Producer:** Accepts HTTP POST requests, adds metadata (eventId, timestamp), and publishes to `user-activity-events` topic.
- **Consumer:** Subscribes to `user-activity-events` topic (group: `user-activity-consumer-group`).
- **Idempotency:** The consumer checks an in-memory `Set` of processed `eventIds` before processing. If an ID exists, the event is skipped.
- **Storage:** Synced in-memory store (array) for demonstration purposes.

## Testing

### Unit & Integration Tests
Run the test suite locally (requires Node.js):

```bash
npm install
npm test
```

Tests cover:
- API endpoint validation.
- Mocked Kafka producer/consumer interactions.
- Idempotency logic (via mocked store/consumer logic).

## Development

- **Run locally (without Docker for app):**
  Ensure Kafka is running (e.g., via docker-compose with only kafka/zookeeper), then:
  ```bash
  npm run dev
  ```

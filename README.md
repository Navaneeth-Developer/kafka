# Node.js Kafka Microservice

A multi-service architecture demonstrating data streaming between an Express API and a background worker using Apache Kafka and Docker.

## 🚀 Features

- **Producer API**: Express.js endpoints to receive Order and Payment data via Postman.
- **Consumer Worker**: A decoupled service that processes JSON events from multiple Kafka topics.
- **Dockerized Infrastructure**: Managed Kafka and Zookeeper environment.

## 🛠️ Tech Stack

- **Language**: Node.js
- **Streaming**: KafkaJS
- **Infrastructure**: Docker / Docker Compose
- **Server**: Express.js

## 🚦 How to Run

1. **Start the Infrastructure**:
   ```bash
   docker-compose up -d
   ```

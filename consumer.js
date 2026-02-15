const { Kafka } = require("kafkajs"); // Import KafkaJS

const kafka = new Kafka({
  clientId: "worker-service", // Service name
  brokers: ["localhost:9092"], // Kafka address
});

const consumer = kafka.consumer({ groupId: "main-worker-group" }); // Define consumer group

const run = async () => {
  await consumer.connect(); // Connect to Kafka

  // Subscribe to BOTH topics
  await consumer.subscribe({
    topics: ["orders", "payments"],
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString()); // Parse JSON

      // Logic based on which topic the message came from
      if (topic === "orders") {
        console.log(`📦 [Order Worker] Processing Order: ${data.orderId}`); // Handle orders
      } else if (topic === "payments") {
        console.log(
          `💰 [Payment Worker] Processing $${data.amount} for User: ${data.userId}`,
        ); // Handle payments
      }
    },
  });
};

run().catch(console.error); // Start consumer

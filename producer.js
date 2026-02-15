const express = require("express"); // Import express to handle HTTP requests
const { Kafka, Partitioners } = require("kafkajs"); // Import KafkaJS

const app = express(); // Initialize express
app.use(express.json()); // Allow JSON parsing for Postman requests

const kafka = new Kafka({
  clientId: "api-service", // Name of this service
  brokers: ["localhost:9092"], // Docker Kafka address
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
}); // Initialize producer

// --- EXISTING ORDER API ---
app.post("/send-order", async (req, res) => {
  const { orderId, item, price } = req.body; // Get order data
  try {
    await producer.connect(); // Connect to broker
    await producer.send({
      topic: "orders", // Send to orders topic
      messages: [
        {
          value: JSON.stringify({
            orderId,
            item,
            price,
            type: "ORDER_CREATED",
          }),
        },
      ], // Send as JSON string
    });
    res.status(200).send({ message: "Order sent to Kafka!" }); // Success
  } catch (error) {
    res.status(500).send({ error: error.message }); // Error handling
  }
});

// --- NEW PAYMENT API ---
app.post("/process-payment", async (req, res) => {
  const { amount, userId, transactionId } = req.body; // Get payment data from Postman
  try {
    await producer.connect(); // Connect to broker
    await producer.send({
      topic: "payments", // Send to a NEW topic called 'payments'
      messages: [
        {
          value: JSON.stringify({
            amount,
            userId,
            transactionId,
            status: "INITIALIZED",
          }), // Convert to string
        },
      ],
    });
    res.status(200).send({ message: "Payment info sent to Kafka!" }); // Success
  } catch (error) {
    res.status(500).send({ error: error.message }); // Error handling
  }
});

app.listen(3000, () => console.log("🚀 API Service running on port 3000")); // Start server

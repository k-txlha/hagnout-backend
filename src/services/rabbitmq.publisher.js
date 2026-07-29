import { AMQPClient } from "@cloudamqp/amqp-client";

/**
 * Publishes an event to a RabbitMQ queue.
 *
 * @param {string} queueName - The name of the queue to publish to.
 * @param {Object} message - The message payload to publish (will be JSON-stringified).
 * @returns {Promise<void>}
 */
async function publishEvent(queueName, message) {
  try {
    const amqp = new AMQPClient(process.env.RABBITMQ_KEY);
    const conn = await amqp.connect();
    const ch = await conn.channel();

    const q = await ch.queue(queueName, { durable: true });
    await q.publish(JSON.stringify(message), { deliveryMode: 2 });

    console.log(`✅ Event published to ${queueName}:`, message);
    await conn.close();
  } catch (error) {
    console.error("❌ RabbitMQ Publish Error:", error);
  }
}

export default publishEvent;

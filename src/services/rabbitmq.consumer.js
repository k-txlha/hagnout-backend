import { AMQPClient } from "@cloudamqp/amqp-client";

/**
 * Starts a RabbitMQ consumer that listens for "song_change" events
 * and broadcasts them to the appropriate Socket.IO room.
 * Automatically reconnects after 1 second on failure.
 *
 * @param {import('socket.io').Server} io - The Socket.IO server instance.
 * @returns {Promise<void>}
 */
async function consumeEvents(io) {
  try {
    const amqp = new AMQPClient(process.env.RABBITMQ_KEY);
    const conn = await amqp.connect();
    const ch = await conn.channel();

    const q = await ch.queue("song_change", { durable: true });
    console.log(`👂 Listening for "song_change" events...`);

    const consumer = await q.subscribe({ noAck: true }, async (msg) => {
      const data = JSON.parse(msg.bodyToString());
      console.log(`📥 Received song_change event:`, data);

      io.to(data.roomId).emit("song_change", {
        trackName: data.trackName,
        trackUrl: data.trackUrl,
      });
    });

    await consumer.wait();
  } catch (err) {
    console.error("❌ RabbitMQ Consumer Error:", err);
    setTimeout(() => consumeEvents(io), 1000);
  }
}

export default consumeEvents;

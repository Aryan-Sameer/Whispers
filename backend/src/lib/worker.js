import { Worker } from 'bullmq';
import { connection } from './queue.js';
import Message from '../models/message.model.js';
import cloudinary from './cloudinary.js';
import { getRecieverSocketId, io } from './socket.js';

console.log("Initializing BullMQ Message Worker...");

const messageWorker = new Worker(
  'messages',
  async (job) => {
    const { messageId, senderId, recieverId, text, image } = job.data;

    try {
      const newMessage = new Message({
        _id: messageId,
        senderId,
        recieverId,
        text,
        image
      });

      await newMessage.save();

      const recieverSocketId = getRecieverSocketId(recieverId);
      if (recieverSocketId) {
        io.to(recieverSocketId).emit("newMessage", newMessage);
      }

      const senderSocketId = getRecieverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageEdited", newMessage);
      }

    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error.message);
      throw error;
    }
  },
  { connection }
);

messageWorker.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`);
});

messageWorker.on('failed', (job, err) => {
  console.error(`Job failed: ${job.id}, error:`, err);
});

export default messageWorker;

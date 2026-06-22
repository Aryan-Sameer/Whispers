import { Worker } from 'bullmq';
import { connection } from './queue.js';
import Message from '../models/message.model.js';
import cloudinary from './cloudinary.js';
import { getRecieverSocketId, io } from './socket.js';

console.log("Initializing BullMQ Message Worker...");

const messageWorker = new Worker(
  'messages',
  async (job) => {
    console.log(`Processing message delivery job ${job.id}...`, job.data);
    const { messageId, senderId, recieverId, text, image } = job.data;

    try {
      let imageUrl;
      if (image) {
        // Upload base64 image to Cloudinary
        console.log(`Uploading image to Cloudinary for job ${job.id}...`);
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
        console.log(`Image uploaded successfully: ${imageUrl}`);
      }

      // Create message document in database
      const newMessage = new Message({
        _id: messageId,
        senderId,
        recieverId,
        text,
        image: imageUrl
      });

      await newMessage.save();
      console.log(`Message saved to database: ${newMessage._id}`);

      // Deliver to receiver via Socket.io
      const recieverSocketId = getRecieverSocketId(recieverId);
      if (recieverSocketId) {
        console.log(`Emitting newMessage to receiver ${recieverId} (Socket: ${recieverSocketId})`);
        io.to(recieverSocketId).emit("newMessage", newMessage);
      }

      // Deliver/Update to sender via Socket.io to sync the finalized Cloudinary URL
      const senderSocketId = getRecieverSocketId(senderId);
      if (senderSocketId) {
        console.log(`Emitting messageEdited to sender ${senderId} (Socket: ${senderSocketId}) to sync image URL`);
        io.to(senderSocketId).emit("messageEdited", newMessage);
      }

    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error.message);
      throw error; // Propagate the error so BullMQ can attempt retries
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

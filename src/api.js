import express from 'express';
import { emailQueue } from './queue.js';

const app = express();

app.use(express.json());

app.post('/send-email', async (req, res) => {
    const job = await emailQueue.add('send-welcome-email',
        {
            to: req.body.to,
            name: req.body.name,
            subject: 'Welcome to our service!',
            body: 'Thank you for signing up for our service. We are excited to have you on board!'
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000
            }
        }
    );
    res.json({ message: 'Email job added to the queue', jobId: job.id });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

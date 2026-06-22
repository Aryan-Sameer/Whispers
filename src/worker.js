import { Worker } from "bullmq";
import { connection } from "./queue";

const emailWorker = Worker (
    'emails',
    async (job) => {
        console.log('processing the job... ', job.id, job.data);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('email job complete... ', job.id, job.data);
    },
    {connection}
)

emailWorker.on('completed', (job) => {
    console.log("job completed, ", job.id, job.data);
})

emailWorker.on('failed', (job, err) => {
    console.log("job failed, ", job.id, job.data, err);
})

import { mongoose } from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        recieverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String
        },
        image: {
            type: String
        },
        visible: {
            type: Boolean,
            default: true
        },
        isEdited: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const Message = mongoose.model("Message", messageSchema);

export default Message;
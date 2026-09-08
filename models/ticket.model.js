import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["Hardware", "Software", "Network", "Account", "Other"],
            required: true,
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            required: true,
        },
        status: {
            type: String,
            enum: ["Open", "In Progress", "Resolved",
                "Closed"],
            default: "Open",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        timestamps: true
    }
)

export const Ticket = mongoose.model("Ticket", ticketSchema);
import mongoose, { Schema, model } from 'mongoose';

const itemSchema = new Schema({
    menuItem: { 
        type: Schema.Types.ObjectId,
        ref: "MenuItem", 
        required: true
    }, 
    quantity: { 
        type: Number,
        required: true,
        min: 1
    }
});

const orderSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    items: [itemSchema], 
    total: { 
        type: Number,
        required: true
    },
    status: { 
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }, 
    created_at: { 
        type: Date,
        default: Date.now
    }
});

const Order = model("Order", orderSchema);
export default Order;


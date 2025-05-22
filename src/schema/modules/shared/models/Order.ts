import mongoose, { Document, Schema } from 'mongoose';
import { OrderStatus } from '../../../../constants';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    shippingAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);


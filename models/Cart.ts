import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ICartItem extends Document {
  _id: Types.ObjectId;
  sessionId: string;
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productImageUrl: string;
  productCategory: string;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema(
  {
    sessionId: {
      type: String,
      required: [true, 'Session ID is required'],
      trim: true,
      index: true,
    },
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      trim: true,
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    productDescription: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    productPrice: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    productImageUrl: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true,
    },
    productCategory: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    totalPrice: {
      type: Number,
      min: [0, 'Total price cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
CartItemSchema.index({ sessionId: 1, productId: 1 }, { unique: true });
CartItemSchema.index({ sessionId: 1, createdAt: -1 });

// Pre-save middleware to calculate total price
CartItemSchema.pre<ICartItem>('save', function (next) {
  // Always calculate total price
  this.totalPrice = this.quantity * this.productPrice;
  next();
});

// Pre-update middleware to calculate total price
CartItemSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const update = this.getUpdate() as any;
  if (update.quantity !== undefined || update.productPrice !== undefined) {
    const quantity = update.quantity || this.getQuery().quantity;
    const productPrice = update.productPrice || this.getQuery().productPrice;
    if (quantity && productPrice) {
      update.totalPrice = quantity * productPrice;
    }
  }
  next();
});

const CartItem: Model<ICartItem> = 
  mongoose.models.CartItem || mongoose.model<ICartItem>('CartItem', CartItemSchema);

export default CartItem;

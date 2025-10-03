import { IUser } from "./user.schema";

import mongoose, { Document, Model } from "mongoose";

interface IFcmToken extends Document {
  token: string;
  userId: mongoose.Schema.Types.ObjectId;
  deviceInfo: {
    platform: string;
    deviceId: string;
    appVersion: string;
  };
  isActive: boolean;
  lastUsed: Date;
}

const fcmTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Optional if you want to track users
  },
  deviceInfo: {
    platform: String,  // 'ios' or 'android'
    deviceId: String,
    appVersion: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

// Index for faster queries
fcmTokenSchema.index({ userId: 1, isActive: 1 });
fcmTokenSchema.index({ lastUsed: 1 });

export const FcmToken = mongoose.model<IFcmToken>("FcmToken", fcmTokenSchema );
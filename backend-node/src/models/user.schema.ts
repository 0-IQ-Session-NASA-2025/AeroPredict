import mongoose, { Document, Model } from "mongoose";
import { validate } from "../utils/emailValidator";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  healthConditions?: string[];
  allergies?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  smokingStatus?: 'never' | 'former' | 'current';
  fcmTokens?: string[];
  isActive: boolean;
  authProvider: string;
}

interface IUserModel extends Model<IUser> {
  verifyCredentials(email: string, password: string): Promise<IUser>;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 1,
    max: 120
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  healthConditions: [{
    type: String,
    trim: true
  }],
  allergies: [{
    type: String,
    trim: true
  }],
  location: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    },
    address: String,
    city: String,
    state: String,
    country: String
  },
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly'],
      default: 'daily'
    }
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']
  },
  smokingStatus: {
    type: String,
    enum: ['never', 'former', 'current']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  authProvider: { 
    type: String, 
    enum: ['local', 'google'], 
    default: 'local' 
  },
  fcmTokens:[{
    type: String,
  }],
}, {
  timestamps: true,
  minimize: false
});

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this as IUser;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Static method to verify credentials
userSchema.statics.verifyCredentials = async function(email: string, password: string): Promise<IUser> {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  if (user && user.authProvider === 'google') throw new Error('Invalide method of login');
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');
  return user;
};

// Hash password before saving
userSchema.pre('save', async function() {
  const user = this as IUser;
  if (user.isModified('password')) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
});

userSchema.index({ email: 1 });

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
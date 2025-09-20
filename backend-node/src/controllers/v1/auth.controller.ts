import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/response";
import { User } from "../../models/user.schema";
import jwt from 'jsonwebtoken';
import { Logger } from "../../utils/logger";
import { COOKIE_OPTIONS } from "../../utils/cookie";
import { OAuth2Client } from 'google-auth-library';
const logger = Logger.getInstance();
const google_client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthController {
  public static async Register(req: Request, res: Response): Promise<any>{
    try{
      const {email, password} = req.body;

      if(!email || !password) {
        ResponseHandler.badRequest(res, undefined, "Email or password missing");
        return;
      }

      // check whether user existed with this email
      const existingUser = await User.findOne({email});

      if(existingUser) {
        ResponseHandler.conflict(res, undefined, "User with this email already exist!");
        return;
      }

      // create user with the email and password
      const user = new User({
        email,
        password
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'my-secret-key',
        { expiresIn: '24h' }
      );

      res.cookie('token', token, COOKIE_OPTIONS);
      ResponseHandler.success(res, {user, token});

    }catch(error){
      ResponseHandler.internalError(res, undefined, "Internal server error");
    }
  }

  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password, fcmToken } = req.body;

      // Validate required fields
      if (!email || !password) {
        ResponseHandler.badRequest(res, undefined, "Email or password missing");
        return;
      }

      // Verify credentials using the static method from user model
      const user = await User.verifyCredentials(email, password);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: 'user' },
        process.env.JWT_SECRET || 'my-secret-key',
        { expiresIn: '24h' }
      );

      if(fcmToken){
        const updateduser = await User.findOneAndUpdate(
          { email },
          { $addToSet: { fcmTokens: fcmToken } },
          { new: true }
        );
      }

      logger.info(`user: \n ${JSON.stringify(user)}`);

      res.cookie('token', token, COOKIE_OPTIONS);
      ResponseHandler.success(res, {user, token});

    } catch (error) {
      ResponseHandler.internalError(res, undefined, "Internal server error");
    }
  }

  static async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      // Verify Google token
      const ticket = await google_client.verifyIdToken({
        idToken: req.body.credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid token payload');
      }
  
      // Check if user exists
      let user = await User.findOne({ email: payload.email });
      
      if (!user) {
        // Create new user if doesn't exist
        user = new User({
          name: payload.name,
          email: payload.email,
          fcmTokens: [],
          authProvider: 'google'
        });
        await user.save();
      }

      if(user.authProvider != 'google') {
        ResponseHandler.badRequest(res, undefined, "Invalid method of login");
        return;
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: 'user' },
        process.env.JWT_SECRET || 'my-secret-key',
        { expiresIn: '24h' }
      );
  
      res.cookie('token', token, COOKIE_OPTIONS);
      ResponseHandler.success(res, {user, token});
    } catch (error) {
      logger.error((error as Error).message)
      ResponseHandler.internalError(res, undefined, "Internal server error");
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
         ResponseHandler.badRequest(res, undefined, "Email or password missing");
        return;
      }

      // Verify credentials using the static method from user model
      const existingUser = await User.findOne({email});

      if (!existingUser) {
        ResponseHandler.badRequest(res, undefined, "Email not registered");
        return;
      }

      existingUser.password = password;

      await existingUser.save();

      ResponseHandler.success(res, undefined, "Password reset successfull");
    } catch (error) {
      ResponseHandler.internalError(res, undefined, "Internal Server Error");
    }
  }
}
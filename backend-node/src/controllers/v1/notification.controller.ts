import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/response";
import { FcmToken } from "../../models/fcmtoken.schema";
import { sendPushNotification } from "../../services/notification.service";

export class NotificationController {
  public static async storeFcmtoken(req: Request, res: Response) {
    try{
      const { token, userId, deviceInfo } = req.body;

      console.log('---token: ', token);

      if (!token) {
        ResponseHandler.badRequest(res, undefined, "FCM token not provided");
        return;
      }

      // Upsert token (update if exists, create if doesn't)
      const fcmToken = await FcmToken.findOneAndUpdate(
        { token },
        {
          token,
          userId: userId || null,
          deviceInfo: deviceInfo || {},
          isActive: true,
          lastUsed: new Date()
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );

      ResponseHandler.success(res, fcmToken, "fcm token updated succefully");
    }catch(error){
      ResponseHandler.internalError(res, undefined, (error as Error).message);
    }
  }

  public static async sendBulkNotification(req: Request, res: Response) {
    try{
      const { title, body, data } = req.body;

      // Get all active tokens
      const tokenDocs = await FcmToken.find({ isActive: true }).select('token');
      
      if (tokenDocs.length === 0) {
        ResponseHandler.notFound(res, "Fcm tokens not found");
        return;
      }

      const tokens = tokenDocs.map(doc => doc.token);

      await sendPushNotification(tokens, title, body);

      ResponseHandler.success(res, {}, "fcm token updated succefully");

    }catch(error){
      ResponseHandler.internalError(res, undefined, (error as Error).message);
    }
  }
}
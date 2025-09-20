import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/response";


export class PredictionController {
  public static publicPrediction(req: Request, res: Response) {
    try{
      const {lan, lat} = req.body;

      if(!lan || !lat){
        ResponseHandler.badRequest(res, undefined, "Langitute or Latitude value are not provided");
        return;
      }

      // todo: call prediction Api to get predection based on the lan lat

      // dummy prediction value
      const predictionValue = "no2: high, o2: low, dust: high, co2: moderate, allergen particles: high";

      // todo: call the llm model to get health indication response on the predictionValue

      // dummy fine tuned value
      const healthIndication = "Air quality is very poor. Dont go outside";

      ResponseHandler.success(res, 
        {
          prediction: predictionValue,
          healthIndication
        }, 
      );
    }catch(error: any){
      ResponseHandler.internalError(res, undefined, (error as Error).message);
    }
  }

  public static userSpecificPrediction(req: Request, res: Response) {
    try{
      const {lan, lat, email} = req.body;

      if(!email) {
        ResponseHandler.badRequest(res, undefined, "Email not provided");
        return;
      }

      if(!lan || !lat){
        ResponseHandler.badRequest(res, undefined, "Langitute or Latitude value are not provided")
        return;
      }

      // todo: find the user, get the user health data

      // todo: call prediction Api to get predection based on the lan lat

      // todo: call llm model with prediction result and user health data

      // dummy prediction value
      const predictionValue = "no2: high, o2: low, dust: high, co2: moderate, allergen particles: high";

      // dummy fine tuned value
      const healthIndication = "Air quality is very poor. Dont go outside";

      ResponseHandler.success(res, 
        {
          prediction: predictionValue,
          healthIndication
        }, 
      )
    }catch(error: any){
       ResponseHandler.internalError(res, undefined, (error as Error).message);
    }
  }
}
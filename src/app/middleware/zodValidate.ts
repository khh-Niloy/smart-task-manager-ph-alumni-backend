import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const zodValidation =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (zodSchema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body && typeof req.body === 'object') {
      }
      
      req.body = await zodSchema.parseAsync(req.body)
      next();
    } catch (error) {
      console.log('Zod validation error:', error);
      next(error);
    }
  };
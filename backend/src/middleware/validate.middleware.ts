import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if(!result.success) {
        res.status(400).json({ success: false, errors: result.error.flatten().fieldErrors, });
        return
    }

    req.body = result.data;
    next();
}
import { type Request, type Response, type NextFunction } from "express";
import { z, type ZodTypeAny } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: unknown[] = [];
      if (schema.body) {
        const result = await schema.body.safeParse(req.body);
        if (!result.success) {
          errors.push(...result.error.issues.map((i) => ({ path: i.path, message: i.message })));
        } else {
          req.body = result.data;
        }
      }
      if (schema.query) {
        const result = await schema.query.safeParse(req.query);
        if (!result.success) {
          errors.push(...result.error.issues.map((i) => ({ path: i.path, message: i.message })));
        } else {
          req.query = result.data;
        }
      }
      if (schema.params) {
        const result = await schema.params.safeParse(req.params);
        if (!result.success) {
          errors.push(...result.error.issues.map((i) => ({ path: i.path, message: i.message })));
        } else {
          req.params = result.data;
        }
      }
      if (errors.length) {
        return next(ApiError.badRequest("Validation failed", errors));
      }
      return next();
    } catch (e) {
      return next(e);
    }
  };
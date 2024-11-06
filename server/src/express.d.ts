// express.d.ts
import { Request } from "express";
import multer from "multer";

declare module "express-serve-static-core" {
  interface Request {
    file?: Express.Multer.File; // Allow `file` property on `Request`
  }
}

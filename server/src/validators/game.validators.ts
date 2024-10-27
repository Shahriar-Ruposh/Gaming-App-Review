import { body } from "express-validator";

export const createGameValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("release_date").isDate().withMessage("Valid release date is required"),
  body("publisher").trim().notEmpty().withMessage("Publisher is required"),
  body("thumbnail").trim().isURL().withMessage("Valid thumbnail URL is required"),
];

export const updateGameValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("release_date").isDate().withMessage("Valid release date is required"),
  body("publisher").trim().notEmpty().withMessage("Publisher is required"),
  body("thumbnail").trim().isURL().withMessage("Valid thumbnail URL is required"),
];

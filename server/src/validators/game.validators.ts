import { body } from "express-validator";

export const createGameValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("release_date").isDate().withMessage("Valid release date is required"),
  body("publisher").trim().notEmpty().withMessage("Publisher is required"),
  body("thumbnail").trim().isURL().withMessage("Valid thumbnail URL is required"),
  body("genres")
    .isArray({ min: 1 })
    .withMessage("At least one genre is required")
    .custom((genres) => {
      // Validate that each genre in the list is a valid UUID
      genres.forEach((genre: string) => {
        if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(genre)) {
          throw new Error("Each genre must be a valid UUID");
        }
      });
      return true;
    }),
];
export const updateGameValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("release_date").isDate().withMessage("Valid release date is required"),
  body("publisher").trim().notEmpty().withMessage("Publisher is required"),
  body("thumbnail").trim().isURL().withMessage("Valid thumbnail URL is required"),
];

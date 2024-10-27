import { Request, Response } from "express";
import { Genre, GenreAttributes } from "../models/genre.model";
import { validationResult } from "express-validator";

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Genre.findAll();
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createGenre = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name } = req.body;
    const genre = await Genre.create({ name } as GenreAttributes);
    res.status(201).json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { name } = req.body;
    const genre = await Genre.findByPk(id);
    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }
    genre.name = name;
    await genre.save();
    res.json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const genre = await Genre.findByPk(id);
    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }
    await genre.destroy();
    res.json({ message: "Genre deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

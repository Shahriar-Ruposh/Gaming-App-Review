import { Request, Response } from "express";
import { Game, GameAttributes } from "../models/game.model";
import { User, UserAttributes } from "../models/user.model";
import { validationResult } from "express-validator";

export const getAllGames = async (req: Request, res: Response) => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGameById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findByPk(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createGame = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, description, release_date, publisher, thumbnail } = req.body;
    const created_by = "09c6db90-fa4e-4d90-9e1b-d4e9e77df5f3";
    const game = await Game.create({ title, description, release_date, publisher, thumbnail, created_by } as GameAttributes);
    res.status(201).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateGame = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { title, description, release_date, publisher, thumbnail } = req.body;
    const game = await Game.findByPk(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    game.title = title;
    game.description = description;
    game.release_date = release_date;
    game.publisher = publisher;
    game.thumbnail = thumbnail;
    await game.save();
    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findByPk(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    await game.destroy();
    res.json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

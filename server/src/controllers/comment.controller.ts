import { Request, Response } from "express";
import { Comment } from "../models/comment.model";
import { Game } from "../models/game.model";
import { User } from "../models/user.model";

export const getCommentsByGameId = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { game_id: gameId },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["name"],
        },
      ],
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const createComment = async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const { comment } = req.body;
  const userId = req.user?.userId.toString();
  try {
    console.log(",,,,,,,,,,,,,,,>>>>>>>>>>>>>", gameId, userId, comment);
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }
    const userComment = await Comment.findOne({
      where: {
        user_id: userId,
      },
    });
    if (userComment) {
      if (userComment.game_id === gameId) {
        userComment.comment = comment;
        await userComment.save();
        return res.status(200).json({ message: "Comment updated successfully" });
      }
    }
    const newComment = await Comment.create({
      game_id: gameId,
      user_id: userId,
      comment,
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const userId = req.user?.userId.toString();
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.user_id !== userId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }
    await comment.destroy();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

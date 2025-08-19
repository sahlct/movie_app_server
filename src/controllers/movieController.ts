import { Request, Response } from "express";
import axios from "axios";
import { env } from "../config/env";
import { z } from "zod";
import { User } from "../models/User";

export async function searchMovies(req: Request, res: Response) {
  const title = (req.query.title as string || "").trim();
  if (!title) return res.status(400).json({ message: "title query is required" });

  try {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: { s: title, apikey: env.OMDB_API_KEY }
    });
    const data = response.data;

    if (!data || data.Response === "False") {
      return res.json({ results: [] });
    }

    const results = (data.Search || []).map((m: any) => ({
      title: m.Title,
      year: m.Year,
      poster: m.Poster,
      imdbID: m.imdbID
    }));
    res.json({ results });
  } catch (e) {
    res.status(502).json({ message: "OMDb request failed" });
  }
}

const saveSchema = z.object({
  title: z.string(),
  year: z.string(),
  poster: z.string().url().or(z.literal("N/A")),
  imdbID: z.string()
});

export async function saveMovie(req: Request, res: Response) {
  const parsed = saveSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  const movie = parsed.data;

  const user = req.user!;
  const exists = user.savedMovies.some(m => m.imdbID === movie.imdbID);
  if (!exists) {
    user.savedMovies.push(movie);
    await user.save();
  }
  res.json({ saved: true, movie });
}

export async function listMovies(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  res.json({ movies: user?.savedMovies ?? [] });
}

export async function deleteMovie(req: Request, res: Response) {
  const { imdbID } = req.params;
  if (!imdbID) return res.status(400).json({ message: "imdbID param required" });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.savedMovies = user.savedMovies.filter(m => m.imdbID !== imdbID);
  await user.save();
  res.json({ deleted: true });
}

import mongoose, { Schema, Document } from "mongoose";

export interface SavedMovie {
  title: string;
  year: string;
  poster: string;
  imdbID: string;
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  savedMovies: SavedMovie[];
}

const SavedMovieSchema = new Schema<SavedMovie>({
  title: { type: String, required: true },
  year: { type: String, required: true },
  poster: { type: String, required: true },
  imdbID: { type: String, required: true }
}, { _id: false });

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  savedMovies: { type: [SavedMovieSchema], default: [] }
}, { timestamps: true });

export const User = mongoose.model<UserDocument>("User", UserSchema);

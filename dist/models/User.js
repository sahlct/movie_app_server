import mongoose, { Schema } from "mongoose";
const SavedMovieSchema = new Schema({
    title: { type: String, required: true },
    year: { type: String, required: true },
    poster: { type: String, required: true },
    imdbID: { type: String, required: true }
}, { _id: false });
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    savedMovies: { type: [SavedMovieSchema], default: [] }
}, { timestamps: true });
export const User = mongoose.model("User", UserSchema);

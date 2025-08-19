import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { env } from "../config/env";
import { z } from "zod";
const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
export async function register(req, res) {
    const parsed = authSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    }
    const { email, password } = parsed.data;
    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(409).json({ message: "Email already in use" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: user.id, email: user.email } });
}
export async function login(req, res) {
    const parsed = authSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    }
    const { email, password } = parsed.data;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: user.id, email: user.email } });
}
export async function me(req, res) {
    // You can extend this if you want to return user details
    return res.json({ ok: true });
}
export async function logout(_req, res) {
    // No cookies to clear, just tell frontend to remove token
    return res.json({ ok: true });
}

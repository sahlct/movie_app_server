import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";
export async function auth(req, res, next) {
    try {
        const header = req.headers.authorization;
        let token;
        if (header && header.startsWith("Bearer ")) {
            token = header.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, env.JWT_SECRET);
        if (!decoded?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        req.userId = user.id;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

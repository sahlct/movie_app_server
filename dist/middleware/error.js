import { ApiError } from "../utils/ApiError";
export function notFound(_req, _res, next) {
    next(new ApiError(404, "Not Found"));
}
export function errorHandler(err, _req, res, _next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
            details: err.details ?? undefined
        });
    }
    console.error(err);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
}

import { app, connectDB } from "./app.js";
import { env } from "./config/env.js";
(async () => {
    try {
        await connectDB();
        app.listen(env.PORT, () => console.log(`Server running on http://localhost:${env.PORT}`));
    }
    catch (e) {
        console.error("Failed to start server", e);
        process.exit(1);
    }
})();

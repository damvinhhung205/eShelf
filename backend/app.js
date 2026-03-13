import APiError from './src/api-error.js';
import express from 'express';
import cors from 'cors';

import userRouter from './src/routes/user.route.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Welcome to eShelf"});
});

app.use("/api/user", userRouter);

app.use((req, res, next) => {
    return next(new APiError(404, "Resource not found"));
});

app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error"
    });
});

export default app;
import { Router } from "express";

import userAuthRouter from "./auth";


const userRouter = Router();


// User auth
userRouter.use("/auth", userAuthRouter);

export default userRouter;

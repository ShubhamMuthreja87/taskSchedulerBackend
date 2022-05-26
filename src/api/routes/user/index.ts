import { Router } from "express";

import userAuthRouter from "./auth";
import userOpsRouter from "./ops";

const userRouter = Router();


// User auth
userRouter.use("/auth", userAuthRouter);
userRouter.use("/ops",userOpsRouter);

export default userRouter;

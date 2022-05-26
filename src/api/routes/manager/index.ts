import { Router } from "express";

import managerAuthRouter from "./auth";
import managerOpsRouter from "./ops";
const managerRouter = Router();


// User auth
managerRouter.use("/auth", managerAuthRouter);
managerRouter.use("/ops",managerOpsRouter);
export default managerRouter;

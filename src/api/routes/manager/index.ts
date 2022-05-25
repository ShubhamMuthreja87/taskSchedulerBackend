import { Router } from "express";

import managerAuthRouter from "./auth";


const managerRouter = Router();


// User auth
managerRouter.use("/auth", managerAuthRouter);

export default managerRouter;

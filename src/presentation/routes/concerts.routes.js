import { Router } from "express";
import * as ctrl from "../controllers/concerts.controller.js";
const r = Router();
r.get("/", ctrl.list);
r.get("/:id", ctrl.get);
r.post("/", ctrl.create);
export default r;

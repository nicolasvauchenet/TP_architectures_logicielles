import { Router } from "express";
import * as ctrl from "../controllers/artists.controller.js";
const r = Router();
r.get("/", ctrl.list);
r.post("/", ctrl.create);
export default r;

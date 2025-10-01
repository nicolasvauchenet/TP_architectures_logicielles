import { Router } from "express";
import * as ctrl from "../controllers/reports.controller.js";
const r = Router();
r.get("/occupancy", ctrl.occupancy);
export default r;

import { Router } from "express";
import * as ctrl from "../controllers/reservations.controller.js";
const r = Router();
r.get("/by-concert/:concertId", ctrl.listByConcert);
r.post("/", ctrl.create);
export default r;

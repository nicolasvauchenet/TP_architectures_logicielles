import express from "express";
import artistsRoutes from "./presentation/routes/artists.routes.js";
import concertsRoutes from "./presentation/routes/concerts.routes.js";
import reservationsRoutes from "./presentation/routes/reservations.routes.js";
import reportsRoutes from "./presentation/routes/reports.routes.js";
import { errorMiddleware } from "./errors.js";

// On importe la Factory+Façade depuis le container existant
import { makeAppServices } from "./container.js";

const app = express();
app.use(express.json());

app.locals.services = makeAppServices().services;

app.use("/artists", artistsRoutes);
app.use("/concerts", concertsRoutes);
app.use("/reservations", reservationsRoutes);
app.use("/reports", reportsRoutes);

app.use(errorMiddleware);

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Server listening on :${port}`));

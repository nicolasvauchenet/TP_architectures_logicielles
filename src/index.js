import "dotenv/config";
import app from "./app.js";

const port = process.env.PORT ?? 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on :${port}`);
  });
}

export default app;

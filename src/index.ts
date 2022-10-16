import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import Mpesa from "./routes/mpesa";

dotenv.config();

(async () => {
  try {
    const app = express();

    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.disable("x-powered-by");
    app.use(morgan("dev"));

    app.use("/api", Mpesa);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () =>
      console.log(`[dev 🚀]: Server is listening on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error(`[error 💥]:  ${error}`);
    process.exit(1);
  }
})();

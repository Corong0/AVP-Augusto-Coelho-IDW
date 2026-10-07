import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import filmeRoutes from "./scr/routes/filmeRoutes.js";
import { swaggerConfig } from "./scr/config/swagger.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const authToken = process.env.AUTH_TOKEN;

if (!authToken) {
  throw new Error("A variável AUTH_TOKEN não foi configurada no arquivo .env");
}

app.use(express.json());

const swaggerSpec = swaggerConfig(port);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(filmeRoutes);

export default app;

import express from 'express';
import { Sequelize } from 'sequelize';
import taskRoutes from './routes/task.routes';
import { initTaskModel } from './models/task.model';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!, {
  host: process.env.DB_HOST!,
  dialect: 'mysql',
});

initTaskModel(sequelize);

sequelize.sync();

app.use('/api', taskRoutes);

export default app;
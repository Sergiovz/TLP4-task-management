import { Request, Response } from 'express';
import { Task } from '../models/task.model';

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await Task.findAll();
  res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {
  const { titulo, descripcion } = req.body;
  const newTask = await Task.create({ titulo, descripcion });
  res.status(201).json(newTask);
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Task.update(req.body, { where: { id } });
  const updatedTask = await Task.findByPk(id);
  res.json(updatedTask);
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Task.destroy({ where: { id } });
  res.sendStatus(204);
};
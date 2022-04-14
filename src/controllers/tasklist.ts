import { Request, Response } from 'express';
import { find, addItem, updateItem, getItem } from "../models/TaskDao";
const taskRouter = require('express').Router()

//Show tasks
taskRouter.get('/', async (_req: Request, res: Response) => {
  const querySpec = {
    query: "SELECT * FROM root",
    parameters: [
      {
        name: "@completed",
        value: false
      }
    ]
  };

  const items = await find(querySpec);
  res.json(items)
  //res.json(items.map(item => item.toJSON()))
})

//addTask
taskRouter.post('/addtask', async (req: Request, res: Response) => {
  const item = req.body;

  await addItem(item);
  res.redirect("/");
})

//completeTask
taskRouter.post('/completetask', async (req: Request, res: Response) => {
  const completedTasks = Object.keys(req.body);
  const tasks: any = [];

  completedTasks.forEach(task => {
    tasks.push(updateItem(task));
  });

  await Promise.all(tasks);
  res.redirect("/");
})

export { taskRouter }
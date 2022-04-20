//Example controller to handle API calls to /api/tasks
//app.ts defines the starter API

import { Request, Response, Router  } from 'express';
import { find, addItem, updateItemName, getItem, deleteItem } from "../models/TaskDao";
const taskRouter = Router()

//Show tasks which are not completed
taskRouter.get('/', async (req: Request, res: Response) => {
  const querySpec = {
    query: "SELECT * FROM root r WHERE r.completed=@completed",
    //query: "SELECT * FROM root",
    parameters: [
      {
        name: "@completed",
        value: false
      }
    ]
  };

  const items = await find(querySpec);
  res.json(items)
})

//get a single task by id
taskRouter.get('/:id', async (req: Request, res: Response) => {
  console.log(req.params)
  const task = await getItem(req.params.id)
  res.json(task)
})

//addTask
taskRouter.post('/addtask', async (req: Request, res: Response) => {
  const item = req.body;

  await addItem(item);
  res.redirect("/");
})

//deleteTask
taskRouter.delete('/:id', async (req: Request, res: Response) => {
  const result = await deleteItem(req.params.id)
  res.json(result)
})

//changeTaskName
taskRouter.put('/:id', async (req: Request, res: Response) => {
  const result = await updateItemName(req.params.id, req.body.name)
  res.json(result)
})

export { taskRouter }
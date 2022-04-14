import { Request, Response } from 'express';
import { TaskDao } from "../models/TaskDao";

class TaskList {
  private taskDao: TaskDao

  /**
   * Handles the various APIs for displaying and managing tasks
   */
  constructor(taskDao: TaskDao) {
    this.taskDao = taskDao;
  }
  async showTasks(_req: Request, res: Response) {
    const querySpec = {
      query: "SELECT * FROM root r WHERE r.completed=@completed",
      parameters: [
        {
          name: "@completed",
          value: false
        }
      ]
    };

    const items = await this.taskDao.find(querySpec);
    res.render("index", {
      title: "My ToDo List ",
      tasks: items
    });
  }

  async addTask(req: Request, res: Response) {
    const item = req.body;

    await this.taskDao.addItem(item);
    res.redirect("/");
  }

  async completeTask(req: Request, res: Response) {
    const completedTasks = Object.keys(req.body);
    const tasks: any = [];

    completedTasks.forEach(task => {
      tasks.push(this.taskDao.updateItem(task));
    });

    await Promise.all(tasks);
    res.redirect("/");
  }
}

export { TaskList }
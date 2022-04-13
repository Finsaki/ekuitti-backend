//Example router that defines the CRUD operations for given path in app.ts

import { Request, Response } from 'express';
const helloRouter = require('express').Router()

interface HelloResponse {
  hello: string;
}

type HelloBuilder = (name: string) => HelloResponse;

const helloBuilder: HelloBuilder = name => ({ hello: name });

//the start of this api path is defined in app.ts
helloRouter.get('/', async(_req: Request, res: Response) => {
  res.json('API is working 🤓')
})

helloRouter.get('/:name',async (req: Request, res: Response) => {
  const { params } = req;
  const { name = 'World' } = params;
  const response = helloBuilder(name);
  
  res.json(response);
})

export { helloRouter }
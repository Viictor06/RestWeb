import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

export class TodosController {

    constructor(){}

    public getTodos = async (req: Request, res: Response) => { 

        const todos = await prisma.todo.findMany();
        
        res.json(todos);
        return;
    }

    public getTodoById = async (req: Request, res: Response) => {

        const id  = +req.params.id;

        if(isNaN(id)){ 
            res.status(400).json({ message: "Invalid id" });
            return;
        }

        const todo = await prisma.todo.findFirst({ where: { id } });
        (todo) ? res.json(todo) : res.status(404).json({ message: "Todo not found" });
        return
    }

    public postTodo = async (req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);

        if(error){ 
            res.status(400).json({error}) 
            return;
        }

        const todo = await prisma.todo.create({ 
            data: createTodoDto!
        });

        res.status(201).json(todo);
        return;
    }

    public updateTodo = async (req: Request, res: Response) => {
        
        const id = +req.params.id;

        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});

        if(error){
            res.status(400).json({error});
            return;
        }
        
        const todo = await prisma.todo.findFirst({ where: { id } });

        if(!todo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }

        const updated = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values
        });
        
        res.json(updated);
        return;
        
    }

    public deleteTodo = async (req: Request, res: Response) => {
        
        const id = +req.params.id;

        if(isNaN(id)){
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        
        const todo = await prisma.todo.findFirst({ where: { id } });

        if(!todo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }

        const deleted = await prisma.todo.delete({ where: { id } });

        res.json(deleted);
        return;
    }
}
import { Controller, Get, Post, Patch, Body, Param, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './db/dtos/create-todo.dto';
import { UpdateTodoDto } from './db/dtos/update-todo.dto';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    // BUG: Invalid number as char priority
    // BUG: null as input causes server-side error
    @Post()
    async create(@Body() createTodoDto: CreateTodoDto) {
        return this.todoService.create(createTodoDto);
    }

    @Get()
    async findAll() {
        return this.todoService.findAll();
    }

    @Delete()
    async deleteAll() {
        await this.todoService.deleteAll();
        return { message: 'All TODOs cleared' };
    }

    @Get(':id')
    async findOneById(@Param('id') id: string) {
        const todo = this.todoService.findOneById(id);
        if (!todo) {
            return { statusCode: 404, message: 'Todo not found' };
        }
        return todo;
    }

    @Delete(':id')
    async deleteOneById(@Param('id') id: string) {
        return this.todoService.deleteOneById(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
        const todo = await this.todoService.update(id, updateTodoDto);
        if (!todo) {
            return { statusCode: 404, message: 'Todo not found' };
        }
        return todo;
    }
}

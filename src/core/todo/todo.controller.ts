import { Controller, Get, Post, Patch, Body, Param, Delete, NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './db/dtos/create-todo.dto';
import { UpdateTodoDto } from './db/dtos/update-todo.dto';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

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
        return await this.todoService.findById(id);
    }

    @Delete(':id')
    async deleteOneById(@Param('id') id: string) {
        return this.todoService.findByIdAndDelete(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
        const todo = await this.todoService.update(id, updateTodoDto);
        if (!todo) {
            throw new NotFoundException();
        }
        return todo;
    }
}

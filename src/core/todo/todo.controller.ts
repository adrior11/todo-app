import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './db/todo.schema';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() todo: Todo) {
    return this.todoService.create(todo);
  }

  @Get()
  async findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: number) {
      return this.todoService.findOneById(id);
  }

  @Patch(':id/complete')
  async completeTodo(@Param('id') id: number) {
      const completedTodo = await this.todoService.complete(id);
      if (!completedTodo) {
          return { statusCode: 404, message: 'Todo not found' };
      }
      return completedTodo;
  }
}


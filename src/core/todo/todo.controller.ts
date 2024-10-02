// Controller sollten Stumpf sein
import { Controller, Get, Post, Body } from '@nestjs/common';
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
}


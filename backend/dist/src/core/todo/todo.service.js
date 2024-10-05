'use strict';
var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
            d;
        if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
var __metadata =
    (this && this.__metadata) ||
    function (k, v) {
        if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
    };
var __param =
    (this && this.__param) ||
    function (paramIndex, decorator) {
        return function (target, key) {
            decorator(target, key, paramIndex);
        };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.TodoService = void 0;
const common_1 = require('@nestjs/common');
const mongoose_1 = require('@nestjs/mongoose');
const mongoose_2 = require('mongoose');
const todo_schema_1 = require('./db/todo.schema');
let TodoService = class TodoService {
    constructor(todoModel) {
        this.todoModel = todoModel;
    }
    async create(createTodoDto) {
        const { priority } = createTodoDto;
        if (priority != null) {
            if (priority.length !== 1 || !/[A-Z]/.test(priority)) {
                throw new common_1.BadRequestException('Invalid priority. Must be a single uppercase character.');
            }
        } else {
            createTodoDto.priority = undefined;
        }
        const newTodo = new this.todoModel(createTodoDto);
        return newTodo.save();
    }
    async findAll() {
        return this.todoModel.find().exec();
    }
    async deleteAll() {
        await this.todoModel.deleteMany({});
    }
    async findById(id) {
        const todo = await this.todoModel.findById(id).exec();
        if (!todo) {
            throw new common_1.NotFoundException('Todo with id ${id} not found');
        }
        return todo;
    }
    async findByIdAndDelete(id) {
        await this.todoModel.findByIdAndDelete(id);
    }
    async update(id, updateTodoDto) {
        const todo = await this.todoModel.findById(id).exec();
        if (!todo) {
            return null;
        }
        if (updateTodoDto.completed !== undefined) {
            todo.completed = updateTodoDto.completed;
            todo.completionDate = updateTodoDto.completed ? new Date() : null;
        }
        if (updateTodoDto.priority !== undefined) {
            if (updateTodoDto.priority.length !== 1 || !/[A-Z]/.test(updateTodoDto.priority)) {
                throw new common_1.BadRequestException('Invalid priority. Must be a single uppercase character.');
            }
            todo.priority = updateTodoDto.priority;
        }
        if (updateTodoDto.description !== undefined) {
            todo.description = updateTodoDto.description;
        }
        return todo.save();
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate(
    [
        (0, common_1.Injectable)(),
        __param(0, (0, mongoose_1.InjectModel)(todo_schema_1.Todo.name)),
        __metadata('design:paramtypes', [mongoose_2.Model]),
    ],
    TodoService,
);
//# sourceMappingURL=todo.service.js.map

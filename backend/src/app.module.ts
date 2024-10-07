import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoModule } from './core/todo/todo.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://root:example@localhost:27018/todo?authSource=admin'), 
        TodoModule,
    ],
})
export class AppModule {}

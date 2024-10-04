import { IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTodoDto {
    @IsOptional()
    @Length(1, 1)
    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    priority?: string;

    @IsString()
    @MaxLength(255)
    @MinLength(1)
    description!: string;
}

import { IsOptional, IsString, Length, MaxLength, MinLength, Matches } from 'class-validator';

export class CreateTodoDto {
    @IsOptional()
    @Length(1, 1)
    @IsString()
    @Matches(/[A-Z]/)
    priority?: string;

    @IsString()
    @MaxLength(255)
    @MinLength(1)
    description!: string;
}

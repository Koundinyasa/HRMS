import {
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class ImportEmployeeDto {
  @IsInt()
  @IsNotEmpty()
  templateTypeId!: number;
}
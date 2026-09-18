import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateEmployeeGroupDto {
  @IsString()
  @IsNotEmpty()
  groupName!: string;

  @IsArray()
  @IsInt({ each: true })
  employees!: number[];
}
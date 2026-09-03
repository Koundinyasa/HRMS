import {
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateDesignationDto {

  @IsInt()
  id!: number;

  @IsInt()
  departmentId!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

}
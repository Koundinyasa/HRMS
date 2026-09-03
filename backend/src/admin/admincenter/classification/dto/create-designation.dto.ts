import {
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateDesignationDto {

  @IsInt()
  departmentId!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

}
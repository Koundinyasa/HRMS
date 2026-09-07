import {
  IsBoolean,
  IsInt,
} from 'class-validator';

export class UpdateDesignationStatusDto {

  @IsInt()
  id!: number;

  @IsBoolean()
  isActive!: boolean;

}
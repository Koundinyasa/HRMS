import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
 
export class ReprocessItemDto {
  @IsString()
  @MaxLength(25) // same EmployeeID length as dbo.UT_EmployeeList
  employeeId!: string;
 
  @IsDateString()
  date!: string;
}
 
export class ReprocessDto {
  // employee/date pairs stored by the frontend from the previous bulk leave
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReprocessItemDto)
  items!: ReprocessItemDto[];
}
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
 
export class EmployeePunchDashboardDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;
 
  @IsOptional()
  @IsDateString()
  selectedDate?: string;
 
  @IsOptional()
  @IsString()
  @IsIn(['CustomWeek', 'CustomMonth', 'SingleDate'])
  viewType?: string;
 
  @IsOptional()
  @IsBoolean()
  showAll?: boolean;
}
 
 
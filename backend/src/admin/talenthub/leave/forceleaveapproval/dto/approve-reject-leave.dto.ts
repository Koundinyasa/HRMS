import {
  IsArray,
  IsInt,
  ArrayNotEmpty,
} from 'class-validator';

export class ApproveRejectLeaveDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  leaveIds!: number[];
}
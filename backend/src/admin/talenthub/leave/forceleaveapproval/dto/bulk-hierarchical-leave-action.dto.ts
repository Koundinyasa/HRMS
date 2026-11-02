import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class BulkHierarchicalLeaveActionDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(200)
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Type(() => Number)
  approvalIds!: number[];

  // 4 = approve, 5 = reject. Nothing else is valid.
  @Type(() => Number)
  @IsIn([4, 5])
  actionStatusId!: number;

  // Required when rejecting; optional (but still limited) when approving.
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf(
    (o) =>
      o.actionStatusId === 5 || (o.remarks !== undefined && o.remarks !== ''),
  )
  @IsString()
  @IsNotEmpty({ message: 'Remarks are required when rejecting.' })
  @MaxLength(500)
  remarks?: string;
}

import { IsInt, Min } from 'class-validator';

export class StartBgvDto {
  @IsInt()
  @Min(1)
  applicationId!: number;
}

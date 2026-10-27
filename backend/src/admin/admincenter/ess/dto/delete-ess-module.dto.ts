import { Matches } from 'class-validator';

// Query params for the soft delete (USP_EssModuleSave with @IsInactivate = 1).
// Both values are required; @FromDate is not needed for a delete.
export class DeleteEssModuleDto {
  // @ESSInsightID INT (required): 1 = Circular, 2 = Notification, 3 = Flash News,
  // 4 = Poll, 5 = Policy
  @Matches(/^[1-9]\d*$/, { message: 'essInsightId must be a positive whole number.' })
  essInsightId!: string;

  // @ID INT (required): ID of the record to inactivate
  @Matches(/^[1-9]\d*$/, { message: 'id must be a positive whole number.' })
  id!: string;
}
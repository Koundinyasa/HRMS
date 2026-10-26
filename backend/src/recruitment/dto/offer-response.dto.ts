import { IsIn } from 'class-validator';

export class OfferResponseDto {
  @IsIn(['accepted', 'rejected'])
  response!: 'accepted' | 'rejected';
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import * as sql from 'mssql';

import { CreatePollDto } from './dto/create-poll.dto';

@Injectable()
export class AdmincenterEssPollsService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  async createPoll(
    dto: CreatePollDto,
    createdBy: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('StartDate', sql.Date, dto.startDate)
        .input('EndDate', sql.Date, dto.endDate)
        .input(
          'TargetAudienceFilterID',
          sql.Int,
          dto.targetAudienceFilterId,
        )
        .input(
          'QuestionTypeID',
          sql.Int,
          dto.questionTypeId,
        )
        .input(
          'Question',
          sql.VarChar(250),
          dto.question,
        )
        .input('CreatedBy', sql.Int, createdBy)
        .execute('USP_PollInsert');

      return result.recordset?.[0];
    } catch (error) {
      console.error('Poll API Error:', error);

      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to create poll.',
      );
    }
  }
}
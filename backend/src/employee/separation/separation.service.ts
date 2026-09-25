import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';

@Injectable()
export class SeparationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async submitResignation(
    employeeId: string,
    requestedLastWorkingDate: string | undefined,
    reason: string,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', sql.VarChar(25), employeeId)
      .input(
        'RequestedLastWorkingDate',
        sql.Date,
        requestedLastWorkingDate ?? null,
      )
      .input('Reason', sql.VarChar(500), reason)
      .execute('USP_SubmitResignation');

    return result.recordset;
  }
  async updateApproval(
    resignationId: number,
    approverEmployeeId: string,
    stageOrder: number,
    actionStatus: number,
    remarks?: string,
    isExitInterviewCompleted?: boolean,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ResignationID', sql.Int, resignationId)
        .input('ApproverEmployeeID', sql.VarChar(25), approverEmployeeId)
        .input('StageOrder', sql.Int, stageOrder)
        .input('ActionStatus', sql.Int, actionStatus)
        .input('Remarks', sql.VarChar(sql.MAX), remarks ?? null)
        .input(
          'IsExitInterviewCompleted',
          sql.Bit,
          isExitInterviewCompleted ?? false,
        )
        .execute('USP_UpdateSeparationApproval');

      return result.recordset;
    } catch (error) {
      console.error('Error in updateApproval:', error);
      throw error;
    }
  }
  async relieveEmployee(
    resignationId: number,
    hrEmployeeId: string,
    relievingLetterIssued?: boolean,
    experienceLetterIssued?: boolean,
    remarks?: string,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('ResignationID', sql.Int, resignationId)
      .input('HRUserEmployeeID', sql.VarChar(25), hrEmployeeId)

      .input('RelievingLetterIssued', sql.Bit, relievingLetterIssued ?? false)
      .input('ExperienceLetterIssued', sql.Bit, experienceLetterIssued ?? false)
      .input('Remarks', sql.VarChar(500), remarks ?? null)
      .execute('USP_RelieveEmployee');

    return result.recordset;
  }
  async withdrawResignation(
    resignationId: number,
    employeeId: string,
    withdrawalReason: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ResignationID', sql.Int, resignationId)
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .input('WithdrawalReason', sql.VarChar(500), withdrawalReason)
        .execute('USP_WithdrawResignation');

      return result.recordset;
    } catch (error) {
      console.error('Error withdrawing resignation:', error);
      throw error;
    }
  }
  async getApprovalList(approverId: string) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('ApproverID', sql.VarChar(25), approverId)
      .input('EmployeeID', sql.VarChar(25), null)
      .input('IsActive', sql.Bit, true)
      .execute('USP_GetEmployeeResignationList');

    return result.recordset;
  }

  async getResignationDetails(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .execute('USP_GetResignationDetailsById');

      const jsonString =
        result.recordset[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B'];

      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error in getResignationDetails:', error);
      throw error;
    }
  }
}

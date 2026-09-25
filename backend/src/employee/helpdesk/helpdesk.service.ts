import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class HelpdeskService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getDepartments() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Flag', sql.Int, 1)
        .execute('USP_GetHelpDeskMasterData');

      return result.recordset;
    } catch (error) {
      console.error('Error in getDepartments:', error);
      throw error;
    }
  }
  async getCategories(departmentId: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Flag', sql.Int, 2)
        .input('DepartmentID', sql.Int, departmentId)
        .execute('USP_GetHelpDeskMasterData');

      return result.recordset;
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  }
  async getSubCategories(categoryId: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Flag', sql.Int, 3)
        .input('CategoryID', sql.Int, categoryId)
        .execute('USP_GetHelpDeskMasterData');

      return result.recordset;
    } catch (error) {
      console.error('Error in getSubCategories:', error);
      throw error;
    }
  }
  async getKnowledgeBase() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool.request().execute('USP_GetKnowledgeBase');

      return result.recordset;
    } catch (error) {
      console.error('Error in getKnowledgeBase:', error);
      throw error;
    }
  }
  async raiseTicket(employeeId: string, body: CreateTicketDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .input('DepartmentID', sql.Int, body.departmentId)
        .input('CategoryID', sql.Int, body.categoryId)
        .input('SubCategoryID', sql.Int, body.subCategoryId)
        .input('AssetNumber', sql.VarChar(50), body.assetNumber ?? null)
        .input('Location', sql.VarChar(200), body.location)
        .input('ContactNo', sql.VarChar(15), body.contactNo)
        .input('Subject', sql.VarChar(200), body.subject)
        .input('Description', sql.VarChar(sql.MAX), body.description)
        .execute('USP_InsertTicket');

      return result.recordset;
    } catch (error) {
      console.error('Error in raiseTicket:', error);
      throw error;
    }
  }
  async getMyTickets(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .execute('USP_GetTicketsByEmployee');

      return result.recordset;
    } catch (error) {
      console.error('Error in getMyTickets:', error);
      throw error;
    }
  }
  async getPendingTickets(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .execute('USP_GetPendingOpenTicketsForApprover');

      return result.recordset;
    } catch (error) {
      console.error('Error in getPendingTickets:', error);
      throw error;
    }
  }
  async ticketAction(
    ticketId: number,
    employeeId: string,
    actionStatusId: number,
    remarks?: string,
    fileName?: string,
    filePath?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('TicketID', sql.Int, ticketId)
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .input('ActionStatusID', sql.Int, actionStatusId)
        .input('FileName', sql.VarChar(255), fileName ?? null)
        .input('FilePath', sql.VarChar(500), filePath ?? null)
        .input('Remarks', sql.VarChar(500), remarks ?? null)
        .execute('USP_ApproveRejectTicket');

      return result.recordset;
    } catch (error) {
      console.error('Error in ticketAction:', error);

      throw error;
    }
  }
  async assignTicket(
    ticketId: number,
    departmentHeadEmployeeId: string,
    assignToEmployeeId: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('TicketID', sql.Int, ticketId)
        .input(
          'DepartmentHeadEmployeeID',
          sql.VarChar(25),
          departmentHeadEmployeeId,
        )
        .input('AssignToEmployeeID', sql.VarChar(25), assignToEmployeeId)
        .execute('USP_AssignTicket');

      return result.recordset;
    } catch (error) {
      console.error('Error in assignTicket:', error);
      throw error;
    }
  }
  async replyTicket(
    ticketId: number,
    employeeId: string,
    remarks: string,
    fileName?: string,
    filePath?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('TicketID', sql.Int, ticketId)
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .input('Remarks', sql.VarChar(500), remarks)
        .input('FileName', sql.VarChar(255), fileName ?? null)
        .input('FilePath', sql.VarChar(500), filePath ?? null)
        .execute('USP_ReplyTicket');

      return result.recordset;
    } catch (error) {
      console.error('Error in replyTicket:', error);
      throw error;
    }
  }
  async reopenTicket(
    ticketId: number,
    employeeId: string,
    remarks: string,
    fileName?: string,
    filePath?: string,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('TicketID', sql.Int, ticketId)
        .input('EmployeeID', sql.VarChar(25), employeeId)
        .input('Remarks', sql.VarChar(500), remarks)
        .input('FileName', sql.VarChar(255), fileName ?? null)
        .input('FilePath', sql.VarChar(500), filePath ?? null)
        .execute('USP_ReopenTicket');

      return result.recordset;
    } catch (error) {
      console.error('Error in reopenTicket:', error);
      throw error;
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { LeaveService as EmployeeLeaveService } from '../../employee/leave/leave.service';
import { TtlCache } from '../../common/ttl-cache';

type ChatUser = Record<string, any>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_REASON_LENGTH = 500; // USP_LeaveRequestSubmission @Reason is NVARCHAR(500)

/**
 * The chatbot's door to the employee leave module.
 *
 * It calls the leave service inside the same process, as the signed-in user.
 * (It used to call this backend over HTTP at a hard-coded address, with a
 * freshly signed token, which broke whenever the port or protocol changed and
 * ran the login guard and validation a second time.)
 *
 * Who the call is for always comes from the signed-in user's own login
 * (`employeeId`, `companyId`, `createdBy`), exactly as the controller does it.
 * Nothing here accepts another employee's id.
 *
 * Because the controller's validation pipe is not in the path any more, the
 * inputs are checked here.
 */
@Injectable()
export class LeaveApiService {
  // The leave types of an employee hardly ever change; the chatbot asks for
  // them on every message, so they are kept for 60 seconds per company and
  // employee. Failed calls are not kept.
  private readonly leaveTypesCache = new TtlCache(60_000);

  constructor(private readonly leaves: EmployeeLeaveService) {}

  // The old HTTP path returned JSON, so dates arrived as plain strings.
  // Passing the result through JSON keeps every caller's parsing unchanged.
  private plain<T>(value: T): T {
    return value === undefined
      ? value
      : (JSON.parse(JSON.stringify(value)) as T);
  }

  private employeeId(user: ChatUser): string {
    const id = String(user?.employeeId ?? '').trim();
    if (!id) throw new BadRequestException('Invalid employeeId');
    return id;
  }

  private companyId(user: ChatUser): number {
    const id = Number(user?.companyId);
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid companyId');
    }
    return id;
  }

  async getLeaveTypes(user: ChatUser) {
    const employeeId = this.employeeId(user);
    const companyId = this.companyId(user);
    const types = await this.leaveTypesCache.get(
      `${companyId}:${employeeId}`,
      () => this.leaves.getLeaveTypes(employeeId, companyId),
    );
    // plain() hands every caller its own copy of the cached result.
    return this.plain(types);
  }

  async getLeaveBalance(user: ChatUser) {
    return this.plain(
      await this.leaves.getEmployeeLeaveBalance(this.employeeId(user)),
    );
  }

  async getLeaveHistory(user: ChatUser) {
    return this.plain(await this.leaves.getLeaveHistory(this.employeeId(user)));
  }

  async getEmployeeLeaveDetails(user: ChatUser) {
    return this.plain(
      await this.leaves.getEmployeeLeaveDetails(this.employeeId(user)),
    );
  }

  async getLeaveStatus(user: ChatUser) {
    return this.plain(await this.leaves.getLeaveStatus(this.employeeId(user)));
  }

  async getPendingLeaveRequests(user: ChatUser) {
    return this.plain(
      await this.leaves.getPendingLeaveRequests(this.employeeId(user)),
    );
  }

  async applyLeave(
    user: ChatUser,
    params: {
      leaveTypeId: number;
      fromDate: string;
      toDate: string;
      sessionFrom?: string;
      sessionTo?: string;
      isHalfDay: boolean;
      reason?: string;
    },
  ): Promise<any> {
    const employeeId = this.employeeId(user);
    const createdBy = Number(user?.createdBy);
    if (!Number.isInteger(createdBy) || createdBy <= 0) {
      throw new BadRequestException('Invalid user');
    }

    const leaveTypeId = Number(params.leaveTypeId);
    if (!Number.isInteger(leaveTypeId) || leaveTypeId <= 0) {
      throw new BadRequestException('Invalid leave type.');
    }
    if (!ISO_DATE.test(String(params.fromDate ?? '')) ||
        !ISO_DATE.test(String(params.toDate ?? ''))) {
      throw new BadRequestException('Invalid leave dates.');
    }
    const reason = params.reason?.trim() || undefined;
    if (reason && reason.length > MAX_REASON_LENGTH) {
      throw new BadRequestException(
        `The reason is too long (maximum ${MAX_REASON_LENGTH} characters).`,
      );
    }

    // The chatbot never attaches a document.
    return this.plain(
      await this.leaves.applyLeave(
        employeeId,
        createdBy,
        leaveTypeId,
        params.fromDate,
        params.toDate,
        params.sessionFrom || undefined,
        params.sessionTo || undefined,
        params.isHalfDay === true,
        reason,
        undefined,
      ),
    );
  }

  // NOTE: applying leave for someone else (applyhr), approving and
  // withdrawing are not chatbot features here. The chatbot's own withdraw flow
  // goes through HrmsDbService.
}

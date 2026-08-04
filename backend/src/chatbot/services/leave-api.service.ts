import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

const BASE_URL = 'http://localhost:3001/api/employee/leave';

@Injectable()
export class LeaveApiService {
  constructor(
    private readonly http: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  // Mints a token carrying the same claims the browser's own session cookie
  // has, so these server-to-server calls satisfy the leave module's
  // JwtAuthGuard exactly as if the real user's browser made the request.
  // This works because both modules share the same JWT_SECRET.
  private mintCookieHeader(user: Record<string, any>): { Cookie: string } {
    const token = this.jwtService.sign({
      employeeId: user.employeeId,
      userId: user.userId,
      createdBy: user.createdBy,
      roleId: user.roleId,
      companyId: user.companyId,
      name: user.name,
    });
    return { Cookie: `access_token=${token}` };
  }

  // Public — no auth required per the real controller.
  async getLeaveTypes() {
    const res = await firstValueFrom(this.http.get(`${BASE_URL}/leavetypes`));
    return res.data;
  }

  // Public — no auth required per the real controller.
  async getHolidayList() {
    const res = await firstValueFrom(this.http.get(`${BASE_URL}/holidaylist`));
    return res.data;
  }

  async getLeaveBalance(user: Record<string, any>) {
    const res = await firstValueFrom(
      this.http.get(`${BASE_URL}/balance`, { headers: this.mintCookieHeader(user) }),
    );
    return res.data;
  }

  async getLeaveHistory(user: Record<string, any>) {
    const res = await firstValueFrom(
      this.http.get(`${BASE_URL}/history`, { headers: this.mintCookieHeader(user) }),
    );
    return res.data;
  }

  async getLeaveStatus(user: Record<string, any>) {
    const res = await firstValueFrom(
      this.http.get(`${BASE_URL}/status`, { headers: this.mintCookieHeader(user) }),
    );
    return res.data;
  }

  async getPendingLeaveRequests(user: Record<string, any>) {
    const res = await firstValueFrom(
      this.http.get(`${BASE_URL}/pending`, { headers: this.mintCookieHeader(user) }),
    );
    return res.data;
  }

  async withdrawOrCancelLeave(
    user: Record<string, any>,
    leaveApplicationId: number,
    actionId: number,
    reason?: string,
  ) {
    const res = await firstValueFrom(
      this.http.post(
        `${BASE_URL}/withdrawcancel`,
        { leaveApplicationId, actionId, reason },
        { headers: this.mintCookieHeader(user) },
      ),
    );
    return res.data;
  }

  async approveLeave(
    user: Record<string, any>,
    approvalId: number,
    actionStatusId: number,
    remarks?: string,
  ) {
    const res = await firstValueFrom(
      this.http.post(
        `${BASE_URL}/approval`,
        { approvalId, actionStatusId, remarks },
        { headers: this.mintCookieHeader(user) },
      ),
    );
    return res.data;
  }

  async applyLeave(
    user: Record<string, any>,
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
    // The real /apply endpoint uses FileInterceptor, so it expects
    // multipart/form-data even though the chatbot never attaches a document.
    const form = new FormData();
    form.append('leaveTypeId', String(params.leaveTypeId));
    form.append('fromDate', params.fromDate);
    form.append('toDate', params.toDate);
    if (params.sessionFrom) form.append('sessionFrom', params.sessionFrom);
    if (params.sessionTo) form.append('sessionTo', params.sessionTo);
    form.append('isHalfDay', String(params.isHalfDay));
    if (params.reason) form.append('reason', params.reason);

    const res = await firstValueFrom(
      this.http.post(`${BASE_URL}/apply`, form, {
        headers: this.mintCookieHeader(user),
      }),
    );
    // TEMPORARY DEBUG LINE — remove once we've seen the real shape of the
    // response and fixed confirmLeave's parsing accordingly.
    console.log('APPLY LEAVE RAW RESPONSE:', JSON.stringify(res.data));
    return res.data;
  }

  // NOTE: applyhr intentionally not built — HR applies their own leave
  // through their separate employee login, using the method above. Applying
  // leave on someone else's behalf isn't a chatbot feature.
}
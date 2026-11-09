import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IntentDefinition } from '../types';
import type {
  EmployeeBusinessProfile,
  EmployeeInfoRecord,
  EmployeeInfoResultSets,
  EmployeeProfileField,
  EmployeeProfileSection,
  EmployeeProfileValue,
} from '../types';
import { fuzzyContains } from '../utils/fuzzy.util';
import { DraftService } from './draft.service';
import { HrmsDbService } from '../../db/hrms-db.service';

type EmployeeLookupResult = {
  employeeId: string;
  fullName: string;
  designation: string;
};

const PROFILE_FIELD_ALLOWLISTS: Record<
  string,
  Array<[key: string, label: string]>
> = {
  personal: [
    ['EmployeeID', 'Employee ID'],
    ['EmployeeId', 'Employee ID'],
    ['EmployeeName', 'Full Name'],
    ['FullName', 'Full Name'],
    ['ProfilePhoto', 'Profile Photo'],
    ['FirstName', 'First Name'],
    ['LastName', 'Last Name'],
    ['DOB', 'Date of Birth'],
    ['Gender', 'Gender'],
    ['DOJ', 'Date of Joining'],
    ['DOL', 'Date of Leaving'],
    ['Grade', 'Employment Grade'],
    ['GradeValue', 'Employment Grade'],
    ['EmploymentGrade', 'Employment Grade'],
    ['CompanyName', 'Company Name'],
    ['BranchName', 'Branch'],
    ['DepartmentName', 'Department'],
    ['Designation', 'Designation'],
    ['DesignationName', 'Designation'],
    ['ReportingManagerName', 'Reporting Manager Name'],
    ['EmploymentTypeName', 'Employment Type'],
    ['EmploymentType', 'Employment Type'],
    ['Employementtype', 'Employment Type'],
    ['EmploymentTypeID', 'Employment Type ID'],
    ['EmploymentStatusName', 'Employment Status'],
    ['EmploymentStatus', 'Employment Status'],
    ['EmploymentStatusID', 'Employment Status ID'],
    ['Email', 'Official Email'],
    ['EMailID', 'Official Email'],
    ['EmailId', 'Official Email'],
    ['OfficialEmailId', 'Official Email'],
    ['MobileNo', 'Mobile Number'],
    ['AltMobileNo', 'Alternate Mobile'],
    ['EmergencyNo', 'Emergency Number'],
    ['AlternateEmailId', 'Alternate Email'],
  ],
  address: [
    ['AddressType', 'Address Type'],
    ['ResidentialNameNo', 'Residential Name / Number'],
    ['Street', 'Street'],
    ['StreetName', 'Street'],
    ['AddressLine1', 'Address Line 1'],
    ['AddressLine2', 'Address Line 2'],
    ['Address1', 'Address Line 1'],
    ['Address2', 'Address Line 2'],
    ['Locality', 'Locality'],
    ['City', 'City'],
    ['District', 'District'],
    ['State', 'State'],
    ['Country', 'Country'],
    ['PinCode', 'Pin Code'],
    ['PostalCode', 'Postal Code'],
    ['MobileNo', 'Mobile Number'],
    ['MobileNumber', 'Mobile Number'],
    ['AltMobileNo', 'Alternate Mobile'],
    ['AlternateMobile', 'Alternate Mobile'],
    ['Email', 'Official Email'],
    ['OfficialEmail', 'Official Email'],
    ['EmailId', 'Official Email'],
    ['OfficialEmailId', 'Official Email'],
    ['AlternateEmail', 'Alternate Email'],
    ['AlternateEmailId', 'Alternate Email'],
    ['EmergencyNo', 'Emergency Number'],
    ['EmergencyNumber', 'Emergency Number'],
  ],
  bank: [
    ['AccountHolderName', 'Account Holder Name'],
    ['AccountNumber', 'Account Number'],
    ['AccountType', 'Account Type'],
    ['IFSC', 'IFSC Code'],
    ['BankCode', 'Bank Code'],
    ['BankName', 'Bank Name'],
    ['BranchName', 'Branch Name'],
    ['City', 'City'],
    ['State', 'State'],
    ['Address', 'Bank Address'],
    ['BankAddress', 'Bank Address'],
  ],
  family: [
    ['MemberName', 'Name'],
    ['FamilyMemberName', 'Name'],
    ['Relation', 'Relationship'],
    ['Relationship', 'Relationship'],
    ['DOB', 'Date of Birth'],
    ['Gender', 'Gender'],
    ['MobileNo', 'Mobile Number'],
    ['ContactNo', 'Contact Number'],
    ['ContactNumber', 'Contact Number'],
    ['Age', 'Age'],
    ['EmailId', 'Email'],
  ],
  documents: [
    ['DocumentType', 'Document Type'],
    ['DocumentName', 'Document Name'],
    ['DocumentTitle', 'Document'],
    ['IssueDate', 'Issue Date'],
    ['ExpiryDate', 'Expiry Date'],
    ['Status', 'Status'],
    ['VerificationStatus', 'Verification Status'],
  ],
  experience: [
    ['IsExperienced', 'Is Experienced'],
    ['IsExperience', 'Is Experienced'],
    ['CompanyName', 'Company'],
    ['PreviousCompanyName', 'Previous Company Name'],
    ['Designation', 'Designation'],
    ['DesignationName', 'Designation'],
    ['Department', 'Department'],
    ['DepartmentName', 'Department'],
    ['EmploymentType', 'Employment Type'],
    ['EmploymentTypeName', 'Employment Type'],
    ['Industry', 'Industry'],
    ['FromDate', 'From Date'],
    ['ToDate', 'To Date'],
    ['StartDate', 'Start Date'],
    ['EndDate', 'End Date'],
    ['IsCurrentEmployer', 'Is Current Employer'],
    ['TotalExperienceYears', 'Total Experience Years'],
    ['TotalExperience', 'Total Experience Years'],
    ['ReasonForLeaving', 'Reason for Leaving'],
    ['Experience', 'Experience'],
    ['Role', 'Role'],
    ['Description', 'Description'],
  ],
  education: [
    ['EducationLevel', 'Education Level'],
    ['Level', 'Education Level'],
    ['BoardOrUniversity', 'Board / University'],
    ['InstitutionName', 'Institution'],
    ['Degree', 'Degree'],
    ['Qualification', 'Qualification'],
    ['Course', 'Course'],
    ['Specialization', 'Specialization'],
    ['StartDate', 'Start Date'],
    ['EndDate', 'End Date'],
    ['YearOfPassing', 'Year of Passing'],
    ['GradeValue', 'Grade'],
    ['GradeType', 'Grade Type'],
    ['Country', 'Country'],
    ['State', 'State'],
    ['Percentage', 'Percentage'],
  ],
};

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(
    private readonly draftService: DraftService,
    private readonly hrmsDbService: HrmsDbService,
  ) {}

  async searchEmployees(
    searchTerm: string,
    user: Record<string, unknown>,
  ): Promise<EmployeeLookupResult[]> {
    this.assertPrivileged(user);

    const term = searchTerm?.trim();
    if (!term || term.length > 100) {
      throw new BadRequestException(
        'Search term must be between 1 and 100 characters.',
      );
    }

    const companyId = this.authenticatedCompanyId(user);

    const directory = await this.hrmsDbService.getEmployeeDirectory(companyId, {
      failOnError: true,
      bypassCache: true,
    });
    const normalizedTerm = term.toLowerCase();

    return directory
      .filter(
        (employee) =>
          employee.id.toLowerCase().includes(normalizedTerm) ||
          employee.name.toLowerCase().includes(normalizedTerm),
      )
      .map((employee) => ({
        employeeId: employee.id,
        fullName: employee.name,
        designation: employee.designation,
      }));
  }

  async getEmployeeBusinessProfile(
    employeeId: string,
    user: Record<string, unknown>,
  ): Promise<EmployeeBusinessProfile> {
    this.assertPrivileged(user);

    const normalizedEmployeeId =
      typeof employeeId === 'string' ? employeeId.trim() : '';
    if (!normalizedEmployeeId || normalizedEmployeeId.length > 25) {
      throw new BadRequestException('Invalid employee selection.');
    }

    const companyId = this.authenticatedCompanyId(user);
    const directoryMatches = await this.searchEmployees(
      normalizedEmployeeId,
      user,
    );
    const selectedEmployee = directoryMatches.find(
      (employee) =>
        employee.employeeId.toLowerCase() ===
        normalizedEmployeeId.toLowerCase(),
    );
    if (!selectedEmployee) {
      throw new NotFoundException(
        'Employee not found in your company directory.',
      );
    }

    let resultSets: EmployeeInfoResultSets | null;
    try {
      resultSets = await this.hrmsDbService.getEmployeeBusinessProfile(
        selectedEmployee.employeeId,
        companyId,
      );
    } catch {
      this.logger.error('Employee business profile query failed.');
      throw new InternalServerErrorException(
        'Unable to retrieve employee profile.',
      );
    }

    if (!resultSets || resultSets[0].length === 0) {
      throw new NotFoundException(
        'Employee not found in your company directory.',
      );
    }
    const personal = resultSets[0][0];
    const [employeeInfo, employeeOffice] = await Promise.all([
      this.hrmsDbService.getUserInfo(selectedEmployee.employeeId),
      this.hrmsDbService.getEmployeeOffice(selectedEmployee.employeeId),
    ]);
    const employeeGrade =
      this.read(personal, 'Grade') ??
      this.read(personal, 'EmploymentGrade') ??
      this.read(personal, 'GradeValue');
    const employmentTypeValue =
      this.read(personal, 'EmploymentType') ??
      this.read(personal, 'Employementtype');
    const employmentStatusValue = this.read(personal, 'EmploymentStatus');
    const employmentTypeId =
      this.asText(this.read(personal, 'EmploymentTypeID')) ??
      this.asIdentifier(employmentTypeValue);
    const employmentStatusId =
      this.asText(this.read(personal, 'EmploymentStatusID')) ??
      this.asIdentifier(employmentStatusValue);

    return {
      sections: this.mapProfileSections(resultSets),
      identity: {
        employeeId:
          this.asText(
            this.read(personal, 'EmployeeID') ??
              this.read(personal, 'EmployeeId'),
          ) ?? selectedEmployee.employeeId,
        fullName:
          this.asText(this.read(personal, 'EmployeeName')) ??
          this.asText(this.read(personal, 'FullName')) ??
          selectedEmployee.fullName,
        firstName: this.asText(this.read(personal, 'FirstName')),
        lastName: this.asText(this.read(personal, 'LastName')),
        profilePhoto: this.asText(this.read(personal, 'ProfilePhoto')),
        dateOfBirth: this.asDate(this.read(personal, 'DOB')),
        gender: this.asText(this.read(personal, 'Gender')),
      },
      employment: {
        dateOfJoining: this.asDate(this.read(personal, 'DOJ')),
        dateOfLeaving: this.asDate(this.read(personal, 'DOL')),
        grade:
          typeof employeeGrade === 'string' || typeof employeeGrade === 'number'
            ? employeeGrade
            : null,
      },
      organization: {
        companyName: this.asText(this.read(personal, 'CompanyName')),
        branchName:
          this.asText(this.read(personal, 'BranchName')) ??
          this.asText(employeeOffice?.branchName),
        departmentName:
          this.asText(this.read(personal, 'DepartmentName')) ??
          this.asText(employeeInfo?.self.department),
        designationName: this.asText(
          this.read(personal, 'Designation') ??
            this.read(personal, 'DesignationName'),
        ),
        reportingManagerName: this.asText(
          this.read(personal, 'ReportingManagerName'),
        ),
        employmentType:
          this.asText(employmentTypeValue) ??
          this.asText(this.read(personal, 'EmploymentTypeName')) ??
          this.asReadableName(employmentTypeValue),
        employmentTypeId,
        employmentStatus:
          this.asText(this.read(personal, 'EmploymentStatusName')) ??
          this.asReadableName(employmentStatusValue),
        employmentStatusId,
      },
      contact: {
        email:
          this.asText(this.read(personal, 'Email')) ??
          this.asText(this.read(personal, 'EMailID')) ??
          this.asText(this.read(personal, 'OfficialEmailId')) ??
          this.asText(this.read(personal, 'EmailId')),
        mobileNo: this.asText(this.read(personal, 'MobileNo')),
        alternateMobileNo: this.asText(this.read(personal, 'AltMobileNo')),
        emergencyNo: this.asText(this.read(personal, 'EmergencyNo')),
        alternateEmail: this.asText(this.read(personal, 'AlternateEmailId')),
      },
      unavailableSections: {
        education: this.unavailableSection(
          'Education active/deleted flag semantics are unverified.',
        ),
        experience: this.unavailableSection(
          'Experience deleted flag semantics are unverified.',
        ),
        address: this.unavailableSection(
          'Address deleted flag semantics are unverified.',
        ),
      },
    };
  }

  private mapProfileSections(
    resultSets: EmployeeInfoResultSets,
  ): EmployeeProfileSection[] {
    const [personal, address, bank, family, documents, experience, education] =
      resultSets;
    return [
      this.section('Personal Information', 'user', 'personal', personal),
      this.section('Address', 'map-pin', 'address', address),
      this.section('Bank Information', 'landmark', 'bank', bank),
      this.section('Family Details', 'users', 'family', family),
      this.section('Documents', 'file-text', 'documents', documents),
      this.section('Experience Details', 'briefcase', 'experience', experience),
      this.section(
        'Education Details',
        'graduation-cap',
        'education',
        education,
      ),
    ];
  }

  private section(
    title: string,
    icon: string,
    allowlist: keyof typeof PROFILE_FIELD_ALLOWLISTS,
    rows: EmployeeInfoRecord[],
  ): EmployeeProfileSection {
    const records = rows
      .map((row) => {
        const fields = this.allowedFields(row, allowlist);
        const heading =
          allowlist === 'address'
            ? (this.asText(this.read(row, 'AddressType')) ?? undefined)
            : undefined;
        return { ...(heading ? { heading } : {}), fields };
      })
      .filter((record) => record.fields.length > 0);
    return { title, icon, records };
  }

  private allowedFields(
    row: EmployeeInfoRecord,
    section: keyof typeof PROFILE_FIELD_ALLOWLISTS,
  ): EmployeeProfileField[] {
    const fields = PROFILE_FIELD_ALLOWLISTS[section].flatMap(([key, label]) => {
      if (section === 'family' && key === 'Age') {
        const relation = this.asText(
          this.read(row, 'Relation') ?? this.read(row, 'Relationship'),
        )?.toLowerCase();
        if (relation === 'father' || relation === 'mother') return [];
      }

      const actualKey = Object.keys(row).find(
        (candidate) => candidate.toLowerCase() === key.toLowerCase(),
      );
      if (!actualKey) return [];
      const rawValue = row[actualKey];
      const value =
        section === 'bank' && key === 'AccountNumber'
          ? this.maskAccountNumber(rawValue)
          : rawValue === null
            ? null
            : this.profileValue(rawValue);
      if (value === undefined) return [];
      const fieldLabel =
        key === 'EmploymentType' && this.asIdentifier(rawValue)
          ? 'Employment Type ID'
          : key === 'EmploymentStatus' && this.asIdentifier(rawValue)
            ? 'Employment Status ID'
            : label;
      return [{ label: fieldLabel, value }];
    });
    const uniqueFields = new Map<string, EmployeeProfileField>();
    for (const field of fields) {
      const key = `${field.label.toLowerCase()}:${String(field.value ?? '')}`;
      if (!uniqueFields.has(key)) uniqueFields.set(key, field);
    }
    return [...uniqueFields.values()];
  }

  private maskAccountNumber(value: unknown): string | null {
    if (value === null || value === undefined) return null;
    if (typeof value !== 'string' && typeof value !== 'number') return null;

    const digits = String(value).replace(/\D/g, '');
    if (!digits) return null;
    if (digits.length <= 4) return '*'.repeat(digits.length);
    return `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
  }

  private profileValue(value: unknown): EmployeeProfileValue | undefined {
    if (value === null || value === undefined) return undefined;
    if (value instanceof Date) {
      return Number.isNaN(value.getTime())
        ? undefined
        : value.toISOString().slice(0, 10);
    }
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      if (
        typeof value === 'string' &&
        /[\\/]|^[a-z]:[\\/]|^file:\/\//i.test(value.trim())
      ) {
        return undefined;
      }
      return value;
    }
    return undefined;
  }

  private read(row: EmployeeInfoRecord, key: string): unknown {
    const targetKey = key.toLowerCase();
    const actualKey = Object.keys(row).find(
      (candidate) => candidate.toLowerCase() === targetKey,
    );
    return actualKey ? row[actualKey] : undefined;
  }

  private assertPrivileged(user: Record<string, unknown>): void {
    if (user.role !== 'admin' && user.role !== 'hr') {
      throw new ForbiddenException('Only HR/Admin can access employee data.');
    }
  }

  private authenticatedCompanyId(user: Record<string, unknown>): number {
    const companyId = Number(user.companyId);
    if (!Number.isInteger(companyId) || companyId <= 0) {
      throw new BadRequestException('Invalid companyId');
    }
    return companyId;
  }

  private asText(value: unknown): string | null {
    if (typeof value !== 'string' && typeof value !== 'number') return null;
    const text = String(value).trim();
    return text || null;
  }

  private asIdentifier(value: unknown): string | null {
    const text = this.asText(value);
    return text && /^\d+$/.test(text) ? text : null;
  }

  private asReadableName(value: unknown): string | null {
    const text = this.asText(value);
    return text && !/^\d+$/.test(text) ? text : null;
  }

  private asDate(value: unknown): string | null {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime())
        ? null
        : value.toISOString().slice(0, 10);
    }
    const text = this.asText(value);
    if (!text) return null;
    const isoDate = /^(\d{4}-\d{2}-\d{2})(?:$|[T ])/.exec(text);
    return isoDate?.[1] ?? text;
  }

  private unavailableSection(reason: string) {
    return { status: 'unavailable' as const, reason };
  }

  private lookupTerm(
    message: string,
    directory: { id: string; name: string }[],
  ): string | null {
    const normalized = message.trim();
    const strictCommand =
      normalized.match(
        /^(?:search|find|lookup)\s+(?:for\s+)?(?:an?\s+)?employees?(?:\s+(?:named|name|id))?\s*[:-]?\s+(.+)$/i,
      ) ?? normalized.match(/^employees?\s+(?:search|lookup)\s*[:-]?\s*(.+)$/i);
    const strictTerm = strictCommand?.[1]?.trim();
    if (strictTerm) return strictTerm;

    const naturalLanguagePatterns = [
      /^(?:get\s+)?employee\s+details\s+of\s+(.+)$/i,
      /^details\s+of\s+employee\s+(.+)$/i,
      /^(?:employee\s+)?id\s+([a-z0-9_-]+)$/i,
      /^details\s+of\s+(.+)$/i,
      /^show\s+me\s+(.+)$/i,
      /^who\s+is\s+(.+?)[?!.]*$/i,
      /^employee\s+(.+)$/i,
    ];

    for (const pattern of naturalLanguagePatterns) {
      const term = normalized.match(pattern)?.[1]?.trim();
      if (term && this.isNaturalSearchCandidate(term)) return term;
    }

    if (!this.isNaturalSearchCandidate(normalized)) return null;

    const foldedInput = normalized.toLocaleLowerCase();
    const inputTokens = this.nameTokens(normalized);
    const matchesDirectoryEntity = directory.some((employee) => {
      if (employee.id.toLocaleLowerCase() === foldedInput) return true;
      if (employee.name.toLocaleLowerCase() === foldedInput) return true;
      return (
        inputTokens.length === 1 &&
        this.nameTokens(employee.name).includes(foldedInput)
      );
    });

    return matchesDirectoryEntity ? normalized : null;
  }

  private isNaturalSearchCandidate(term: string): boolean {
    const value = term.trim();
    if (!value || value.length > 100) return false;
    if (/^[a-z0-9_-]+$/i.test(value)) {
      return !this.containsHrmsTopic(value);
    }

    if (
      !/^[\p{L}\p{M}][\p{L}\p{M}'’.-]*(?:\s+[\p{L}\p{M}][\p{L}\p{M}'’.-]*){0,4}$/u.test(
        value,
      )
    ) {
      return false;
    }

    return !this.containsHrmsTopic(value);
  }

  private containsHrmsTopic(value: string): boolean {
    const topics = new Set([
      'address',
      'apply',
      'attendance',
      'balance',
      'cancel',
      'company',
      'date',
      'department',
      'details',
      'document',
      'employee',
      'experience',
      'holiday',
      'leave',
      'manager',
      'menu',
      'office',
      'payroll',
      'payslip',
      'policy',
      'profile',
      'salary',
      'team',
      'time',
      'today',
      'who',
    ]);
    return this.nameTokens(value).some((token) => topics.has(token));
  }

  private nameTokens(value: string): string[] {
    return value.toLocaleLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];
  }

  private notify(
    employeeId: string,
    tone: 'info' | 'warning' | 'danger',
    suggestions: { label: string; send: string }[] = [
      { label: 'Main Menu', send: 'menu:main' },
    ],
  ) {
    this.draftService.pendingNotice.set(employeeId, { tone });
    if (suggestions.length)
      this.draftService.pendingSuggestedActions.set(employeeId, suggestions);
  }

  getEmployeeCard(employee: Record<string, any>): string {
    return [
      `Name: ${employee.name}`,
      `ID: ${employee.id}`,
      `Role: ${employee.designation}`,
      `Department: ${employee.department}`,
    ].join('\n');
  }

  getOwnProfileGuide(
    employeeId: string,
    employee: Record<string, any>,
  ): string {
    this.draftService.pendingSteps.set(employeeId, {
      title: 'Your profile in the portal',
      items: [
        'Open the Employees menu.',
        'Click your profile card.',
        'Use the profile panel to review your basic details.',
        'Open the payroll/document section for salary, Form16, or payslip actions.',
      ],
      note: `Current snapshot: ${employee.name} | ${employee.department} | ${employee.designation}`,
    });
    return `Here's how to find your profile:`;
  }

  getPrivateDocGuide(employeeId: string, role: string): string {
    const baseSteps = [
      'Open the Employees menu.',
      'Select the employee card.',
      'Open the payroll or documents panel inside the profile.',
      'Download Form16, payslip, or appraisal files from there.',
    ];
    const isPrivileged = role === 'admin' || role === 'hr';
    this.draftService.pendingSteps.set(employeeId, {
      title: isPrivileged
        ? 'Employee private details access'
        : 'Your private documents',
      items: baseSteps,
      note: isPrivileged
        ? 'You can review all employee public details from the directory, then open the secure document area for private files.'
        : 'Regular employees can only open their own secure documents.',
    });
    return isPrivileged
      ? `Here's how to access employee private details:`
      : `Here's how to open your private documents:`;
  }

  getIntents(): IntentDefinition[] {
    return [
      {
        name: 'employeeLookupSelect',
        test: (ctx) => /^employee-select:/i.test(ctx.message.trim()),
        handle: async (ctx) => {
          if (ctx.role !== 'admin' && ctx.role !== 'hr') {
            this.notify(ctx.employeeId, 'danger');
            return `Access denied: only HR/Admin can search employees.`;
          }

          const selection = ctx.message
            .trim()
            .match(/^employee-select:(.+)$/i)?.[1];
          if (!selection) return `Employee selection is invalid.`;

          let employeeId: string;
          try {
            employeeId = decodeURIComponent(selection);
          } catch {
            return `Employee selection is invalid.`;
          }

          const employeeProfile = await this.getEmployeeBusinessProfile(
            employeeId,
            ctx.user,
          );
          const selectedEmployeeId =
            employeeProfile.identity.employeeId ?? employeeId;
          const selectedEmployeeName =
            employeeProfile.identity.fullName ?? selectedEmployeeId;
          return {
            text: `Employee profile retrieved for ${selectedEmployeeName} (${selectedEmployeeId}).`,
            employeeProfile,
          };
        },
      },
      {
        name: 'employeeLookupSearch',
        test: (ctx) => this.lookupTerm(ctx.message, ctx.directory) !== null,
        handle: async (ctx) => {
          if (ctx.role !== 'admin' && ctx.role !== 'hr') {
            this.notify(ctx.employeeId, 'danger');
            return `Access denied: only HR/Admin can search employees.`;
          }

          const searchTerm = this.lookupTerm(ctx.message, ctx.directory);
          if (!searchTerm) return `Enter an employee name or ID to search.`;

          const matches = await this.searchEmployees(searchTerm, ctx.user);
          if (matches.length === 0) {
            return `No employees matched "${searchTerm}".`;
          }

          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: `Employee matches (${matches.length})`,
            rows: matches.map((employee) => ({
              primary: employee.fullName,
              secondary: employee.employeeId,
              meta: employee.designation || undefined,
              action: `employee-select:${encodeURIComponent(employee.employeeId)}`,
            })),
          });

          return matches.length === 1
            ? `I found one match for "${searchTerm}". Select the employee to continue:`
            : `I found ${matches.length} matches for "${searchTerm}". Select an employee to continue:`;
        },
      },
      {
        name: 'employeeListShort',
        test: (ctx) =>
          (ctx.msg.includes('only') ||
            ctx.msg.includes('just') ||
            ctx.msg.includes('names only') ||
            ctx.msg.includes('ids only')) &&
          fuzzyContains(ctx.msg, 'employee') &&
          (ctx.msg.includes('name') ||
            ctx.msg.includes('names') ||
            ctx.msg.includes('id') ||
            ctx.msg.includes('ids')),
        handle: async (ctx) => {
          if (ctx.msg.includes('name') || ctx.msg.includes('names')) {
            if (ctx.role === 'admin' || ctx.role === 'hr') {
              this.draftService.pendingListPreview.set(ctx.employeeId, {
                title: 'Employee Names',
                rows: ctx.directory.map((e) => ({ primary: e.name })),
              });
              return `Here are all employee names (${ctx.directory.length}):`;
            }
            this.notify(ctx.employeeId, 'danger');
            return `Access denied: you don't have permission to list all employee names.`;
          }
          if (ctx.role === 'admin' || ctx.role === 'hr') {
            this.draftService.pendingListPreview.set(ctx.employeeId, {
              title: 'Employee IDs',
              rows: ctx.directory.map((e) => ({ primary: e.id })),
            });
            return `Here are all employee IDs (${ctx.directory.length}):`;
          }
          this.notify(ctx.employeeId, 'danger');
          return `Access denied: you don't have permission to list all employee IDs.`;
        },
      },

      {
        name: 'myDetails',
        test: (ctx) =>
          (ctx.msg.includes('my details') ||
            ctx.msg.includes('my profile') ||
            ctx.msg.includes('my basic info') ||
            ctx.msg.includes('basic info') ||
            ctx.msg.includes('show my info') ||
            ctx.msg.includes('show my details') ||
            ctx.msg.includes('show my profile') ||
            ctx.msg.includes('about me') ||
            ctx.msg.includes('what is my id') ||
            ctx.msg.includes('whats my id') ||
            ctx.msg.includes('my id') ||
            ctx.msg.includes('employee id') ||
            ctx.msg.includes('my role') ||
            ctx.msg.includes('what is my role') ||
            ctx.msg.includes('whats my role') ||
            ctx.msg.includes('my designation') ||
            ctx.msg.includes('my department') ||
            ctx.msg.includes('which department') ||
            ctx.msg === 'details' ||
            ctx.msg === 'profile' ||
            ctx.msg === 'role' ||
            ctx.msg === 'id' ||
            ctx.msg === 'designation') &&
          // Don't swallow bulk/company-wide requests — "employee id" is a
          // substring of "employee ids", so without this guard a query meant
          // for the full directory gets misrouted to this personal-details reply.
          !ctx.msg.includes('employee ids') &&
          !ctx.msg.includes('all employee') &&
          !ctx.msg.includes('list employee'),
        handle: async (ctx) => {
          if (!ctx.selfEmployee) return 'Employee data not found.';
          const e = ctx.selfEmployee;

          if (
            (ctx.msg.includes('role') || ctx.msg.includes('designation')) &&
            !ctx.msg.includes('detail') &&
            !ctx.msg.includes('profile')
          ) {
            this.draftService.pendingDataCard.set(ctx.employeeId, {
              title: e.name,
              subtitle: e.designation,
              fields: [{ label: 'Designation', value: e.designation }],
            });
            return `Here's your designation:`;
          }
          if (
            ctx.msg.includes('employee id') ||
            ctx.msg === 'id' ||
            (ctx.msg.includes('my id') && !ctx.msg.includes('detail'))
          ) {
            this.draftService.pendingDataCard.set(ctx.employeeId, {
              title: e.name,
              subtitle: e.designation,
              fields: [{ label: 'Employee ID', value: e.id }],
            });
            return `Here's your employee ID:`;
          }
          if (
            ctx.msg.includes('department') &&
            !ctx.msg.includes('detail') &&
            !ctx.msg.includes('profile')
          ) {
            this.draftService.pendingDataCard.set(ctx.employeeId, {
              title: e.name,
              subtitle: e.designation,
              fields: [{ label: 'Department', value: e.department }],
            });
            return `Here's your department:`;
          }
          this.draftService.pendingDataCard.set(ctx.employeeId, {
            title: e.name,
            subtitle: e.designation,
            fields: [
              { label: 'Employee ID', value: e.id },
              { label: 'Department', value: e.department },
              { label: 'Role', value: e.designation },
            ],
          });
          return `Here's your profile:`;
        },
      },

      {
        name: 'salaryHistory',
        test: (ctx) =>
          ctx.msg.includes('my salary history') ||
          ctx.msg.includes('salary history') ||
          ctx.msg.includes('past salary') ||
          ctx.msg.includes('previous salary') ||
          ctx.msg.includes('pay history'),
        handle: async (ctx) => {
          if (!ctx.selfEmployee) return 'Employee data not found.';
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to view your salary history',
            items: [
              'Open the Employees section from the top menu.',
              'Click your profile card.',
              'Open the Payroll / Salary History tab.',
              'Review your year-on-year salary records and download payslip documents from there.',
            ],
            note: 'Detailed payroll history is private and accessible only to you and HR/Admin.',
          });
          return `Here's how to view your salary history:`;
        },
      },

      {
        name: 'mySalary',
        test: (ctx) =>
          (ctx.msg.includes('my salary') ||
            ctx.msg.includes('my pay') ||
            fuzzyContains(ctx.msg, 'earn') ||
            fuzzyContains(ctx.msg, 'compensation')) &&
          !ctx.msg.includes('payslip'),
        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Salary details are available in the portal. Contact HR for access.';
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to view your salary details',
            items: [
              'Open the Employees section from the top menu.',
              'Click your profile card.',
              'Open the Payroll tab inside your profile to view your current salary, deductions, and net pay.',
            ],
            note: 'Your payroll records are private and visible only to you and HR/Admin.',
          });
          return `Here's how to view your salary details:`;
        },
      },

      {
        name: 'myPayslip',
        test: (ctx) =>
          ctx.msg.includes('my payslip') ||
          ctx.msg.includes('my salary slip') ||
          ctx.msg === 'payslip',
        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Payslip not available. Contact Finance team.';
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your payslip',
            items: [
              'Open Employees.',
              'Select your profile card.',
              'Open the Documents / Payroll section.',
              'Click Payslip to download it.',
            ],
          });
          return `Here's how to open your payslip:`;
        },
      },

      {
        name: 'myForm16',
        test: (ctx) =>
          ctx.msg.includes('my form16') ||
          ctx.msg.includes('my tax') ||
          ctx.msg.includes('my document') ||
          ctx.msg.includes('form16') ||
          fuzzyContains(ctx.msg, 'payslip') ||
          ctx.msg.includes('salary slip'),
        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Form16 not available. Contact Finance team.';
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your Form16',
            items: [
              'Open Employees.',
              'Select your profile card.',
              'Open the Documents / Payroll section.',
              'Click Form16 to download it.',
            ],
          });
          return `Here's how to open your Form16:`;
        },
      },

      {
        name: 'familyDetails',

        test: (ctx) =>
          ctx.msg.includes('family details') ||
          ctx.msg.includes('family information'),

        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Family Details not available. Contact HR team.';

          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your Family Details',

            items: [
              'Open My Profile.',
              'Select Family Details.',
              'View your family information.',
            ],
          });

          return `Here's how to open your Family Details:`;
        },
      },

      {
        name: 'educationDetails',

        test: (ctx) =>
          ctx.msg.includes('education details') ||
          ctx.msg.includes('educational details') ||
          ctx.msg.includes('education information'),

        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Education Details not available. Contact HR team.';

          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your Education Details',

            items: [
              'Open My Profile.',
              'Select Education Details.',
              'View your educational information.',
            ],
          });

          return `Here's how to open your Education Details:`;
        },
      },

      {
        name: 'experienceDetails',

        test: (ctx) =>
          ctx.msg.includes('experience details') ||
          ctx.msg.includes('experience information'),

        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Experience Details not available. Contact HR team.';

          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your Experience Details',

            items: [
              'Open My Profile.',
              'Select Experience Details.',
              'View your experience information.',
            ],
          });

          return `Here's how to open your Experience Details:`;
        },
      },

      {
        name: 'bankInformation',

        test: (ctx) =>
          ctx.msg.includes('bank information') ||
          ctx.msg.includes('bank details'),

        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Bank Information not available. Contact HR team.';

          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your Bank Information',

            items: [
              'Open My Profile.',
              'Select Bank Information.',
              'View your registered bank information.',
            ],
          });

          return `Here's how to open your Bank Information:`;
        },
      },

      {
        name: 'uploadedDocuments',

        test: (ctx) =>
          ctx.msg.includes('uploaded documents') ||
          ctx.msg.includes('uploaded files'),

        handle: async (ctx) => {
          if (!ctx.selfEmployee)
            return 'Uploaded Documents not available. Contact HR team.';

          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to open your Uploaded Documents',

            items: [
              'Open My Profile.',
              'Select Uploaded Documents.',
              'View your uploaded documents.',
            ],
          });

          return `Here's how to open your Uploaded Documents:`;
        },
      },

      {
        name: 'listEmployeeNames',
        test: (ctx) =>
          ctx.msg.includes('list') &&
          fuzzyContains(ctx.msg, 'employee') &&
          (ctx.msg.includes('name') || ctx.msg.includes('names')),
        handle: async (ctx) => {
          if (ctx.role !== 'admin' && ctx.role !== 'hr') {
            this.notify(ctx.employeeId, 'danger');
            return `Access denied: you don't have permission to list all employee names.`;
          }
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Employee Names',
            rows: ctx.directory.map((e) => ({ primary: e.name })),
          });
          return `Here are all employee names (${ctx.directory.length}):`;
        },
      },

      {
        name: 'listEmployeeIds',
        test: (ctx) =>
          ctx.msg.includes('list') &&
          fuzzyContains(ctx.msg, 'employee') &&
          (ctx.msg.includes('id') || ctx.msg.includes('ids')),
        handle: async (ctx) => {
          if (ctx.role !== 'admin' && ctx.role !== 'hr') {
            this.notify(ctx.employeeId, 'danger');
            return `Access denied: you don't have permission to list all employee IDs.`;
          }
          this.draftService.pendingListPreview.set(ctx.employeeId, {
            title: 'Employee IDs',
            rows: ctx.directory.map((e) => ({ primary: e.id })),
          });
          return `Here are all employee IDs (${ctx.directory.length}):`;
        },
      },

      {
        name: 'myCertificates',
        test: (ctx) =>
          ctx.msg.includes('my certificate') ||
          ctx.msg.includes('my certificates') ||
          ctx.msg.includes('my qualification') ||
          ctx.msg.includes('my credential') ||
          ctx.msg.includes('my skill'),
        handle: async (ctx) => {
          this.draftService.pendingSteps.set(ctx.employeeId, {
            title: 'How to view your certificates',
            items: [
              'Open the Employees menu.',
              'Click your profile card.',
              'Open the Documents / Certificates section.',
              'View or download the certificate files from there.',
            ],
            note: 'To add a new certificate, upload it from the Documents area in your portal.',
          });
          return `Here's how to view your certificates:`;
        },
      },

      {
        name: 'privateDocs',
        test: (ctx) =>
          !ctx.msg.includes('my') &&
          (ctx.msg.includes('form16') ||
            fuzzyContains(ctx.msg, 'payslip') ||
            ctx.msg.includes('salary slip') ||
            ctx.msg.includes('appraisal') ||
            ctx.msg.includes('private detail') ||
            ctx.msg.includes('private details')),
        handle: async (ctx) => {
          const guideIntro = this.getPrivateDocGuide(ctx.employeeId, ctx.role);
          if (ctx.role === 'admin' || ctx.role === 'hr') return guideIntro;
          return `Access denied: private employee documents are only visible for your own profile. ${guideIntro}`;
        },
      },

      {
        name: 'downloadAllEmployees',
        test: (ctx) =>
          ctx.msg.includes('download all employees') &&
          (ctx.msg.includes('excel') || ctx.msg.includes('pdf')),

        handle: async (ctx) => {
          if (ctx.role !== 'admin' && ctx.role !== 'hr') {
            this.notify(ctx.employeeId, 'danger');

            return 'Access denied: only HR/Admin can download employee data.';
          }

          const format = ctx.msg.includes('excel') ? 'excel' : 'pdf';

          this.draftService.pendingSuggestedActions.set(ctx.employeeId, [
            {
              label: format === 'excel' ? 'Download Excel' : 'Download PDF',
              send: `employee-export:${format}`,
            },
          ]);

          return format === 'excel'
            ? 'Employee Excel export is ready.'
            : 'Employee PDF export is ready.';
        },
      },

      {
        name: 'allEmployees',
        test: (ctx) =>
          ctx.msg.includes('all employee') ||
          ctx.msg.includes('all employees') ||
          ctx.msg.includes('show me all') ||
          ctx.msg.includes('all the employee'),
        handle: async (ctx) => {
          if (ctx.msg.includes('id') || ctx.msg.includes('ids')) {
            if (ctx.role === 'admin' || ctx.role === 'hr') {
              this.draftService.pendingListPreview.set(ctx.employeeId, {
                title: 'Employee IDs',
                rows: ctx.directory.map((e) => ({ primary: e.id })),
              });
              return `Here are all employee IDs (${ctx.directory.length}):`;
            }
            this.notify(ctx.employeeId, 'danger');
            return `Access denied: you don't have permission to list all employee IDs.`;
          }
          if (ctx.role === 'admin' || ctx.role === 'hr') {
            this.draftService.setDraft(
              this.draftService.employeeDirectoryDrafts,
              ctx.employeeId,
              {
                step: 'awaiting_action',
                action: '',
                format: '',
                directory: ctx.directory,
              },
            );
            return `Employee Directory (${ctx.directory.length} active) — would you like to View the directory, or Download the data?`;
          }
          this.notify(ctx.employeeId, 'danger', [
            { label: 'My Details', send: 'my details' },
          ]);
          return `Access denied: you don't have permission to view all employee details.`;
        },
      },

      {
        name: 'employeeDirectoryCancelAny',
        test: (ctx) => {
          if (ctx.msg !== 'employees cancel') return false;
          return this.draftService.hasDraft(
            this.draftService.employeeDirectoryDrafts,
            ctx.employeeId,
          );
        },
        handle: async (ctx) => {
          this.draftService.deleteDraft(
            this.draftService.employeeDirectoryDrafts,
            ctx.employeeId,
          );
          return `No problem — nothing was downloaded.`;
        },
      },

      {
        name: 'employeeDirectoryAction',
        test: (ctx) => {
          if (ctx.msg !== 'view employees' && ctx.msg !== 'download employees')
            return false;
          const draft = this.draftService.getDraft(
            this.draftService.employeeDirectoryDrafts,
            ctx.employeeId,
          );
          return !!draft && draft.step === 'awaiting_action';
        },
        handle: async (ctx) => {
          const draft = this.draftService.getDraft(
            this.draftService.employeeDirectoryDrafts,
            ctx.employeeId,
          )!;

          if (ctx.msg === 'view employees') {
            draft.action = 'view';
            draft.step = 'viewed';
            this.draftService.setDraft(
              this.draftService.employeeDirectoryDrafts,
              ctx.employeeId,
              draft,
            );

            if (!draft.directory.length) {
              return `No employees found on record right now.\n\nWould you like to Download this anyway, or Cancel?`;
            }
            return `Employee Directory (${draft.directory.length} active) — view the list below.\n\nWould you like to Download this data, or Cancel?`;
          }

          // download, chosen directly without viewing first
          draft.action = 'download';
          draft.step = 'awaiting_format';
          this.draftService.setDraft(
            this.draftService.employeeDirectoryDrafts,
            ctx.employeeId,
            draft,
          );
          return `Download the employee directory as PDF or Excel?`;
        },
      },

      {
        name: 'employeeDirectoryViewFollowup',
        test: (ctx) => {
          if (
            ctx.msg !== 'download employees' &&
            ctx.msg !== 'employees cancel'
          )
            return false;
          const draft = this.draftService.getDraft(
            this.draftService.employeeDirectoryDrafts,
            ctx.employeeId,
          );
          return !!draft && draft.step === 'viewed';
        },
        handle: async (ctx) => {
          const draft = this.draftService.getDraft(
            this.draftService.employeeDirectoryDrafts,
            ctx.employeeId,
          )!;
          if (ctx.msg === 'employees cancel') {
            this.draftService.deleteDraft(
              this.draftService.employeeDirectoryDrafts,
              ctx.employeeId,
            );
            return `No problem — nothing was downloaded.`;
          }
          draft.action = 'download';
          draft.step = 'awaiting_format';
          this.draftService.setDraft(
            this.draftService.employeeDirectoryDrafts,
            ctx.employeeId,
            draft,
          );
          return `Download the employee directory as PDF or Excel?`;
        },
      },

      {
        name: 'employeeDirectoryFormat',
        test: (ctx) => {
          if (ctx.msg !== 'employees pdf' && ctx.msg !== 'employees excel')
            return false;
          const draft = this.draftService.getDraft(
            this.draftService.employeeDirectoryDrafts,
            ctx.employeeId,
          );
          return !!draft && draft.step === 'awaiting_format';
        },
        handle: async (ctx) => {
          const draft = this.draftService.getDraft(
            this.draftService.employeeDirectoryDrafts,
            ctx.employeeId,
          )!;
          draft.format = ctx.msg === 'employees pdf' ? 'pdf' : 'excel';
          draft.step = 'ready_download';
          this.draftService.setDraft(
            this.draftService.employeeDirectoryDrafts,
            ctx.employeeId,
            draft,
          );
          return `Your employee directory ${draft.format.toUpperCase()} file is ready — tap below to download it.`;
        },
      },

      {
        name: 'salaryNotMine',
        test: (ctx) =>
          (fuzzyContains(ctx.msg, 'salary') || ctx.msg.includes('pay')) &&
          !ctx.msg.includes('my'),
        handle: async (ctx) => {
          if (ctx.role === 'admin' || ctx.role === 'hr') {
            this.draftService.pendingSteps.set(ctx.employeeId, {
              title: 'How to view employee salary details',
              items: [
                'Open the Employees menu.',
                'Select the employee card.',
                'Open the payroll panel to review salary, deductions, and tax.',
                'Use the documents area for Form16 or payslip downloads.',
              ],
              note: 'For a public snapshot, browse the directory; for the private payroll file, open the secure payroll panel in the portal.',
            });
            return `Here's how to view employee salary details:`;
          }
          this.notify(ctx.employeeId, 'danger', [
            { label: 'My Salary', send: 'my salary' },
          ]);
          return `Access denied: salary information for other employees is confidential.`;
        },
      },

      {
        name: 'employeeDetail',
        test: (ctx) =>
          fuzzyContains(ctx.msg, 'employee') &&
          fuzzyContains(ctx.msg, 'detail') &&
          !ctx.msg.includes('my'),
        handle: async (ctx) => {
          if (ctx.role === 'admin' || ctx.role === 'hr') {
            this.draftService.pendingSteps.set(ctx.employeeId, {
              title: 'Employee details navigation',
              items: [
                'Open the Employees menu.',
                'Search or click the employee card.',
                'Review the public profile details on the card.',
                'Open the secure documents panel for private details.',
              ],
              note: 'All employee directory cards are accessible from the portal, while private files stay in the secure document section.',
            });
            return `Here's how to navigate employee details:`;
          }
          this.notify(ctx.employeeId, 'info', [
            { label: 'My Details', send: 'my details' },
          ]);
          return `You can only access your own details.`;
        },
      },
    ];
  }
}


import type { ReactNode } from "react";
import { Calculator, Eye, Play, ReceiptText, Settings2, UserPlus } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AssignSalaryStructure } from "../components/AssignSalaryStructure";
import { PayrollHeader } from "../components/PayrollHeader";
import { PayrollRunDetail } from "../components/PayrollRunDetail";
import { PayrollRunList } from "../components/PayrollRunList";
import { EmptyState, neutralBtn } from "../components/PayrollShared";
import { PayslipView } from "../components/PayslipView";
import { SalaryComponentForm } from "../components/SalaryComponentForm";
import { SalaryStructureCalculator } from "../components/SalaryStructureCalculator";
import { SalaryStructurePreview } from "../components/SalaryStructurePreview";
import { usePayroll } from "../hooks/usePayroll";
import { formatPeriod } from "../utils/payrollFormat";

interface PageMeta {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  icon?: ReactNode;
}

export default function PayrollPage() {
  const payroll = usePayroll();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { domain, view, action } = useParams<{
    domain: string;
    view?: string;
    action?: string;
  }>();

  const base = `/${domain}/admin/payroll`;
  const go = (path: string) => navigate(`${base}/${path}`);

  const currentView = view ?? "salary-structure-calculator";

  // Query params carry the record being worked on (payroll run / employee)
  const run = payroll.runs.find((item) => item.id === searchParams.get("run"));
  const payslip = run?.payslips.find((item) => item.employeeId === searchParams.get("emp"));
  const basicMonthly =
    payroll.structure.earnings.find((line) => line.isBasic)?.monthlyAmount ?? 0;

  const missing = (message: string, backTo: string) => (
    <section className="space-y-4">
      <EmptyState message={message} />
      <div className="flex justify-center">
        <button type="button" className={neutralBtn} onClick={() => go(backTo)}>
          Back
        </button>
      </div>
    </section>
  );

  const iconClass = "h-6 w-6";
  let meta: PageMeta = { title: "Payroll" };
  let content: ReactNode = <EmptyState message="This payroll screen is ready to be built." />;

  // ================= 1. SALARY STRUCTURE CALCULATOR =================
  if (currentView === "salary-structure-calculator") {
    meta = {
      icon: <Calculator className={iconClass} />,
      title: "Salary Structure Calculator",
      subtitle: "Create and configure the salary structure based on CTC and components.",
      breadcrumb: ["Salary Structures", "Create Salary Structure"],
    };
    content = (
      <SalaryStructureCalculator
        details={payroll.details}
        setDetails={payroll.setDetails}
        lines={payroll.lines}
        summary={payroll.summary}
        structure={payroll.structure}
        structureErrors={payroll.structureErrors}
        lineError={payroll.lineError}
        setLineError={payroll.setLineError}
        saveLine={payroll.saveLine}
        updateLine={payroll.updateLine}
        removeLine={payroll.removeLine}
        onSaveDraft={payroll.saveDraft}
        onCancel={() => navigate(base)}
        onPreview={() => go("salary-structure-preview")}
      />
    );

  // ================= 2. SALARY STRUCTURE PREVIEW =================
  } else if (currentView === "salary-structure-preview") {
    meta = {
      icon: <Eye className={iconClass} />,
      title: "Salary Structure Preview",
      subtitle: "Review the salary structure and calculated values.",
      breadcrumb: ["Salary Structures", "Preview"],
    };
    content = (
      <SalaryStructurePreview
        summary={payroll.summary}
        structure={payroll.structure}
        structureErrors={payroll.structureErrors}
        onBack={() => go("salary-structure-calculator")}
        onEdit={() => go("salary-structure-calculator")}
        onSave={() => {
          payroll.saveStructure();
          go("assign-salary-structure");
        }}
      />
    );

  // ================= 3. CONFIGURE SALARY COMPONENT =================
  } else if (currentView === "configure-salary-component") {
    meta = {
      icon: <Settings2 className={iconClass} />,
      title: "Configure Salary Component",
      subtitle: "Define the component details and calculation method.",
      breadcrumb: ["Salary Components", "Add Component"],
    };
    content = (
      <SalaryComponentForm
        annualCtc={payroll.summary.annualCtc}
        fixedMonthlyCtc={payroll.summary.fixedMonthlyCtc}
        basicMonthly={basicMonthly}
        onSave={payroll.saveComponent}
        onDone={() => go("salary-structure-calculator")}
      />
    );

  // ================= 4. ASSIGN SALARY STRUCTURE =================
  } else if (currentView === "assign-salary-structure") {
    meta = {
      icon: <UserPlus className={iconClass} />,
      title: "Assign Salary Structure",
      subtitle: "Assign a salary structure to an employee.",
      breadcrumb: ["Employee Salary", "Assign Salary Structure"],
    };
    content = (
      <AssignSalaryStructure
        employees={payroll.employees}
        structures={payroll.structures}
        assignments={payroll.assignments}
        initialEmployeeId={searchParams.get("emp") ?? ""}
        onAssign={payroll.assignStructure}
        onDone={() => go("payroll-run")}
      />
    );

  // ================= 5. PAYROLL RUN (+ run detail & payslips) =================
  } else if (currentView === "payroll-run" && !action) {
    meta = {
      icon: <Play className={iconClass} />,
      title: "Payroll Run",
      subtitle: "Process payroll for the selected period.",
    };
    content = (
      <PayrollRunList
        runs={payroll.runs}
        onCreate={payroll.createPayrollRun}
        onView={(id) => go(`payroll-run/view?run=${id}`)}
        onPayslips={(id) => go(`payroll-run/payslips?run=${id}`)}
      />
    );
  } else if (currentView === "payroll-run" && (action === "view" || action === "payslips")) {
    meta = {
      icon: <Play className={iconClass} />,
      title: run
        ? `${action === "view" ? "Payroll Run" : "Payslips"} - ${formatPeriod(run.period)}`
        : "Payroll Run",
      breadcrumb: action === "view" ? ["Payroll Run", "View"] : ["Payroll Run", "Payslips"],
    };
    content = run ? (
      <PayrollRunDetail
        run={run}
        mode={action}
        onBack={() => go("payroll-run")}
        onOpenPayslip={(emp) => go(`payroll-run/payslip?run=${run.id}&emp=${emp}`)}
      />
    ) : (
      missing("This payroll run could not be found.", "payroll-run")
    );
  } else if (currentView === "payroll-run" && action === "payslip") {
    meta = {
      icon: <ReceiptText className={iconClass} />,
      title: run ? `Payslip - ${formatPeriod(run.period)}` : "Payslip",
      breadcrumb: ["Payroll Run", "Payslips", "View"],
    };
    content =
      run && payslip ? (
        <PayslipView
          payslip={payslip}
          period={run.period}
          onBack={() => go(`payroll-run/payslips?run=${run.id}`)}
        />
      ) : (
        missing("This payslip could not be found.", "payroll-run")
      );
  }

  return (
    <div className="-m-4 min-h-full min-w-0 bg-[#f6f7fb] text-[#1f2430] sm:-m-6">
      <div className="print:hidden">
        <PayrollHeader
          pageTitle={meta.title}
          subtitle={meta.subtitle}
          breadcrumb={meta.breadcrumb}
          icon={meta.icon}
        />
      </div>
      <main className="min-w-0 space-y-6 px-4 py-6 sm:px-8">{content}</main>
    </div>
  );
}

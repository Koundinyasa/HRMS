import type { ValidationResult } from "../types/classificationTypes";

export function validateAdditionalClassification(input: { name: string; tag: string }): ValidationResult {
  if (!input.name.trim()) return { valid: false, error: "Please enter a classification name." };
  if (!input.tag.trim()) return { valid: false, error: "Please enter a tag." };
  return { valid: true };
}

export function validateBranch(input: { branchName: string; address: string; state: string }): ValidationResult {
  if (!input.branchName.trim()) return { valid: false, error: "Please enter a branch name." };
  if (!input.address.trim()) return { valid: false, error: "Please enter an address." };
  if (!input.state.trim()) return { valid: false, error: "Please select a state." };
  return { valid: true };
}

export function validateDesignation(input: { designationName: string }): ValidationResult {
  if (!input.designationName.trim()) return { valid: false, error: "Please enter a designation name." };
  if (input.designationName.trim().length < 2)
    return { valid: false, error: "Designation name must be at least 2 characters." };
  return { valid: true };
}

export function validateBank(input: { bankName: string; acType: string; ifscCode: string }): ValidationResult {
  if (!input.bankName.trim()) return { valid: false, error: "Please enter a bank name." };
  if (!input.acType.trim()) return { valid: false, error: "Please enter an account type." };
  if (!input.ifscCode.trim()) return { valid: false, error: "Please enter an IFSC code." };
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(input.ifscCode.trim().toUpperCase()))
    return { valid: false, error: "Invalid IFSC code format." };
  return { valid: true };
}

export function validateSalaryComponent(input: { componentName: string; printName: string }): ValidationResult {
  const name = input.componentName.trim();
  const printName = input.printName.trim();

  if (!name) return { valid: false, error: "Please enter a component name." };
  if (name.length < 2) return { valid: false, error: "Component name must be at least 2 characters." };
  if (name.length > 50) return { valid: false, error: "Component name must be under 50 characters." };
  if (!/^[A-Za-z0-9 .&()/-]+$/.test(name))
    return { valid: false, error: "Component name contains invalid characters." };

  if (!printName) return { valid: false, error: "Please enter a print name." };
  if (printName.length > 20) return { valid: false, error: "Print name must be 20 characters or fewer." };
  if (!/^[A-Za-z0-9 .&()/-]+$/.test(printName))
    return { valid: false, error: "Print name contains invalid characters." };

  return { valid: true };
}

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetBankFieldConfigQuery, useSaveBankFieldConfigMutation } from "../api/classificationApi";
import { getBackendMessage } from "./getBackendMessage";
import { DEFAULT_BANK_FIELD_CONFIG } from "../constants/bankFieldMapping.constants";
import type { AvailableField, FieldMappingRow, BankFieldConfigResponse } from "../types/classificationTypes";

export const useBankFieldMapping = (bankId: number) => {
  const { data: apiData, isLoading, isError } = useGetBankFieldConfigQuery(bankId, { skip: !bankId });
  const [saveConfig, { isLoading: isSaving }] = useSaveBankFieldConfigMutation();

  const usingFallback = isError;
  const data = usingFallback ? { ...DEFAULT_BANK_FIELD_CONFIG, BankId: bankId } : apiData;

  const [availableFields, setAvailableFields] = useState<AvailableField[]>([]);
  const [mappingRows, setMappingRows] = useState<FieldMappingRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (data) {
      setAvailableFields(data.AvailableFields);
      setMappingRows(data.MappingRows);
    }
  }, [data]);

  const toggleField = (fieldId: string) => {
    setAvailableFields((prev) =>
      prev.map((f) => (f.FieldId === fieldId ? { ...f, IsEnabled: !f.IsEnabled } : f))
    );
  };

  const updateRow = <K extends keyof FieldMappingRow>(rowId: string, key: K, value: FieldMappingRow[K]) => {
    setMappingRows((prev) => prev.map((r) => (r.RowId === rowId ? { ...r, [key]: value } : r)));
  };

  const filteredFields = search.trim()
    ? availableFields.filter((f) => f.Label.toLowerCase().includes(search.trim().toLowerCase()))
    : availableFields;

  const enabledCount = availableFields.filter((f) => f.IsEnabled).length;

  const save = async () => {
    if (!data) return;
    if (usingFallback) {
      toast.info("This is preview data — the field mapping API isn't live yet, so changes can't be saved.");
      return;
    }
    const payload: BankFieldConfigResponse = { ...data, AvailableFields: availableFields, MappingRows: mappingRows };
    try {
      await saveConfig(payload).unwrap();
      toast.success("Field mapping saved successfully.");
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to save the field mapping.");
    }
  };

  return {
    quickTokens: data?.QuickTokens ?? [],
    availableFields: filteredFields,
    enabledCount,
    mappingRows,
    isLoading,
    isSaving,
    usingFallback,
    search,
    setSearch,
    toggleField,
    updateRow,
    save,
  };
};

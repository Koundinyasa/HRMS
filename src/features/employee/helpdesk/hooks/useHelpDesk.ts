import { toast } from "react-toastify";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import {
  clearTicketForm,
  setDepartmentId,
  setCategoryId,
  setSubCategoryId,
  setAssetNumber,
  setLocation,
  setContactNo,
  setSubject,
  setDescription,
} from "../helpDeskSlice";
import {
  useGetDepartmentsQuery,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useCreateTicketMutation,
  useGetMyTicketsQuery,
  useReplyTicketMutation,
  useReopenTicketMutation,
  useGetKnowledgeBaseQuery,
} from "../api/helpDeskApi";
import {
  validateHelpDeskTicket,
} from "../validations/helpDeskValidation";

export const useHelpDesk = () => {
  const dispatch = useAppDispatch();

  const helpDeskState = useAppSelector(
    (state) => state.employee.helpDesk
  );

  // ==================================================
  // DEPARTMENTS
  // ==================================================

  const {
    data: departments = [],
    isLoading: departmentsLoading,
  } = useGetDepartmentsQuery();

  // ==================================================
  // CATEGORIES
  // ==================================================

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery(
    helpDeskState.departmentId!,
    {
      skip: !helpDeskState.departmentId,
    }
  );

  // ==================================================
  // SUB CATEGORIES
  // ==================================================

  const {
    data: subCategories = [],
    isLoading: subCategoriesLoading,
  } = useGetSubCategoriesQuery(
    helpDeskState.categoryId!,
    {
      skip: !helpDeskState.categoryId,
    }
  );
  const selectedCategory = categories.find(
  (category) =>
    category.ID === helpDeskState.categoryId
);
const isAssetNumberRequired =
  ["hardware support", "software support"].includes(
    selectedCategory?.CategoryName
      ?.trim()
      .toLowerCase() ?? ""
  );

  // ==================================================
  // MY TICKETS
  // ==================================================

  const {
    data: ticketResponse,
    isLoading: ticketsLoading,
    isError,
    refetch: refetchMyTickets,
  } = useGetMyTicketsQuery();

  const myTickets = ticketResponse ?? [];


    // ==================================================
  // KNOWLEDGE BASE
  // ==================================================

  const {
    data: knowledgeBase = [],
    isLoading: knowledgeBaseLoading,
    isError: knowledgeBaseError,
    refetch: refetchKnowledgeBase,
  } = useGetKnowledgeBaseQuery();


  // ==================================================
  // CREATE TICKET
  // ==================================================

  const [
    createTicket,
    {
      isLoading: isSubmitting,
    },
  ] = useCreateTicketMutation();
  const [
    replyTicket,
    {
      isLoading: isReplying,
    },
  ] = useReplyTicketMutation();
  const [
    reopenTicket,
    {
      isLoading: isReopening,
    },
  ] = useReopenTicketMutation();

  // ==================================================
  // SUBMIT TICKET
  // ==================================================

  const submitTicket = async () => {
    const validation =
  validateHelpDeskTicket(
    helpDeskState,
    isAssetNumberRequired
  );
    if (!validation.valid) {
      toast.error(
        validation.error
      );

      return false;
    }

    try {
      const response =
        await createTicket({
          departmentId:
            helpDeskState.departmentId!,

          categoryId:
            helpDeskState.categoryId!,

          subCategoryId:
            helpDeskState.subCategoryId!,

          // Asset number is optional
          ...(helpDeskState.assetNumber.trim()
            ? {
              assetNumber:
                helpDeskState.assetNumber.trim(),
            }
            : {}),

          location:
            helpDeskState.location.trim(),

          contactNo:
            helpDeskState.contactNo.trim(),

          subject:
            helpDeskState.subject.trim(),

          description:
            helpDeskState.description.trim(),
        }).unwrap();

      toast.success(
        response.Message ??
        "Ticket raised successfully."
      );

      dispatch(
        clearTicketForm()
      );

      return true;

    } catch (error: unknown) {
      const errorResponse =
        error as {
          data?: {
            Message?: string;
            message?: string;
          };
        };
      toast.error(
        errorResponse.data?.Message ??
        errorResponse.data?.message ??
        "Unable to raise ticket."
      );

      return false;
    }
  };

  const submitReply = async (
    ticketId: number,
    remarks: string,
    document?: File
  ) => {
    if (!remarks.trim()) {
      toast.error("Please enter your reply.");
      return false;
    }
    try {
      await replyTicket({
        ticketId,
        remarks: remarks.trim(),
        document,
      }).unwrap();

      await refetchMyTickets();

      toast.success(
        "Reply submitted successfully."
      );

      return true;

    } catch (error: unknown) {
      const errorResponse =
        error as {
          data?: {
            Message?: string;
            message?: string;
          };
        };
      toast.error(
        errorResponse.data?.Message ??
        errorResponse.data?.message ??
        "Unable to submit reply."
      );

      return false;
    }
  };

  const submitReopen = async (
    ticketId: number,
    remarks: string,
    document?: File
  ) => {
    if (!remarks.trim()) {
      toast.error(
        "Please enter a reason for reopening the ticket."
      );

      return false;
    }

    try {
      await reopenTicket({
        ticketId,
        remarks: remarks.trim(),
        document,
      }).unwrap();

      await refetchMyTickets();

      toast.success(
        "Ticket reopened successfully."
      );

      return true;

    } catch (error: unknown) {
      const errorResponse =
        error as {
          data?: {
            Message?: string;
            message?: string;
          };
        };
      toast.error(
        errorResponse.data?.Message ??
        errorResponse.data?.message ??
        "Unable to reopen ticket."
      );

      return false;
    }
  };

  // ==================================================
  // RETURN
  // ==================================================

  return {
    // ================================================
    // FORM STATE
    // ================================================

    ...helpDeskState,

    // ================================================
    // DROPDOWN DATA
    // ================================================

    departments,
    categories,
    subCategories,
    isAssetNumberRequired,

    // ================================================
    // TICKET DATA
    // ================================================

    myTickets,

    // ================================================
    // LOADING
    // ================================================

    departmentsLoading,
    categoriesLoading,
    subCategoriesLoading,
    ticketsLoading,
    isSubmitting,
    isReplying,
    isReopening,

    // ================================================
    // ERROR
    // ================================================

    isError,

    // ================================================
    // REFETCH
    // ================================================

    refetchMyTickets,

    // ================================================
    // SETTERS
    // ================================================

    setDepartment: (id: number | null) =>
      dispatch(
        setDepartmentId(id)
      ),
    setCategory: (id: number | null) =>
      dispatch(
        setCategoryId(id)
      ),
    setSubCategory: (id: number | null) =>
      dispatch(
        setSubCategoryId(id)
      ),
    setAssetNumber: (value: string) =>
      dispatch(
        setAssetNumber(value)
      ),
    setLocation: (value: string) =>
      dispatch(
        setLocation(value)
      ),
    setContactNo: (value: string) =>
      dispatch(
        setContactNo(value)
      ),
    setSubject: (value: string) =>
      dispatch(
        setSubject(value)
      ),
    setDescription: (value: string) =>
      dispatch(
        setDescription(value)
      ),

    // ================================================
    // SUBMIT
    // ================================================

    submitTicket,
    submitReply,
    submitReopen,

    // ================================================
    // KNOWLEDGE BASE
    // ================================================

    knowledgeBase,
    knowledgeBaseLoading,
    knowledgeBaseError,
    refetchKnowledgeBase,
  };

  
};

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useHelpDesk } from "../hooks/useHelpDesk";

export default function RaiseTicketForm() {

  const navigate =
    useNavigate();

  const { domain } =
    useParams();

  const {
    departmentId,
    categoryId,
    subCategoryId,

    assetNumber,
    isAssetNumberRequired,
    location,
    contactNo,
    subject,
    description,

    departments,
    categories,
    subCategories,

    departmentsLoading,
    categoriesLoading,
    subCategoriesLoading,

    setDepartment,
    setCategory,
    setSubCategory,

    setAssetNumber,
    setLocation,
    setContactNo,
    setSubject,
    setDescription,

    submitTicket,

    isSubmitting,
  } = useHelpDesk();

  const handleSubmit =
    async () => {

      const success =
        await submitTicket();

      if (success) {
        navigate(
          `/${domain}/employee/helpdesk/status`
        );
      }
    };

  return (
    <Card className="mx-auto w-full max-w-6xl min-w-0 overflow-visible rounded-2xl border shadow-sm">
      <CardHeader className="px-4 pt-6 sm:px-8 sm:pt-8">
        <CardTitle className="text-2xl font-bold sm:text-3xl">
          Raise Ticket
        </CardTitle>

        <CardDescription className="text-base">
          Submit a support ticket for your issue.
        </CardDescription>

      </CardHeader>

      <CardContent className="space-y-6 px-4 pb-6 sm:space-y-8 sm:px-6 sm:pb-8 lg:px-8">

        {/* Department / Category */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div className="space-y-2">

            <Label>
              Department
              <span className="ml-1 text-red-600">
                *
              </span>
            </Label>

            <Select
              value={departmentId?.toString() ?? ""}
              disabled={departmentsLoading}
              onValueChange={(value) => {
                setDepartment(
                  value ? Number(value) : null
                );
              }}
            >
              <SelectTrigger className="h-11 w-full min-w-0">
                <SelectValue
                  placeholder={
                    departmentsLoading
                      ? "Loading..."
                      : "Select Department"
                  }
                >
                  {departments.find(
                    (department: { ID: number; DepartmentName: string }) =>
                      department.ID === departmentId
                  )?.DepartmentName}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {departments.map(
                  (department: { ID: number; DepartmentName: string }) => (
                  <SelectItem
                    key={department.ID}
                    value={department.ID.toString()}
                  >
                    {department.DepartmentName}
                  </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

          </div>

          <div className="space-y-2">

            <Label>
              Category
              <span className="ml-1 text-red-600">
                *
              </span>
            </Label>

            <Select
              value={categoryId?.toString() ?? ""}
              disabled={!departmentId || categoriesLoading}
              onValueChange={(value) => {
                setCategory(
                  value ? Number(value) : null
                );
              }}
              itemToStringValue={(value) => {
                const category = categories.find(
                  (item: { ID: number; CategoryName: string }) =>
                    item.ID.toString() === value
                );

                return category?.CategoryName ?? "";
              }}
            >
              <SelectTrigger className="h-11 w-full min-w-0">
                <SelectValue
                  placeholder={
                    categoriesLoading
                      ? "Loading..."
                      : "Select Category"
                  }
                >
                  {categories.find(
                    (category: { ID: number; CategoryName: string }) =>
                      category.ID === categoryId
                  )?.CategoryName}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {categories.map((category: { ID: number; CategoryName: string }) => (
                  <SelectItem
                    key={category.ID}
                    value={category.ID.toString()}
                  >
                    {category.CategoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>

        </div>

        {/* Sub Category / Asset */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div className="space-y-2">

            <Label>
              Sub Category
              <span className="ml-1 text-red-600">
                *
              </span>
            </Label>

            <Select
              value={subCategoryId?.toString() ?? ""}
              disabled={!categoryId || subCategoriesLoading}
              onValueChange={(value) => {
                setSubCategory(
                  value ? Number(value) : null
                );
              }}
              itemToStringValue={(value) => {
                const subCategory = subCategories.find(
                  (item: { ID: number; SubCategoryName: string }) =>
                    item.ID.toString() === value
                );

                return subCategory?.SubCategoryName ?? "";
              }}
            >
              <SelectTrigger className="h-11 w-full min-w-0">
                <SelectValue
                  placeholder={
                    subCategoriesLoading
                      ? "Loading..."
                      : "Select Sub Category"
                  }
                >
                  {subCategories.find(
                    (subCategory: { ID: number; SubCategoryName: string }) =>
                      subCategory.ID === subCategoryId
                  )?.SubCategoryName}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {subCategories.map(
                  (subCategory: { ID: number; SubCategoryName: string }) => (
                  <SelectItem
                    key={subCategory.ID}
                    value={subCategory.ID.toString()}
                  >
                    {subCategory.SubCategoryName}
                  </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

          </div>

          <div className="space-y-2">

            <Label>
              Asset Number

              {isAssetNumberRequired && (
                <span className="ml-1 text-red-600">
                  *
                </span>
              )}
            </Label>

            <Input
              value={assetNumber}
              onChange={(event) =>
                setAssetNumber(
                  event.target.value
                )
              }
              placeholder={
                isAssetNumberRequired
                  ? "Enter asset number"
                  : "Optional"
              }
            />

          </div>

        </div>

        {/* Location / Contact */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div className="space-y-2">

            <Label>
              Location
              <span className="ml-1 text-red-600">
                *
              </span>
            </Label>

            <Input
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
              placeholder="Enter location"
            />

          </div>

          <div className="space-y-2">

            <Label>
              Contact Number
              <span className="ml-1 text-red-600">
                *
              </span>
            </Label>

            <Input
              value={contactNo}
              maxLength={10}
              onChange={(event) =>
                setContactNo(
                  event.target.value
                )
              }
              placeholder="Enter 10-digit number"
            />

          </div>

        </div>

        {/* Subject */}

        <div className="space-y-2">

          <Label>
            Subject
            <span className="ml-1 text-red-600">
              *
            </span>
          </Label>

          <Input
            value={subject}
            onChange={(event) =>
              setSubject(
                event.target.value
              )
            }
            placeholder="Enter ticket subject"
          />

        </div>

        {/* Description */}

        <div className="space-y-2">

          <Label>
            Description
            <span className="ml-1 text-red-600">
              *
            </span>
          </Label>

          <Textarea
            rows={8}
            value={description}
            maxLength={1000}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Describe your issue..."
            className="resize-none"
          />

          <div className="text-right text-xs text-slate-500">
            {description.length}/1000
          </div>

        </div>

        {/* Submit */}

        <Button
          type="button"
          className="h-12 w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Submitting..."
            : "Raise Ticket"}
        </Button>

      </CardContent>
    </Card>
  );
}
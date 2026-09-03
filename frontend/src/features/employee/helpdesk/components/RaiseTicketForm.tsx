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

import {
  Building2,
  Tag,
  LayoutGrid,
  Hash,
  MapPin,
  Phone,
  MessageSquare,
  AlignLeft,
} from "lucide-react";

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
    <Card className="mx-auto w-full max-w-3xl min-w-0 overflow-visible rounded-xl border shadow-sm">
      <CardHeader className="px-6 pt-5 pb-1">
        <CardTitle className="text-2xl font-bold sm:text-3xl">
          Raise Ticket
        </CardTitle>

        <CardDescription className="text-sm text-muted-foreground">
          Submit a support ticket for your issue.
        </CardDescription>

      </CardHeader>

      <CardContent className="space-y-4 px-6 pb-6">

        {/* Department / Category */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div className="space-y-2">

            <Label className="flex items-center gap-1.5 text-sm">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
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
              <SelectTrigger className="h-9 w-full min-w-0 focus:!ring-0 focus:!border-slate-300 data-[state=open]:!border-slate-300 data-[state=open]:!ring-0">
                <SelectValue
                  placeholder={
                    departmentsLoading
                      ? "Loading..."
                      : "Select Department"
                  }
                >
                  {departments.find(
                    (department) =>
                      department.ID === departmentId
                  )?.DepartmentName}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {departments.map((department) => (
                  <SelectItem
                    key={department.ID}
                    value={department.ID.toString()}
                    className="focus:!bg-green-50 focus:!text-green-900 data-[highlighted]:!bg-green-50 data-[highlighted]:!text-green-900 data-[state=checked]:!bg-green-50 data-[state=checked]:!text-green-900 [&_svg]:!text-green-600"
                  >
                    {department.DepartmentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>

          <div className="space-y-1.5">

            <Label className="flex items-center gap-1.5 text-sm">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
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
                  (item) => item.ID.toString() === value
                );

                return category?.CategoryName ?? "";
              }}
            >
              <SelectTrigger className="h-9 w-full min-w-0 focus:!ring-0 focus:!border-slate-300 data-[state=open]:!border-slate-300 data-[state=open]:!ring-0">
                <SelectValue
                  placeholder={
                    categoriesLoading
                      ? "Loading..."
                      : "Select Category"
                  }
                >
                  {categories.find(
                    (category) =>
                      category.ID === categoryId
                  )?.CategoryName}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.ID}
                    value={category.ID.toString()}
                    className="focus:!bg-green-50 focus:!text-green-900 data-[highlighted]:!bg-green-50 data-[highlighted]:!text-green-900 data-[state=checked]:!bg-green-50 data-[state=checked]:!text-green-900 [&_svg]:!text-green-600"
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

            <Label className="flex items-center gap-1.5 text-sm">
              <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
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
                  (item) => item.ID.toString() === value
                );

                return subCategory?.SubCategoryName ?? "";
              }}
            >
              <SelectTrigger className="h-9 w-full min-w-0 focus:!ring-0 focus:!border-slate-300 data-[state=open]:!border-slate-300 data-[state=open]:!ring-0">
                <SelectValue
                  placeholder={
                    subCategoriesLoading
                      ? "Loading..."
                      : "Select Sub Category"
                  }
                >
                  {subCategories.find(
                    (subCategory) =>
                      subCategory.ID === subCategoryId
                  )?.SubCategoryName}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {subCategories.map((subCategory) => (
                  <SelectItem
                    key={subCategory.ID}
                    value={subCategory.ID.toString()}
                    className="focus:!bg-green-50 focus:!text-green-900 data-[highlighted]:!bg-green-50 data-[highlighted]:!text-green-900 data-[state=checked]:!bg-green-50 data-[state=checked]:!text-green-900 [&_svg]:!text-green-600"
                  >
                    {subCategory.SubCategoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>

          <div className="space-y-1.5">

            <Label className="flex items-center gap-1.5 text-sm">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              Asset Number

              {isAssetNumberRequired && (
                <span className="ml-1 text-red-600">
                  *
                </span>
              )}
            </Label>

            <Input
              className="h-9 focus-visible:!ring-0 focus-visible:!border-slate-300"
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

          <div className="space-y-1.5">

            <Label className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Location
              <span className="ml-1 text-red-600">
                *
              </span>
            </Label>

            <Input
             className="h-9 focus-visible:!ring-0 focus-visible:!border-slate-300"
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
              placeholder="Enter location"
            />

          </div>

          <div className="space-y-1.5">

            <Label className="flex items-center gap-1.5 text-sm">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Contact Number
              <span className="ml-1 text-red-600">
                *
              </span>
            </Label>

            <Input
              className="h-9 focus-visible:!ring-0 focus-visible:!border-slate-300"
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

        <div className="space-y-1.5">

          <Label className="flex items-center gap-1.5 text-sm">
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            Subject
            <span className="ml-1 text-red-600">
              *
            </span>
          </Label>

          <Input
            className="h-9 focus-visible:!ring-0 focus-visible:!border-slate-300"
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

        <div className="space-y-1.5">

          <Label className="flex items-center gap-1.5 text-sm">
            <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
            Description
            <span className="ml-1 text-red-600">
              *
            </span>
          </Label>

          <Textarea
            rows={4}
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
        <div className="flex justify-end">
          <Button
            type="button"
            className="h-10 w-[150px] rounded-lg bg-green-700 text-sm font-semibold text-white hover:bg-green-800"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Ticket"}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
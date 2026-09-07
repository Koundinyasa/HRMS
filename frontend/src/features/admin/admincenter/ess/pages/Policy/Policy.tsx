import { useState } from "react";
import {
  X,
  Upload,
  ChevronDown,
  Search,
  Eye,
  Download,
  Pencil,
  Trash2,
  MoreHorizontal,
  Bookmark,
  Clock
} from "lucide-react";

type PolicyItem = {
  id: number;
  policyName: string;
  description: string;
  date: string;
  fileSize: string;
  acknowledgement: string;
};

const policyData: PolicyItem[] = [
  {
    id: 1,
    policyName: "Leave Policy",
    description: "Guidelines for annual and casual leave.",
    date: "2026-04-09",
    fileSize: "1.2 MB",
    acknowledgement: "Read only",
  },
  {
    id: 2,
    policyName: "IT Security & Asset Policy",
    description: "Acceptable use guidelines for company assets.",
    date: "2026-05-12",
    fileSize: "2.4 MB",
    acknowledgement: "E-Signature",
  },
];

type DropdownOption = {
  value: string;
  label: string;
};

type CustomDropdownProps = {
  value: string;
  placeholder: string;
  options: DropdownOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
};

function CustomDropdown({
  value,
  placeholder,
  options,
  isOpen,
  onToggle,
  onSelect,
}: CustomDropdownProps) {
  const selectedOption = options.find(
    (option) => option.value === value
  );

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={onToggle}
        className={`
          appearance-none
          w-full
          h-8
          px-2.5
          pr-8
          border
          border-gray-200
          rounded-md
          text-xs
          text-gray-500
          outline-none
          bg-white
          text-left
          truncate
          flex
          items-center
          justify-between
          ${isOpen ? "border-purple-500" : ""}
        `}
      >
        <span className="truncate">
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={14}
          className={`
            absolute
            right-2.5
            text-gray-400
            pointer-events-none
            transition-transform
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full
            mt-1
            z-[100]
            w-full
            max-w-full
            overflow-hidden
            rounded-md
            border
            border-gray-200
            bg-white
            shadow-lg
          "
        >
          <div className="max-h-40 overflow-y-auto overflow-x-hidden">
            <button
              type="button"
              onClick={() => onSelect("")}
              className="
                block
                w-full
                px-2.5
                py-2
                text-left
                text-xs
                text-gray-500
                truncate
                hover:bg-purple-50
              "
            >
              {placeholder}
            </button>

            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                className="
                  block
                  w-full
                  px-2.5
                  py-2
                  text-left
                  text-xs
                  text-gray-700
                  truncate
                  hover:bg-purple-50
                "
                title={option.label}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Policy() {
  const [showForm, setShowForm] = useState(false);
  const [showPending, setShowPending] = useState(false);

  const [search, setSearch] = useState("");

  const [openDropdown, setOpenDropdown] = useState<
    "filter" | "acknowledgementType" | null
  >(null);

  const [formData, setFormData] = useState({
    policyName: "",
    description: "",
    filter: "",
    date: "",
    acknowledgementType: "",
    noAttachmentDownload: false,
    file: null as File | null,
  });

  const [activeTab, setActiveTab] = useState<
    "accepted" | "rejected" | "pending"
  >("pending");

  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const employees = [
    {
      id: 1,
      refNo: "1",
      initials: "RU",
      name: "RAJESH UBBAPALLY",
    },
    {
      id: 2,
      refNo: "274412",
      initials: "CS",
      name: "Chandra Shekar Saka",
    },
    {
      id: 3,
      refNo: "284512",
      initials: "VG",
      name: "Varalaxmi Gumudala",
    },
    {
      id: 4,
      refNo: "284513",
      initials: "NN",
      name: "Nikhitha Narala",
    },
    {
      id: 5,
      refNo: "284514",
      initials: "SC",
      name: "Sreya Chaluvadi",
    },
    {
      id: 6,
      refNo: "284519",
      initials: "RP",
      name: "Rakesh Peddi",
    },
    {
      id: 7,
      refNo: "284520",
      initials: "IS",
      name: "Ishika Santosh Mokati",
    },
    {
      id: 8,
      refNo: "294621",
      initials: "RV",
      name: "Rama Veera Manikanta Pusunuri",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleSave = () => {
    console.log("Policy:", formData);

    setShowForm(false);
    setOpenDropdown(null);

    setFormData({
      policyName: "",
      description: "",
      filter: "",
      date: "",
      acknowledgementType: "",
      noAttachmentDownload: false,
      file: null,
    });
  };

  const toggleEmployee = (id: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(id)
        ? prev.filter((employeeId) => employeeId !== id)
        : [...prev, id]
    );
  };

  const toggleAllEmployees = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(
        employees.map((employee) => employee.id)
      );
    }
  };

  const filteredPolicies = policyData.filter((policy) => {
    const value = search.toLowerCase();

    return (
      policy.policyName.toLowerCase().includes(value) ||
      policy.description.toLowerCase().includes(value)
    );
  });

  const filterOptions: DropdownOption[] = [
    {
      value: "all",
      label: "All Employees",
    },
    {
      value: "department",
      label: "Department",
    },
    {
      value: "designation",
      label: "Designation",
    },
  ];

  const acknowledgementOptions: DropdownOption[] = [
    {
      value: "not-required",
      label: "Not Required",
    },
    {
      value: "read-only",
      label: "Read only",
    },
    {
      value: "read-and-acknowledge",
      label: "Read and acknowledge",
    },
    {
      value: "accept-and-reject",
      label: "Accept and Reject",
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-100px)]">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex items-center justify-between bg-[#F7F3FF] px-4 py-3 rounded-xl mb-5">
        <button
          type="button"
          className="px-5 py-2 bg-[#7C4DFF] text-white rounded-lg text-sm font-medium"
        >
          Policy
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setOpenDropdown(null);
            }}
            className="px-5 py-2 bg-[#7C4DFF] text-white rounded-lg text-sm font-medium flex items-center gap-2"
          >
            + Policy
          </button>

          <button
            type="button"
            className="text-gray-700 hover:text-purple-600"
            title="History"
          >
            <Clock size={20} />
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="mb-3">
        <div className="relative w-[280px] max-w-full">

          <Search
            size={15}
            className="absolute left-3 top-2.5 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search policies by name, description..."
            className="
              w-full
              h-9
              pl-9
              pr-3
              border
              border-gray-200
              rounded-md
              text-xs
              outline-none
              focus:border-purple-500
            "
          />

        </div>
      </div>

      {/* ================================================= */}
      {/* POLICY TABLE */}
      {/* ================================================= */}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-xs">

            <thead className="bg-[#F8FAFC] border-b border-gray-200">

              <tr>

                <th className="text-left px-3 py-3 font-medium text-gray-700 whitespace-nowrap">
                  Policy Name ↕
                </th>

                <th className="text-left px-3 py-3 font-medium text-gray-700">
                  Description ↕
                </th>

                <th className="text-left px-3 py-3 font-medium text-gray-700 whitespace-nowrap">
                  Date ↕
                </th>

                <th className="text-left px-3 py-3 font-medium text-gray-700 whitespace-nowrap">
                  File Size
                </th>

                <th className="text-left px-3 py-3 font-medium text-gray-700">
                  Acknowledgement
                </th>

                <th className="text-left px-3 py-3 font-medium text-gray-700 whitespace-nowrap">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPolicies.map((policy) => (

                <tr
                  key={policy.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >

                  <td className="px-3 py-3 font-medium text-gray-800 whitespace-nowrap">
                    {policy.policyName}
                  </td>

                  <td className="px-3 py-3 text-gray-500 max-w-[230px] truncate">
                    {policy.description}
                  </td>

                  <td className="px-3 py-3 text-gray-500 whitespace-nowrap">
                    {policy.date}
                  </td>

                  <td className="px-3 py-3 text-gray-500 whitespace-nowrap">
                    {policy.fileSize}
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">

                    <span className="px-2.5 py-1 rounded-full bg-[#EEF2FF] text-[#7C4DFF] text-[10px]">
                      {policy.acknowledgement}
                    </span>

                  </td>

                  <td className="px-3 py-3">

                    <div className="flex items-center gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          setShowPending(true)
                        }
                        title="View Result"
                        className="px-3 py-1.5 bg-[#16B981] text-white rounded-md text-[10px] font-medium"
                      >
                        View Result
                      </button>

                      <button
                        type="button"
                        title="View"
                        className="text-gray-500 hover:text-purple-600"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        title="Download"
                        className="text-gray-500 hover:text-purple-600"
                      >
                        <Download size={15} />
                      </button>

                      <button
                        type="button"
                        title="Edit"
                        className="text-gray-500 hover:text-purple-600"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================================================= */}
      {/* TABLE FOOTER */}
      {/* ================================================= */}

      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">

        <span>
          Showing 1 - {filteredPolicies.length} of{" "}
          {filteredPolicies.length} records
        </span>

        <div className="flex items-center gap-1">

          <button className="w-7 h-7 border rounded text-gray-400">
            ‹
          </button>

          <button className="w-7 h-7 bg-[#2563EB] text-white rounded">
            1
          </button>

          <button className="w-7 h-7 border rounded text-gray-500">
            ›
          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* POLICY FORM MODAL */}
      {/* ================================================= */}

      {showForm && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/20
            p-3
            overflow-y-auto
          "
          onClick={() => setOpenDropdown(null)}
        >

          <div
            className="
              w-[460px]
              max-w-full
              bg-white
              rounded-xl
              shadow-2xl
              relative
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}

            <div className="flex items-center justify-between px-5 py-3.5 border-b">

              <h2 className="text-sm font-semibold text-gray-800">
                Policy Form
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setOpenDropdown(null);
                }}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={18} />
              </button>

            </div>

            {/* FORM */}

            <div className="p-4">

              {/* ROW 1 */}

              <div className="grid grid-cols-2 gap-3">

                <div className="min-w-0">

                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Policy Name
                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="policyName"
                    value={formData.policyName}
                    onChange={handleInputChange}
                    placeholder="File.pdf"
                    className="
                      block
                      w-full
                      min-w-0
                      h-8
                      px-2.5
                      border
                      border-gray-200
                      rounded-md
                      text-xs
                      outline-none
                      focus:border-purple-500
                    "
                  />

                </div>

                <div className="min-w-0">

                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="document file briefing"
                    rows={1}
                    className="
                      block
                      w-full
                      min-w-0
                      h-8
                      px-2.5
                      py-2
                      border
                      border-gray-200
                      rounded-md
                      text-xs
                      outline-none
                      resize-none
                      overflow-hidden
                      focus:border-purple-500
                    "
                  />

                </div>

              </div>

              {/* ROW 2 */}

              <div className="grid grid-cols-2 gap-3 mt-3">

                {/* FILTER */}

                <div className="min-w-0">

                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Select Filter
                  </label>

                  <CustomDropdown
                    value={formData.filter}
                    placeholder="Select Select Filter"
                    options={filterOptions}
                    isOpen={
                      openDropdown === "filter"
                    }
                    onToggle={() =>
                      setOpenDropdown(
                        openDropdown === "filter"
                          ? null
                          : "filter"
                      )
                    }
                    onSelect={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        filter: value,
                      }));

                      setOpenDropdown(null);
                    }}
                  />

                </div>

                {/* DATE */}

                <div className="min-w-0">

                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Date
                  </label>

                  <div className="relative w-full">

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="
                        block
                        w-full
                        min-w-0
                        h-8
                        px-2.5
                        border
                        border-gray-200
                        rounded-md
                        text-xs
                        text-gray-500
                        outline-none
                      "
                    />

                  </div>

                </div>

              </div>

              {/* ACKNOWLEDGEMENT */}

              <div className="mt-3">

                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Acknowledgement Type
                </label>

                <CustomDropdown
                  value={
                    formData.acknowledgementType
                  }
                  placeholder="Select Acknowledgement Type"
                  options={
                    acknowledgementOptions
                  }
                  isOpen={
                    openDropdown ===
                    "acknowledgementType"
                  }
                  onToggle={() =>
                    setOpenDropdown(
                      openDropdown ===
                        "acknowledgementType"
                        ? null
                        : "acknowledgementType"
                    )
                  }
                  onSelect={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      acknowledgementType:
                        value,
                    }));

                    setOpenDropdown(null);
                  }}
                />

              </div>

              {/* CHECKBOX */}

              <label className="flex items-center gap-2 mt-3 text-[11px] text-gray-600 cursor-pointer">

                <input
                  type="checkbox"
                  checked={
                    formData.noAttachmentDownload
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      noAttachmentDownload:
                        e.target.checked,
                    }))
                  }
                />

                Do not allow attachment downloads.

              </label>

              {/* FILE */}

              <div className="mt-4">

                <label
                  htmlFor="policy-file"
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    h-28
                    w-full
                    border
                    border-dashed
                    border-gray-300
                    rounded-md
                    cursor-pointer
                    hover:bg-purple-50
                  "
                >

                  <Upload
                    size={24}
                    className="text-purple-400 mb-2"
                  />

                  <span className="text-xs text-gray-500">
                    Drag and drop
                  </span>

                  <span className="text-xs text-gray-400">
                    - or -
                  </span>

                  <span className="text-xs text-purple-500 font-medium">
                    Browse
                  </span>

                  {formData.file && (
                    <span className="text-[10px] text-green-600 mt-1 truncate max-w-[90%]">
                      {formData.file.name}
                    </span>
                  )}

                </label>

                <input
                  id="policy-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-2 px-5 py-3 border-t">

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setOpenDropdown(null);
                }}
                className="px-4 py-1.5 border border-gray-200 rounded-md text-xs text-gray-700"
              >
                × Close
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-[#7C4DFF] text-white rounded-md text-xs flex items-center gap-1.5"
              >
                <Bookmark size={14} />
                Save
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* PENDING / RESULT MODAL */}
      {/* ================================================= */}

      {showPending && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/10 p-3">

          <div className="w-[500px] max-w-full bg-white rounded-xl shadow-2xl overflow-hidden">

            {/* TABS */}

            <div className="flex border-b overflow-x-auto">

              <button
                type="button"
                onClick={() =>
                  setActiveTab("accepted")
                }
                className={`px-5 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === "accepted"
                    ? "text-gray-800 border-b-2 border-purple-500"
                    : "text-gray-500"
                }`}
              >
                Accepted (0)
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("rejected")
                }
                className={`px-5 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === "rejected"
                    ? "text-gray-800 border-b-2 border-purple-500"
                    : "text-gray-500"
                }`}
              >
                Rejected (0)
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("pending")
                }
                className={`px-5 py-3 text-xs font-medium whitespace-nowrap ${
                  activeTab === "pending"
                    ? "text-purple-600 border-b-2 border-purple-500"
                    : "text-gray-500"
                }`}
              >
                Pending (90)
              </button>

              <div className="flex-1" />

              <button
                type="button"
                onClick={() =>
                  setShowPending(false)
                }
                className="px-4 text-gray-500"
              >
                <X size={17} />
              </button>

            </div>

            {/* SUB HEADER */}

            <div className="flex items-center justify-between px-5 py-4">

              <div className="min-w-0">

                <span className="text-sm font-semibold text-gray-800">
                  {activeTab === "pending"
                    ? "Pending List"
                    : activeTab === "accepted"
                      ? "Accepted List"
                      : "Rejected List"}
                </span>

                {activeTab === "pending" && (
                  <span className="ml-2 text-xs text-gray-400">
                    • Action Required
                  </span>
                )}

              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  className="w-8 h-8 border rounded-lg flex items-center justify-center"
                >
                  <Search size={15} />
                </button>

                <button
                  type="button"
                  className="w-8 h-8 border rounded-lg flex items-center justify-center"
                >
                  <MoreHorizontal size={15} />
                </button>

              </div>

            </div>

            {/* TABLE HEADER */}

            <div className="grid grid-cols-[45px_70px_1fr_55px] bg-[#F8F9FC] border-y px-4 py-2 text-[10px] font-semibold text-gray-500">

              <div>
                <input
                  type="checkbox"
                  checked={
                    selectedEmployees.length ===
                    employees.length
                  }
                  onChange={toggleAllEmployees}
                />
              </div>

              <div>REF NO</div>

              <div>EMPLOYEE NAME</div>

              <div>ACTION</div>

            </div>

            {/* EMPLOYEES */}

            <div className="max-h-[310px] overflow-y-auto">

              {employees.map((employee) => (

                <div
                  key={employee.id}
                  className="grid grid-cols-[45px_70px_1fr_55px] items-center px-4 py-2.5 border-b text-xs"
                >

                  <div>

                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(
                        employee.id
                      )}
                      onChange={() =>
                        toggleEmployee(
                          employee.id
                        )
                      }
                    />

                  </div>

                  <div className="text-gray-600">
                    {employee.refNo}
                  </div>

                  <div className="flex items-center gap-2 min-w-0">

                    <span className="w-6 h-6 flex-shrink-0 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[8px] font-medium">
                      {employee.initials}
                    </span>

                    <span className="text-gray-700 truncate">
                      {employee.name}
                    </span>

                  </div>

                  <button
                    type="button"
                    className="text-gray-500"
                  >
                    <MoreHorizontal size={15} />
                  </button>

                </div>

              ))}

            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-between px-5 py-4 bg-[#F8F8FC]">

              <span className="text-[10px] text-gray-600">
                Showing 1-8 of 90
              </span>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowPending(false)
                  }
                  className="px-4 py-2 border bg-white rounded-lg text-xs"
                >
                  × Cancel
                </button>

                <button
                  type="button"
                  className="px-4 py-2 bg-[#7C4DFF] text-white rounded-lg text-xs"
                >
                  ✓ Approve Selected (
                  {selectedEmployees.length})
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
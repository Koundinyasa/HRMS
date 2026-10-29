import { useState } from "react";
import {
  X,
  ChevronDown,
  Clock3,
} from "lucide-react";

type HelpDeskTab = "create" | "pending" | "completed";

export default function HelpDesk() {
  const [activeTab, setActiveTab] =
    useState<HelpDeskTab>("create");

  const [showModal, setShowModal] =
    useState(false);

  const [category, setCategory] =
    useState("");

  const [categoryType, setCategoryType] =
    useState("");

  // ADDED ONLY FOR CATEGORY TYPE DROPDOWN
  const [categoryTypeOpen, setCategoryTypeOpen] =
    useState(false);

  // =====================================================
  // TABS
  // =====================================================

  const tabs = [
    {
      key: "create" as HelpDeskTab,
      label: "Create Help Desk",
    },
    {
      key: "pending" as HelpDeskTab,
      label: "Pending",
    },
    {
      key: "completed" as HelpDeskTab,
      label: "Completed",
    },
  ];

  // =====================================================
  // OPEN MODAL
  // =====================================================

  const handleAddNew = () => {
    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleClose = () => {
    setShowModal(false);
    setCategory("");
    setCategoryType("");

    // CLOSE CATEGORY TYPE DROPDOWN
    setCategoryTypeOpen(false);
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = () => {
    if (!category.trim()) {
      return;
    }

    if (!categoryType) {
      return;
    }

    console.log({
      category,
      categoryType,
    });

    handleClose();
  };

  // =====================================================
  // CONTENT
  // =====================================================

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return (
          <div className="min-h-[550px] font-[Urbanist]">
            {/* Empty content area */}
          </div>
        );

      case "pending":
        return (
          <div className="p-5 font-[Urbanist]">
            <div className="border border-black rounded-lg overflow-hidden font-[Urbanist]">

              <div className="grid grid-cols-4 bg-gray-50 border-b px-4 py-3 text-xs font-medium text-gray-600">
                <span>Category</span>
                <span>Category Type</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              <div className="px-4 py-12 text-center text-sm text-gray-400 font-[Urbanist]">
                No Pending Help Desk Requests
              </div>

            </div>
          </div>
        );

      case "completed":
        return (
          <div className="p-5 font-[Urbanist]">
            <div className="border border-black rounded-lg overflow-hidden font-[Urbanist]">

              <div className="grid grid-cols-4 bg-gray-50 border-b px-4 py-3 text-xs font-medium text-gray-600">
                <span>Category</span>
                <span>Category Type</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              <div className="px-4 py-12 text-center text-sm text-gray-400 font-[Urbanist]">
                No Completed Help Desk Requests
              </div>

            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-100px)] font-[Urbanist]">

      {/* ================================================= */}
      {/* TOP BAR */}
      {/* ================================================= */}

      <div
        className="
          w-full
          flex
          items-center
          bg-[#F7F3FF]
          rounded-xl
          px-4
          py-2.5
          mb-4

          max-[639px]:overflow-x-auto
          max-[639px]:overflow-y-hidden
         font-[Urbanist]"
      >

        <div
          className="
            flex
            items-center
            justify-between
            min-w-max
            w-full
            gap-2
           font-[Urbanist]"
        >

          {/* ================================================= */}
          {/* TABS */}
          {/* ================================================= */}

          <div
            className="
              flex
              items-center
              gap-1
              shrink-0
              sm:flex-1
             font-[Urbanist]"
          >

            {tabs.map((tab) => {

              const isActive =
                activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.key)
                  }
                  className={`
                    shrink-0
                    px-5
                    py-2
                    rounded-lg
                    text-xs
                    whitespace-nowrap
                    transition-all

                    ${
                      isActive
                        ? "bg-[#7C4DFF] text-white font-medium"
                        : "text-gray-600 hover:bg-white/70"
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}

          </div>

          {/* ================================================= */}
          {/* ADD NEW + HISTORY */}
          {/* ================================================= */}

          <div
            className="
              flex
              items-center
              shrink-0
              ml-2
             font-[Urbanist]"
          >

            {/* ADD NEW */}

            <button
              type="button"
              onClick={handleAddNew}
              className="
                flex
                items-center
                gap-2
                shrink-0
                bg-[#7C4DFF]
                hover:bg-[#6D3FE8]
                text-white
                px-4
                py-2
                rounded-lg
                text-xs
                font-medium
                whitespace-nowrap
              "
            >
              <span className="text-base leading-none font-[Urbanist]">
                +
              </span>

              Add New
            </button>

            {/* HISTORY */}

            <button
              type="button"
              className="
                ml-4
                shrink-0
                text-gray-500
                hover:text-purple-600
               font-[Urbanist]"
              title="History"
            >
              <Clock3 size={17} />
            </button>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* PAGE CONTENT */}
      {/* ================================================= */}

      <div className="bg-white rounded-xl min-h-[600px] font-[Urbanist]">

        {renderContent()}

      </div>

      {/* ================================================= */}
      {/* ADD NEW MODAL */}
      {/* ================================================= */}

      {showModal && (

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
           font-[Urbanist]"
        >

          {/* MODAL */}

          <div
            className="
              w-[345px]
              max-w-[90vw]
              bg-white
              rounded-xl
              shadow-2xl
              overflow-hidden
             font-[Urbanist]"
          >

            {/* =========================================== */}
            {/* MODAL HEADER */}
            {/* =========================================== */}

            <div
              className="
                flex
                items-center
                justify-between
                px-4
                py-3
                border-b
                border-black
               font-[Urbanist]"
            >

              <h2
                className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
              >
                Add New
              </h2>

              <button
                type="button"
                onClick={handleClose}
                className="
                  text-gray-500
                  hover:text-gray-800
                 font-[Urbanist]"
              >
                <X size={17} />
              </button>

            </div>

            {/* =========================================== */}
            {/* MODAL BODY */}
            {/* =========================================== */}

            <div className="px-4 py-4 font-[Urbanist]">

              {/* CATEGORY */}

              <div className="mb-4 font-[Urbanist]">

                <label
                  className="
                    block
                    text-[11px]
                    font-medium
                    text-gray-700
                    mb-1.5
                  "
                >
                  Category

                  <span className="text-red-500 ml-1 font-[Urbanist]">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  placeholder="Enter category"
                  className="
                    w-full
                    h-8
                    px-2.5
                    border
                    border-black
                    rounded-md
                    text-xs
                    text-gray-700
                    outline-none
                    placeholder:text-gray-300
                    focus:border-black
                    focus:ring-1
                    focus:ring-[#7C4DFF]/20
                   font-[Urbanist]"
                />

              </div>

              {/* CATEGORY TYPE */}

              <div>

                <label
                  className="
                    block
                    text-[11px]
                    font-medium
                    text-gray-700
                    mb-1.5
                  "
                >
                  Category Type

                  <span className="text-red-500 ml-1 font-[Urbanist]">
                    *
                  </span>
                </label>

                {/* ================================================= */}
                {/* RESPONSIVE CUSTOM CATEGORY TYPE DROPDOWN */}
                {/* ================================================= */}

                <div className="relative w-full font-[Urbanist]">

                  {/* SELECT BUTTON */}

                  <button
                    type="button"
                    onClick={() =>
                      setCategoryTypeOpen(
                        !categoryTypeOpen
                      )
                    }
                    className="
                      w-full
                      h-8
                      px-2.5
                      pr-8
                      border
                      border-black
                      rounded-md
                      text-xs
                      text-gray-500
                      outline-none
                      text-left
                      bg-white
                      relative
                      focus:border-black
                      focus:ring-1
                      focus:ring-[#7C4DFF]/20
                     font-[Urbanist]"
                  >

                    <span className="block truncate font-[Urbanist]">
                      {categoryType
                        ? categoryType
                            .charAt(0)
                            .toUpperCase() +
                          categoryType.slice(1)
                        : "Select Category Type"}
                    </span>

                    <ChevronDown
                      size={14}
                      className={`
                        absolute
                        right-2.5
                        top-1.5
                        text-gray-400
                        pointer-events-none
                        transition-transform
                        ${
                          categoryTypeOpen
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />

                  </button>

                  {/* ================================================= */}
                  {/* DROPDOWN OPTIONS */}
                  {/* ================================================= */}

                  {categoryTypeOpen && (

                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        bottom-full
                        mb-1
                        z-[100]
                        w-full
                        max-w-full
                        bg-white
                        border
                        border-black
                        rounded-md
                        shadow-lg
                        overflow-hidden
                       font-[Urbanist]"
                    >

                      <div
                        className="
                          max-h-32
                          overflow-y-auto
                          overflow-x-hidden
                         font-[Urbanist]"
                      >

                        {[
                          {
                            value: "",
                            label: "Select Category Type",
                          },
                          {
                            value: "general",
                            label: "General",
                          },
                          {
                            value: "hr",
                            label: "HR",
                          },
                          {
                            value: "payroll",
                            label: "Payroll",
                          },
                          {
                            value: "technical",
                            label: "Technical",
                          },
                          {
                            value: "other",
                            label: "Other",
                          },
                        ].map((option) => (

                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setCategoryType(
                                option.value
                              );

                              setCategoryTypeOpen(
                                false
                              );
                            }}
                            className="
                              block
                              w-full
                              max-w-full
                              h-7
                              px-2.5
                              text-left
                              text-xs
                              text-gray-600
                              truncate
                              hover:bg-purple-50
                              hover:text-[#7C4DFF]
                             font-[Urbanist]"
                          >
                            {option.label}
                          </button>

                        ))}

                      </div>

                    </div>

                  )}

                </div>

              </div>

            </div>

            {/* =========================================== */}
            {/* FOOTER */}
            {/* =========================================== */}

            <div
              className="
                flex
                justify-end
                gap-2
                px-4
                py-3
                bg-gray-50
                border-t
                border-black
               font-[Urbanist]"
            >

              {/* CLOSE */}

              <button
                type="button"
                onClick={handleClose}
                className="
                  flex
                  items-center
                  gap-1
                  px-4
                  py-1.5
                  border
                  border-black
                  bg-white
                  rounded-md
                  text-xs
                  text-gray-700
                  hover:bg-gray-100
                 font-[Urbanist]"
              >
                <X size={12} />
                Close
              </button>

              {/* SAVE */}

              <button
                type="button"
                onClick={handleSave}
                className="
                  px-4
                  py-1.5
                  bg-[#7C4DFF]
                  text-white
                  rounded-md
                  text-xs
                  font-medium
                  hover:bg-[#6D3FE8]
                "
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
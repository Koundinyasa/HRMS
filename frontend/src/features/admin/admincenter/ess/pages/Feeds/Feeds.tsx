import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import feedsEmptyState from "../../../../../../assets/images/feeds-empty-state(1).png";

export default function Feeds() {
  const navigate = useNavigate();

  const handleAddPoll = () => {
    navigate("/koundinyasatech/admin/ess/poll");
  };

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-white">
      <div className="flex items-center justify-between bg-[#F7F3FF] px-4 py-3 rounded-xl mb-5">
        <button
          type="button"
          className="px-5 py-2 bg-[#7C4DFF] text-white rounded-lg text-sm font-medium"
        >
          Feeds
        </button>
        {/* RIGHT BUTTON */}
        <button
          type="button"
          onClick={handleAddPoll}
          className="flex items-center gap-2 px-5 py-2 bg-[#7C4DFF] text-white rounded-lg text-sm font-medium hover:bg-[#6D3FE8]"
        >
          <Plus size={16} />
          Add Polls
        </button>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md h-[300px]">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-sm font-medium text-gray-800">
              Groups
            </h2>
            <button
              type="button"
              className="text-gray-700 hover:text-purple-600"
              title="Add Group"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-[245px]">
            <img
              src={feedsEmptyState}
              alt="No data found"
              className="w-[180px] h-auto object-contain"
            />
            <p className="mt-2 text-[10px] text-gray-500">
              No Data Found in - Feeds
            </p>
          </div>
        </div>

        {/* ============================= */}
        {/* ALL FEEDS CARD */}
        {/* ============================= */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-md h-[300px]">

          {/* CARD HEADER */}
          <div className="flex items-center justify-between px-4 py-3">

            <h2 className="text-sm font-medium text-gray-800">
              All Feeds
            </h2>

            <button
              type="button"
              className="text-gray-700 hover:text-purple-600"
              title="Add Feed"
            >
              <Plus size={16} />
            </button>
          </div>
          {/* EMPTY STATE */}
          <div className="flex flex-col items-center justify-center h-[245px]">
            <img
              src={feedsEmptyState}
              alt="No data found"
              className="w-[180px] h-auto object-contain"
            />
            <p className="mt-2 text-[10px] text-gray-500">
              No Data Found in - Feeds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
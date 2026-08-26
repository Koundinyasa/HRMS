import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

import { useHelpDesk } from "../hooks/useHelpDesk";

export default function KnowledgeBaseContent() {
  const {
    knowledgeBase,
    knowledgeBaseLoading,
    knowledgeBaseError,
  } = useHelpDesk();

  const [openId, setOpenId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ==================================================
  // SEARCH
  // ==================================================

  const filteredKnowledgeBase =
    knowledgeBase.filter((item) =>
      item.Question.toLowerCase().includes(
        searchTerm.toLowerCase()
      )
    );

  // ==================================================
  // LOADING
  // ==================================================

  if (knowledgeBaseLoading) {
    return (
      <div className="mt-8 px-8">
        <div className="rounded-2xl border bg-white p-8">

          <h1 className="text-2xl font-bold">
            Knowledge Base
          </h1>

          <p className="mt-2 text-slate-500">
            Loading knowledge base articles...
          </p>

          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>

        </div>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (knowledgeBaseError) {
    return (
      <div className="mt-8 px-8">
        <div className="rounded-2xl border bg-white p-8">

          <h1 className="text-2xl font-bold">
            Knowledge Base
          </h1>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            Unable to load knowledge base articles.
          </div>

        </div>
      </div>
    );
  }

  // ==================================================
  // CONTENT
  // ==================================================

  return (
    <div className="mt-8 px-8 pb-8">

      <div className="rounded-2xl border bg-white p-8">

        {/* HEADER */}

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Knowledge Base
          </h1>

          <p className="mt-2 text-slate-500">
            Find answers to frequently asked questions.
          </p>
        </div>

        {/* SEARCH */}

        <div className="relative mt-6">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search knowledge base..."
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              py-3
              pl-11
              pr-4
              text-sm
              outline-none
              transition
              focus:border-[var(--primary-color)]
              focus:ring-1
              focus:ring-[var(--primary-color)]
            "
          />

        </div>

        {/* ARTICLES */}

        <div className="mt-6 space-y-3">

          {filteredKnowledgeBase.length > 0 ? (

            filteredKnowledgeBase.map((item) => {

              const isOpen =
                openId === item.ID;

              return (
                <div
                  key={item.ID}
                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    transition-all
                    duration-200
                  "
                >

                  {/* QUESTION */}

                  <button
                    type="button"
                    onClick={() =>
                      setOpenId(
                        isOpen ? null : item.ID
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-4
                      px-5
                      py-4
                      text-left
                      transition
                      hover:bg-slate-50
                    "
                  >

                    <span className="font-medium text-slate-800">
                      {item.Question}
                    </span>

                    {isOpen ? (
                      <ChevronUp
                        size={20}
                        className="shrink-0 text-slate-500"
                      />
                    ) : (
                      <ChevronDown
                        size={20}
                        className="shrink-0 text-slate-500"
                      />
                    )}

                  </button>

                  {/* ANSWER */}

                  {isOpen && (
                    <div className="border-t bg-slate-50 px-5 py-4">

                      <p className="text-sm leading-6 text-slate-600">
                        {item.Answer}
                      </p>

                    </div>
                  )}

                </div>
              );
            })

          ) : (

            <div className="rounded-xl border border-dashed p-8 text-center">

              <p className="font-medium text-slate-700">
                No articles found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try searching with a different keyword.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
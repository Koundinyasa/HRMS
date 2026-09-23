import { useState, useRef, useEffect } from "react";
import React from "react";

// Chrome/Edge ship SpeechRecognition natively; Firefox/Safari don't support it
// at all, so we detect once and simply hide the mic button when unavailable
// rather than showing a button that would silently do nothing.
interface SpeechRecognitionResultEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

const speechWindow =
  typeof window !== "undefined" ? (window as SpeechRecognitionWindow) : null;

const SpeechRecognitionAPI =
  speechWindow?.SpeechRecognition ??
  speechWindow?.webkitSpeechRecognition ??
  null;

import { useChatbot } from "../hooks/useChatbot";

import { useDashboard } from "@/features/employee/dashboard/hooks/useDashboard";
import { Calendar } from "lucide-react";

import type {
  ChatMessage,
  ChatAction,
  ChatWidget,
  ChatTeamMember,
  ChatListPreviewRow,
} from "../types/chatbot.types";

import TeamPreviewModal from "./TeamPreviewModal";
import ListPreviewModal from "./ListPreviewModal";

import { useResetConversationMutation } from "../api/chatbotApi";

interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

// AI replies often come back with lightweight markdown (**bold**, "- "/"* "
// bullets, "1. " numbered lists). The chat bubble used to render this as raw
// text, so the person just saw literal asterisks and numbers. This turns
// just those few patterns into real formatting — deliberately not a full
// markdown parser (no headers, links, code blocks, tables), just the
// handful of constructs the model actually produces.
function renderInlineBold(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={`${keyPrefix}-b-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return part ? (
      <React.Fragment key={`${keyPrefix}-t-${i}`}>{part}</React.Fragment>
    ) : null;
  });
}

function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = (key: string) => {
    if (!listItems.length || !listType) return;
    const items = listItems;
    blocks.push(
      listType === "ul" ? (
        <ul key={key} className="list-disc pl-5 my-1 space-y-0.5">
          {items.map((item, i) => (
            <li key={i}>{renderInlineBold(item, `${key}-${i}`)}</li>
          ))}
        </ul>
      ) : (
        <ol key={key} className="list-decimal pl-5 my-1 space-y-0.5">
          {items.map((item, i) => (
            <li key={i}>{renderInlineBold(item, `${key}-${i}`)}</li>
          ))}
        </ol>
      ),
    );
    listItems = [];
    listType = null;
  };

  lines.forEach((line, idx) => {
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)$/);
    const numberedMatch = line.match(/^\s*\d+[.)]\s+(.*)$/);

    if (bulletMatch) {
      if (listType !== "ul") flushList(`blk-${idx}`);
      listType = "ul";
      listItems.push(bulletMatch[1]);
      return;
    }
    if (numberedMatch) {
      if (listType !== "ol") flushList(`blk-${idx}`);
      listType = "ol";
      listItems.push(numberedMatch[1]);
      return;
    }

    flushList(`blk-${idx}`);
    if (line.trim() === "") {
      blocks.push(<div key={`sp-${idx}`} className="h-1.5" />);
    } else {
      blocks.push(
        <p key={`p-${idx}`} className="m-0">
          {renderInlineBold(line, `p-${idx}`)}
        </p>,
      );
    }
  });
  flushList("blk-end");

  return <>{blocks}</>;
}

function getWidgetStorageKey(employeeId?: string): string {
  return `hrmsChatbotWidgetMessages-${employeeId ?? "guest"}`;
}

function loadWidgetMessages(employeeId?: string): ChatMessage[] | null {
  const saved = window.localStorage.getItem(getWidgetStorageKey(employeeId));

  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return null;

    return parsed;
  } catch {
    return null;
  }
}
function pruneOtherWidgetStorage(employeeId?: string): void {
  const currentKey = getWidgetStorageKey(employeeId);
  const keysToRemove: string[] = [];

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith("hrmsChatbotWidgetMessages-") && key !== currentKey) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => window.localStorage.removeItem(key));
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// RTK Query's .unwrap() throws a FetchBaseQueryError (status is a number,
// 'FETCH_ERROR', 'TIMEOUT_ERROR', 'PARSING_ERROR', or 'CUSTOM_ERROR') or a
// plain SerializedError for unexpected JS exceptions. Distinguishing these
// tells the person whether to retry immediately, wait, or re-authenticate,
// instead of one generic "something went wrong" for every failure mode.
function getChatErrorMessage(error: unknown): string {
  const err = error as { status?: number | string } | undefined;

  if (err?.status === "FETCH_ERROR") {
    return "Can't reach the server right now. Check your connection and try again.";
  }
  if (err?.status === "TIMEOUT_ERROR") {
    return "That took too long to respond. Please try again.";
  }
  if (typeof err?.status === "number") {
    if (err.status === 401 || err.status === 403) {
      return "Your session may have expired. Refresh the page and sign in again.";
    }
    if (err.status >= 500) {
      return "Something went wrong on our end. Please try again in a moment.";
    }
    return "That didn't go through. Please try again.";
  }
  return "Sorry, something went wrong. Please try again.";
}

function isSameDay(a: Date | string, b: Date | string): boolean {
  const da = a instanceof Date ? a : new Date(a);
  const db = b instanceof Date ? b : new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function getDateLabel(ts: Date | string): string {
  const d = ts instanceof Date ? ts : new Date(ts);
  if (isNaN(d.getTime())) return "";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yesterday)) return "Yesterday";

  return d.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(ts: Date | string) {
  const d = ts instanceof Date ? ts : new Date(ts);

  if (isNaN(d.getTime())) return "";

  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isMenuActions(actions: ChatAction[]) {
  if (!actions.length) return false;

  const flowLabels = ["confirm leave", "cancel", "skip"];

  const looksLikeFlow = actions.some((a) =>
    flowLabels.includes(a.label.toLowerCase()),
  );

  if (looksLikeFlow) return false;

  return actions.some((a) => a.send.startsWith("menu:")) || actions.length >= 3;
}

// Inline style bypasses Tailwind's JIT entirely — the browser evaluates
// var() directly, so this always reflects the live --primary-gradient
// value regardless of build/caching behavior.
const GRADIENT_STYLE: React.CSSProperties = {
  backgroundImage: "var(--primary-gradient)",
};

// Small inline icon set for menu buttons — no icon library dependency,
// matches the style of the raw SVG already used for the toggle button above.
// Falls back to a generic dot glyph for any send value not listed here.
const MENU_ICONS: Record<string, React.ReactElement> = {
  "my details": (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  ),
  "menu:leave": (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </svg>
  ),
  "menu:company": (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" />
    </svg>
  ),
  "menu:documents": (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M9 13h6M9 17h6" />
    </svg>
  ),
  "menu:directory": (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M15.5 13.2c2.6.4 4.5 2 4.5 4.8" />
    </svg>
  ),
  teams: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </svg>
  ),
};

function IconTooltip({
  label,
  position = "top",
  children,
}: {
  label: string;
  position?: "top" | "bottom";
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 ${
            position === "top"
              ? "bottom-[calc(100%+8px)]"
              : "top-[calc(100%+8px)]"
          } bg-[#1f2430] text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap z-30 pointer-events-none animate-[cbFadeIn_0.15s_ease] shadow-lg`}
        >
          {label}
        </div>
      )}
    </div>
  );
}

function MenuIcon({ send }: { send: string }) {
  const icon = MENU_ICONS[send];
  if (!icon) {
    return (
      <span className="w-2 h-2 rounded-full bg-current opacity-50 shrink-0" />
    );
  }
  return <span className="shrink-0 text-[var(--primary-color)]">{icon}</span>;
}

const NOTICE_BUBBLE: Record<"info" | "warning" | "danger", string> = {
  info: "bg-[#eef2ff] text-[#334679]",
  warning: "bg-[#fff7e6] text-[#8a5a00]",
  danger: "bg-[#fdecec] text-[#9a2f2f]",
};

const NOTICE_ICON: Record<"info" | "warning" | "danger", React.ReactElement> = {
  info: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  ),
  warning: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4M12 17h.01" />
    </svg>
  ),
  danger: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5 9.5 14.5M9.5 9.5l5 5" />
    </svg>
  ),
};

export default function ChatbotWidget({
  isOpen,
  onToggle,
}: ChatbotWidgetProps) {
  const { profileData } = useDashboard();

  const { sendChat } = useChatbot();

  const [resetChatbot] = useResetConversationMutation();

  const employee = profileData?.data?.profile;

  const employeeId = employee?.EmployeeID;

  const employeeName = employee?.FullName;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = loadWidgetMessages(employeeId);

    return saved ?? [];
  });

  const [inputValue, setInputValue] = useState("");

  const [isListening, setIsListening] = useState(false);

  const [showMicUnsupported, setShowMicUnsupported] = useState(false);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const [loading, setLoading] = useState(false);

  const [hasUnread, setHasUnread] = useState(false);

  const [teamPreview, setTeamPreview] = useState<{
    teamName: string;
    members: ChatTeamMember[];
    readOnly?: boolean;
  } | null>(null);

  const [listPreview, setListPreview] = useState<{
    title: string;
    rows: ChatListPreviewRow[];
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [isNearBottom, setIsNearBottom] = useState(true);

  const [newMessageCount, setNewMessageCount] = useState(0);

  const menuShownRef = useRef(false);

  const conversationVersionRef = useRef(0);

  const employeeIdRef = useRef<string | undefined>(employeeId);

  useEffect(() => {
    employeeIdRef.current = employeeId;
  }, [employeeId]);

  useEffect(() => {
    return () => {
      if (employeeIdRef.current) {
        window.localStorage.removeItem(getWidgetStorageKey(employeeIdRef.current));
      }
    };
  }, []);

  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom < 80;
    setIsNearBottom(nearBottom);
    if (nearBottom) setNewMessageCount(0);
  };

  const scrollToLatest = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessageCount(0);
    setIsNearBottom(true);
  };

  useEffect(() => {
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      setNewMessageCount((c) => c + 1);
    }
  }, [messages]);
  useEffect(() => {
  pruneOtherWidgetStorage(employeeId);

  const saved = loadWidgetMessages(employeeId);

  setMessages(saved ?? []);

  menuShownRef.current = false;
}, [employeeId, employeeName]);

  useEffect(() => {
    localStorage.setItem(
      getWidgetStorageKey(employeeId),
      JSON.stringify(messages),
    );
  }, [messages, employeeId]);

  useEffect(() => {
    if (!isOpen) {
      recognitionRef.current?.stop();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !menuShownRef.current && messages.length === 0) {
      menuShownRef.current = true;

      void sendText("menu:main", {
        silent: true,
      });
    }
  }, [isOpen, messages.length]);

  const sendText = async (
    text: string,
    options?: {
      silent?: boolean;
    },
  ) => {
    const trimmed = text.trim();

    if (!trimmed) return;

    const requestVersion = conversationVersionRef.current;
    const isFirstEverMessage = messages.length === 0;

    // Add user message unless silent
    if (!options?.silent) {
      const userMessage: ChatMessage = {
        id: Date.now(),
        text: trimmed,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updated = [...prev, userMessage];

        localStorage.setItem(
          getWidgetStorageKey(employeeId),
          JSON.stringify(updated),
        );

        return updated;
      });
    }

    setInputValue("");
    setLoading(true);

    try {
      const response = await sendChat(trimmed);

      // Ignore responses belonging to the previous conversation
      // after the user has pressed Reset.
      if (requestVersion !== conversationVersionRef.current) {
        return;
      }

      if (response.widget?.type === "teamPreview") {
        setTeamPreview({
          teamName: response.widget.teamName ?? "",
          members: response.widget.members ?? [],
          readOnly: false,
        });
      }

      if (response.widget?.type === "listPreview") {
        setListPreview({
          title: response.widget.listTitle ?? "",
          rows: response.widget.listRows ?? [],
        });
      }

      const botMessage: ChatMessage = {
        id: Date.now() + Math.random(),
        text: isFirstEverMessage
          ? `${getTimeGreeting()}, ${employeeName ?? "there"} 👋`
          : response.botResponse,
        sender: "bot",
        timestamp: new Date(response.timestamp),
        actions: response.actions ?? [],
        widget: response.widget ?? undefined,
      };

      if (!isOpen) {
        setHasUnread(true);
      }

      setMessages((prev) => {
        const updated = [...prev, botMessage];

        localStorage.setItem(
          getWidgetStorageKey(employeeId),
          JSON.stringify(updated),
        );

        return updated;
      });
    } catch (error) {
      if (requestVersion !== conversationVersionRef.current) {
        return;
      }

      console.error(error);

      const errorMessage: ChatMessage = {
        id: Date.now(),
        text: getChatErrorMessage(error),
        sender: "bot",
        timestamp: new Date(),
        widget: { type: "notice", noticeTone: "danger" },
        retryText: trimmed,
      };

      setMessages((prev) => {
        const updated = [...prev, errorMessage];

        localStorage.setItem(
          getWidgetStorageKey(employeeId),
          JSON.stringify(updated),
        );

        return updated;
      });
    } finally {
      if (requestVersion === conversationVersionRef.current) {
        setLoading(false);
      }
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const toSend = inputValue;
    setInputValue("");
    await sendText(toSend);
  };

  const toggleMic = () => {
    if (!SpeechRecognitionAPI) {
      setShowMicUnsupported(true);
      setTimeout(() => setShowMicUnsupported(false), 2800);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInputValue(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleActionClick = async (action: ChatAction) => {
    setInputValue("");
    await sendText(action.send);
  };

  const openMainMenu = async () => {
    setInputValue("");
    await sendText("menu:main", { silent: true });
  };

  const resetConversation = async () => {
    setShowResetConfirm(false);
    // Invalidate all requests from the previous conversation.
    conversationVersionRef.current += 1;
    // Clear chatbot state stored on the backend.
    try {
      await resetChatbot().unwrap();
    } catch (error) {
      console.error("Failed to reset chatbot conversation:", error);
    }
    // Clear frontend conversation state.
    localStorage.removeItem(getWidgetStorageKey(employeeId));

    setMessages([]);
    setInputValue("");
    setTeamPreview(null);
    setListPreview(null);
    setHasUnread(false);
    setNewMessageCount(0);
    setLoading(false);

    menuShownRef.current = true;
    await sendText("menu:main", { silent: true });
  };

  const closeTeamPreview = () => {
    setTeamPreview(null);
  };

  const downloadFromTeamPreview = async () => {
    setTeamPreview(null);
    await sendText("download");
  };

  const lastMessageId = messages.length ? messages[messages.length - 1].id : -1;

  return (
    <div className="hrms-cb-widget contents">
      <style>{`
                .hrms-cb-widget button:focus-visible { outline: none; box-shadow: 0 0 0 2px white, 0 0 0 4px var(--primary-color); }
                @keyframes cbFloatA { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-16px, 14px); } }
                @keyframes cbFloatB { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(14px, -16px); } }
                @keyframes cbFloatC { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-12px, -12px); } }
                @media (prefers-reduced-motion: reduce) {
                    .cb-wallpaper-bubble { animation: none !important; }
                }
            `}</style>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        title="Chat with us"
        style={GRADIENT_STYLE}
        className={`fixed bottom-[30px] right-[30px] w-[62px] h-[62px] rounded-full text-white border-none cursor-pointer text-[26px] flex items-center justify-center shadow-[0_10px_26px_rgba(109,94,252,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_14px_34px_rgba(109,94,252,0.62)] z-[999]`}
      >
        <span className="flex items-center justify-center">
          <svg width="30" height="30" viewBox="0 0 64 64" fill="none">
            <rect
              x="14"
              y="22"
              width="36"
              height="30"
              rx="12"
              fill="white"
              fillOpacity="0.95"
            />
            <rect
              x="26"
              y="8"
              width="12"
              height="14"
              rx="6"
              fill="white"
              fillOpacity="0.95"
            />
            <circle cx="32" cy="10" r="3" fill="white" />
            <circle cx="24" cy="36" r="5" fill="var(--primary-color)" />
            <circle cx="40" cy="36" r="5" fill="var(--primary-color)" />
            <rect
              x="24"
              y="44"
              width="16"
              height="4"
              rx="2"
              fill="var(--primary-color)"
            />
            <rect
              x="4"
              y="30"
              width="6"
              height="12"
              rx="3"
              fill="white"
              fillOpacity="0.95"
            />
            <rect
              x="54"
              y="30"
              width="6"
              height="12"
              rx="3"
              fill="white"
              fillOpacity="0.95"
            />
          </svg>
        </span>
        {hasUnread && !isOpen && (
          <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white animate-pulse" />
        )}
        {!isOpen && (
          <span className="absolute -bottom-[34px] right-0 bg-white text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
            Let's Chat
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`fixed bottom-[105px] right-[30px] bg-white rounded-[24px] shadow-[0_24px_70px_rgba(43,30,120,0.22)] flex flex-col overflow-hidden z-[999] animate-[cbSlideUp_0.3s_ease] transition-[width,height] duration-200 max-[600px]:w-[calc(100%-24px)] max-[600px]:h-[72vh] max-[600px]:bottom-[90px] max-[600px]:right-3 ${
            isExpanded ? "w-[600px] h-[85vh]" : "w-[400px] h-[620px]"
          }`}
        >
          {/* Wallpaper — soft monochrome circles in the portal's own --primary-light color, so it always matches whichever preset is active instead of a fixed palette. Negative z-index so it paints behind the header, messages, and input without needing z-index on every sibling. Fixed to the panel (not the scrolling messages list), so it stays put while messages scroll over it. Each bubble drifts slowly on its own cbFloatA/B/C cycle with a staggered negative delay so they don't move in lockstep. */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div
              className="cb-wallpaper-bubble absolute w-[220px] h-[220px] rounded-full -top-[70px] -right-[60px] animate-[cbFloatA_16s_ease-in-out_infinite]"
              style={{ background: "var(--primary-light)" }}
            />
            <div
              className="cb-wallpaper-bubble absolute w-[130px] h-[130px] rounded-full top-[120px] -left-[50px] animate-[cbFloatB_13s_ease-in-out_infinite]"
              style={{
                background: "var(--primary-light)",
                opacity: 0.7,
                animationDelay: "-4s",
              }}
            />
            <div
              className="cb-wallpaper-bubble absolute w-[160px] h-[160px] rounded-full top-[260px] right-[10px] animate-[cbFloatC_18s_ease-in-out_infinite]"
              style={{
                background: "var(--primary-light)",
                opacity: 0.6,
                animationDelay: "-8s",
              }}
            />
            <div
              className="cb-wallpaper-bubble absolute w-[110px] h-[110px] rounded-full top-[300px] left-[30px] animate-[cbFloatA_20s_ease-in-out_infinite]"
              style={{
                background: "var(--primary-color)",
                opacity: 0.06,
                animationDelay: "-11s",
              }}
            />
            <div
              className="cb-wallpaper-bubble absolute w-[240px] h-[240px] rounded-full -bottom-[90px] -left-[70px] animate-[cbFloatB_15s_ease-in-out_infinite]"
              style={{
                background: "var(--primary-light)",
                opacity: 0.85,
                animationDelay: "-6s",
              }}
            />
            <div
              className="cb-wallpaper-bubble absolute w-[150px] h-[150px] rounded-full -bottom-[40px] right-[20px] animate-[cbFloatC_17s_ease-in-out_infinite]"
              style={{
                background: "var(--primary-color)",
                opacity: 0.05,
                animationDelay: "-2s",
              }}
            />
          </div>

          {/* Header — curves into the chat body via a rounded ::after-style overlay div */}
          <div
            style={GRADIENT_STYLE}
            className={`text-white px-5 pt-[18px] pb-[26px] flex items-center gap-3 relative`}
          >
            <div className="absolute left-0 right-0 -bottom-px h-[22px] bg-white rounded-t-[22px]" />

            <div className="relative w-11 h-11 rounded-full bg-white/20 border-2 border-white/35 flex items-center justify-center text-[22px] shrink-0 z-10">
              🤖
              <span className="absolute bottom-0.5 right-0.5 w-[11px] h-[11px] rounded-full bg-[#3ee6a0] border-2 border-[var(--primary-color)]" />
            </div>

            <div className="flex flex-col leading-tight z-10">
              <h3 className="m-0 text-[15.5px] font-bold">NYRA</h3>
              <span className="text-[11.5px] opacity-90">Online</span>
            </div>

            <div className="flex items-center gap-1.5 ml-auto z-10 relative">
              <IconTooltip
                label={isExpanded ? "Collapse" : "Expand"}
                position="bottom"
              >
                <button
                  onClick={() => setIsExpanded((p) => !p)}
                  aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
                  className="text-white w-[30px] h-[30px] flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                >
                  {isExpanded ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
                    </svg>
                  ) : (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  )}
                </button>
              </IconTooltip>
              <IconTooltip label="Reset conversation" position="bottom">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  aria-label="Reset conversation"
                  className="text-white w-[30px] h-[30px] flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors border border-white/40"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              </IconTooltip>
              <IconTooltip label="Close chat" position="bottom">
                <button
                  onClick={onToggle}
                  aria-label="Close chat"
                  className="text-white text-2xl w-[30px] h-[30px] flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                >
                  ×
                </button>
              </IconTooltip>

              {showResetConfirm && (
                <div className="absolute top-[38px] right-0 w-[220px] bg-[#fdf0e6] border border-[#e5cba0] rounded-2xl p-3.5 shadow-lg z-20">
                  <div className="flex gap-2 items-start">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#854F0B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      <path d="M12 9v4M12 17h.01" />
                      <path d="m10.29 3.86-8.36 14.5A1 1 0 0 0 2.8 20h18.4a1 1 0 0 0 .87-1.64l-8.36-14.5a1 1 0 0 0-1.72 0Z" />
                    </svg>
                    <div>
                      <p className="text-[12.5px] font-semibold text-[#412402] m-0">
                        Reset conversation?
                      </p>
                      <p className="text-[11.5px] text-[#633806] m-0 mt-0.5">
                        This can't be undone.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2.5">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#e5cba0] text-[11.5px] font-semibold text-[#412402]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={resetConversation}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#BA7517] text-[11.5px] font-semibold text-white"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 overflow-y-auto px-4 pb-4 pt-1.5 flex flex-col gap-4 relative [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {messages.map((msg, idx) => {
              const isLast = msg.id === lastMessageId;
              const actions = msg.actions ?? [];
              const menuMode = msg.sender === "bot" && isMenuActions(actions);
              const isBot = msg.sender === "bot";
              const noticeTone =
                isBot && msg.widget?.type === "notice"
                  ? msg.widget.noticeTone ?? "info"
                  : null;
              const isWelcomeCard = idx === 0 && isBot && menuMode;
              const showDateDivider =
                idx === 0 ||
                !isSameDay(msg.timestamp, messages[idx - 1].timestamp);

              return (
                <React.Fragment key={msg.id}>
                  {showDateDivider && (
                    <div className="flex justify-center my-1">
                      <span className="text-[11px] font-medium text-[#8a90a5] bg-[#f0f0f0] px-3 py-1 rounded-full">
                        {getDateLabel(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex gap-2.5 items-end ${
                      isBot ? "" : "justify-end"
                    } animate-[cbFadeIn_0.25s_ease]`}
                  >
                    {isBot && !isWelcomeCard && (
                      <div
                        style={GRADIENT_STYLE}
                        className={`w-[30px] h-[30px] rounded-full text-white flex items-center justify-center text-[15px] shrink-0 shadow-[0_3px_8px_rgba(109,94,252,0.3)]`}
                      >
                        🤖
                      </div>
                    )}

                    <div
                      className={`flex flex-col min-w-0 max-w-[84%] ${
                        isBot ? "items-start" : "items-end"
                      } ${isWelcomeCard ? "w-full max-w-full" : ""}`}
                    >
                      {isWelcomeCard ? (
                        <div className="w-full bg-white rounded-[18px] border border-[#eceef5] shadow-[0_3px_14px_rgba(43,30,120,0.07)] p-4">
                          <div className="flex items-center gap-3 mb-3.5">
                            <div
                              style={GRADIENT_STYLE}
                              className="w-11 h-11 rounded-full text-white flex items-center justify-center text-[19px] shrink-0"
                            >
                              🤖
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-[#1f2430] m-0">
                                {msg.text}
                              </p>
                              <p className="text-[12px] text-[#8a90a5] m-0 mt-0.5">
                                What can I help with?
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {actions
                              .filter((a) => !a.label.startsWith("←"))
                              .map((action, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  disabled={loading || !isLast}
                                  onClick={() => handleActionClick(action)}
                                  className="flex items-center gap-2 px-3 py-3 rounded-xl border border-[#eceef5] bg-[var(--primary-light)] text-left text-[12.5px] font-semibold text-[#1f2430] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] disabled:opacity-45 disabled:cursor-not-allowed"
                                >
                                  <MenuIcon send={action.send} />
                                  {action.label}
                                </button>
                              ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            style={!isBot ? GRADIENT_STYLE : undefined}
                            className={
                              isBot
                                ? noticeTone
                                  ? `min-w-0 px-[15px] py-3 rounded-[18px] rounded-bl-md text-[13.5px] leading-relaxed whitespace-pre-line [overflow-wrap:anywhere] shadow-[0_3px_14px_rgba(43,30,120,0.07)] flex items-start gap-2 ${NOTICE_BUBBLE[noticeTone]}`
                                  : "min-w-0 px-[15px] py-3 rounded-[18px] rounded-bl-md bg-white text-[#1f2430] text-[13.5px] leading-relaxed whitespace-pre-line [overflow-wrap:anywhere] shadow-[0_3px_14px_rgba(43,30,120,0.07)]"
                                : `min-w-0 px-[15px] py-3 rounded-[18px] rounded-br-md text-white text-[13.5px] leading-relaxed whitespace-pre-line [overflow-wrap:anywhere] shadow-[0_5px_16px_rgba(109,94,252,0.32)]`
                            }
                          >
                            {noticeTone && (
                              <span className="shrink-0 mt-0.5">
                                {NOTICE_ICON[noticeTone]}
                              </span>
                            )}
                            {isBot ? (
                              <FormattedText text={msg.text} />
                            ) : (
                              <span>{msg.text}</span>
                            )}
                          </div>

                          {msg.retryText && isLast && !loading && (
                            <button
                              type="button"
                              onClick={() => sendText(msg.retryText!)}
                              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[11px] text-[12.5px] font-semibold text-[#791f1f] bg-white border-[1.5px] border-[#f09595] cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M3 12a9 9 0 1 0 3-6.7" />
                                <path d="M3 3v5h5" />
                              </svg>
                              Try again
                            </button>
                          )}

                          {/* Action buttons (Confirm/Cancel/Skip or menu grid) */}
                          {isBot && actions.length > 0 && (
                            <div
                              className={
                                menuMode
                                  ? "grid grid-cols-2 gap-2.5 mt-3 w-full"
                                  : "flex flex-wrap gap-2 mt-2.5"
                              }
                            >
                              {actions.map((action, i) => {
                                const isBack = action.label.startsWith("←");
                                const isSecondary =
                                  isBack ||
                                  action.label.toLowerCase() === "cancel" ||
                                  action.label.toLowerCase() === "skip";
                                const disabled = loading || !isLast;

                                if (menuMode) {
                                  return (
                                    <button
                                      key={i}
                                      type="button"
                                      disabled={disabled}
                                      onClick={() => handleActionClick(action)}
                                      className={`bg-white text-[#1f2430] border border-[#eceef5] shadow-[0_2px_8px_rgba(43,30,120,0.04)] px-3.5 py-4 rounded-2xl flex items-center gap-2.5 font-bold text-[13px] text-left transition-all duration-150 hover:border-[var(--primary-color)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-color)] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(109,94,252,0.15)] disabled:opacity-45 disabled:cursor-not-allowed ${
                                        isBack
                                          ? "col-span-2 justify-center"
                                          : ""
                                      }`}
                                    >
                                      {!isBack && (
                                        <MenuIcon send={action.send} />
                                      )}
                                      {action.label}
                                    </button>
                                  );
                                }

                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => handleActionClick(action)}
                                    style={
                                      !isSecondary ? GRADIENT_STYLE : undefined
                                    }
                                    className={
                                      isSecondary
                                        ? "px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-white text-[var(--primary-color)] border-[1.5px] border-[var(--primary-color)] cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed"
                                        : `px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer shadow-[0_5px_14px_rgba(109,94,252,0.3)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(109,94,252,0.42)] active:translate-y-0 active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed`
                                    }
                                  >
                                    {action.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Interactive widget: date picker or leave-type cards */}
                          {isBot && msg.widget && (
                            <ChatWidgetRenderer
                              key={msg.id}
                              widget={msg.widget}
                              disabled={loading || !isLast}
                              resetConfirmOpen={showResetConfirm}
                              onSubmit={sendText}
                              onOpenListPreview={(title, rows) =>
                                setListPreview({ title, rows })
                              }
                              onOpenTeamPreview={(teamName, members) =>
                                setTeamPreview({
                                  teamName,
                                  members,
                                  readOnly: true,
                                })
                              }
                            />
                          )}
                        </>
                      )}

                      <span className="text-[10px] text-[#8a90a5] mt-1 px-1">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {loading && (
              <div className="flex gap-2.5 items-end">
                <div
                  style={GRADIENT_STYLE}
                  className={`w-[30px] h-[30px] rounded-full text-white flex items-center justify-center text-[15px] shrink-0 shadow-[0_3px_8px_rgba(109,94,252,0.3)]`}
                >
                  🤖
                </div>
                <div className="flex flex-col gap-2 px-4 py-3.5 bg-white rounded-[18px] rounded-bl-md shadow-[0_3px_14px_rgba(43,30,120,0.07)] w-[170px] animate-pulse">
                  <div className="h-2.5 rounded-full bg-[#eceef5] w-full" />
                  <div className="h-2.5 rounded-full bg-[#eceef5] w-[65%]" />
                </div>
              </div>
            )}

            {newMessageCount > 0 && (
              <button
                type="button"
                onClick={scrollToLatest}
                style={GRADIENT_STYLE}
                className="sticky bottom-1 self-center flex items-center gap-1.5 text-white text-[12px] font-semibold px-3.5 py-2 rounded-full shadow-[0_5px_14px_rgba(109,94,252,0.35)] z-10"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
                {newMessageCount} new
              </button>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={sendMessage}
            className="flex gap-2 px-3.5 py-3 bg-white border-t border-[#eceef5] items-center"
          >
            <IconTooltip label="Main menu" position="top">
              <button
                type="button"
                onClick={openMainMenu}
                disabled={loading}
                aria-label="Main menu"
                className="bg-[var(--primary-light)] text-[var(--primary-color)] border border-[var(--primary-color)] rounded-xl w-[42px] h-[42px] shrink-0 text-[17px] flex items-center justify-center transition-colors hover:bg-[var(--primary-light)] disabled:opacity-45 disabled:cursor-not-allowed"
              >
                ☰
              </button>
            </IconTooltip>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question, or use the menu..."
              disabled={loading}
              spellCheck="true"
              className="flex-1 px-[15px] py-3 border border-[#eceef5] rounded-xl text-[13px] font-inherit outline-none bg-[#f7f7fc] transition-colors focus:border-[var(--primary-color)] focus:bg-white placeholder:text-[#a7adbd]"
            />
            {SpeechRecognitionAPI ? (
              <IconTooltip
                label={isListening ? "Stop listening" : "Speak your message"}
                position="top"
              >
                <button
                  type="button"
                  onClick={toggleMic}
                  disabled={loading}
                  aria-label={
                    isListening ? "Stop listening" : "Speak your message"
                  }
                  className={
                    isListening
                      ? "bg-red-500 text-white border-none rounded-xl w-[42px] h-[42px] shrink-0 text-[17px] flex items-center justify-center animate-pulse disabled:opacity-45 disabled:cursor-not-allowed"
                      : "bg-[var(--primary-light)] text-[var(--primary-color)] border border-[var(--primary-color)] rounded-xl w-[42px] h-[42px] shrink-0 text-[17px] flex items-center justify-center transition-colors hover:opacity-80 disabled:opacity-45 disabled:cursor-not-allowed"
                  }
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="2" width="6" height="12" rx="3" />
                    <path d="M5 10a7 7 0 0 0 14 0M12 19v3" />
                  </svg>
                </button>
              </IconTooltip>
            ) : (
              <div className="relative shrink-0">
                {showMicUnsupported && (
                  <div className="absolute bottom-[52px] right-0 w-[190px] bg-[#1f2430] text-white text-[11px] leading-snug rounded-lg px-3 py-2 shadow-lg animate-[cbFadeIn_0.15s_ease]">
                    Voice input isn't available in this browser. Try Chrome or
                    Edge.
                    <div className="absolute -bottom-1 right-4 w-2 h-2 bg-[#1f2430] rotate-45" />
                  </div>
                )}
                <IconTooltip
                  label="Not available in this browser"
                  position="top"
                >
                  <button
                    type="button"
                    onClick={toggleMic}
                    aria-label="Voice input isn't available in this browser"
                    className="bg-[#f0f0f0] text-[#a7adbd] border border-[#e5e5e5] rounded-xl w-[42px] h-[42px] shrink-0 text-[17px] flex items-center justify-center cursor-pointer"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="9" y="2" width="6" height="12" rx="3" />
                      <path d="M5 10a7 7 0 0 0 14 0M12 19v3" />
                    </svg>
                  </button>
                </IconTooltip>
              </div>
            )}
            <IconTooltip label="Send message" position="top">
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                style={GRADIENT_STYLE}
                aria-label="Send message"
                className={`text-white border-none rounded-xl w-[42px] h-[42px] shrink-0 text-[17px] flex items-center justify-center transition-transform shadow-[0_5px_14px_rgba(109,94,252,0.35)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none`}
              >
                →
              </button>
            </IconTooltip>
          </form>
        </div>
      )}

      {isOpen && teamPreview && (
        <TeamPreviewModal
          teamName={teamPreview.teamName}
          members={teamPreview.members}
          onClose={closeTeamPreview}
          onDownload={
            teamPreview.readOnly ? undefined : downloadFromTeamPreview
          }
        />
      )}

      {isOpen && listPreview && (
        <ListPreviewModal
          title={listPreview.title}
          rows={listPreview.rows}
          onClose={() => setListPreview(null)}
          onRowAction={(action) => {
            setListPreview(null);
            void sendText(action);
          }}
        />
      )}
    </div>
  );
}

// ── Widget renderer ───────────────────────────────────────────────────────────

interface ChatWidgetRendererProps {
  widget: ChatWidget;
  disabled: boolean;
  resetConfirmOpen: boolean;
  onSubmit: (text: string) => void;
  onOpenListPreview: (title: string, rows: ChatListPreviewRow[]) => void;
  onOpenTeamPreview: (teamName: string, members: ChatTeamMember[]) => void;
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  let accepted = "";

  for (const digit of digits) {
    if (accepted.length === 0) {
      if (digit <= "3") accepted = digit;
      continue;
    }

    if (accepted.length === 1) {
      const day = Number(`${accepted}${digit}`);
      if (day >= 1 && day <= 31) accepted += digit;
      continue;
    }

    if (accepted.length === 2) {
      if (digit <= "1") accepted += digit;
      continue;
    }

    if (accepted.length === 3) {
      const month = Number(`${accepted[2]}${digit}`);
      if (month >= 1 && month <= 12) accepted += digit;
      continue;
    }

    if (accepted.length < 7) {
      accepted += digit;
      continue;
    }

    const year = Number(`${accepted.slice(4)}${digit}`);
    if (year === currentYear || year === previousYear) accepted += digit;
  }

  return [accepted.slice(0, 2), accepted.slice(2, 4), accepted.slice(4, 8)]
    .filter(Boolean)
    .join("-");
}

function displayDateToIso(value: string): string | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!match) return null;

  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const date = new Date(Date.UTC(year, month - 1, day));

  const currentYear = new Date().getFullYear();
  if (
    (year !== currentYear && year !== currentYear - 1) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  const dayOfWeek = date.getUTCDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return null;

  return `${yearText}-${monthText}-${dayText}`;
}

function isoToDisplayDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : "";
}

function localDateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isoToMonthStart(value: string): Date {
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(value);
  return match
    ? new Date(Number(match[1]), Number(match[2]) - 1, 1)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
}

function getLocalIsoDate(daysFromToday = 0): string {
  const today = new Date();
  today.setDate(today.getDate() + daysFromToday);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ChatWidgetRenderer({
  widget,
  disabled,
  resetConfirmOpen,
  onSubmit,
  onOpenListPreview,
  onOpenTeamPreview,
}: ChatWidgetRendererProps) {
  const [dateValue, setDateValue] = useState("");
  const [dateError, setDateError] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const month = new Date();
    month.setDate(1);
    return month;
  });
  const [copiedField, setCopiedField] = useState<number | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const widgetRowRef = useRef<HTMLDivElement>(null);

  // The leave-date step should open straight into the calendar instead of
  // making the person click the calendar icon first — this fires once when
  // this widget message first mounts (each date-widget message gets a fresh
  // instance via its `key` in the parent, so this reliably re-fires every
  // time a new "pick your leave date" step appears).
  useEffect(() => {
    if (widget.type === "date" && !disabled) {
      setShowCalendar(true);
      if (widget.minDate) {
        setCalendarMonth(isoToMonthStart(widget.minDate));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resetConfirmOpen) setShowCalendar(false);
  }, [resetConfirmOpen]);

  // The calendar pops open ABOVE the date field (it needs to, since that
  // field usually sits right above the message composer with no room
  // below). When it opens right as this message first appears, the panel
  // hasn't necessarily scrolled down enough yet, so the calendar's own
  // height can push its top edge up and over the widget header — hiding
  // the reset/expand/close buttons behind it. And the reverse happens when
  // a date gets picked: the calendar collapses back down, but the now-filled
  // date box and the Set date/Cancel buttons can end up below whatever's
  // currently in view, so the person has to scroll to see what they just
  // selected. Nudging the whole widget row into view (just enough, not all
  // the way to top/bottom) whenever the calendar opens OR a date is chosen
  // keeps the relevant part on-screen either way.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      widgetRowRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    return () => cancelAnimationFrame(raf);
  }, [showCalendar, dateValue]);

  const copyValue = (value: string, index: number) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(index);
      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  if (widget.type === "date") {
    const currentYear = new Date().getFullYear();
    const minimumDate = widget.minDate ?? getLocalIsoDate(-7);
    const holidayDates = new Map(
      (widget.holidays ?? []).map((holiday) => [
        holiday.date.slice(0, 10),
        holiday.name ?? "Holiday",
      ]),
    );
    const isWeekend = (iso: string) => {
      const day = new Date(`${iso}T00:00:00Z`).getUTCDay();
      return day === 0 || day === 6;
    };
    const isHoliday = (iso: string) => holidayDates.has(iso);
    const isSelectable = (iso: string) =>
      iso >= minimumDate &&
      iso <= `${currentYear}-12-31` &&
      !isWeekend(iso) &&
      !isHoliday(iso);

    const firstDay = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1,
    );
    const calendarStart = new Date(firstDay);
    calendarStart.setDate(firstDay.getDate() - firstDay.getDay());
    const calendarDays = Array.from({ length: 42 }, (_, index) => {
      const day = new Date(calendarStart);
      day.setDate(calendarStart.getDate() + index);
      return day;
    });
    const monthLabel = calendarMonth.toLocaleDateString([], {
      month: "long",
      year: "numeric",
    });
    const previousMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() - 1,
      1,
    );
    const nextMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      1,
    );
    const canGoPrevious =
      previousMonth >= new Date(`${minimumDate.slice(0, 7)}-01T00:00:00`);
    const canGoNext = nextMonth.getFullYear() <= currentYear;
    const handleDateChange = (value: string) => {
      const formattedValue = formatDateInput(value);
      const isoValue = displayDateToIso(formattedValue);

      if (formattedValue.length === 10 && !isoValue) {
        setDateValue("");
        setDateError(true);
        return;
      }

      if (isoValue && isHoliday(isoValue)) {
        setDateValue("");
        setDateError(true);
        return;
      }

      setDateValue(formattedValue);
      setDateError(false);
    };

    const handleDateSubmit = () => {
      const isoValue = displayDateToIso(dateValue);
      if (!isoValue || isoValue < minimumDate) {
        setDateError(true);
        return;
      }
      onSubmit(isoValue);
    };

    // Shared by the input click and the calendar-icon click so both open
    // the calendar the same way (and land on the right month).
    const toggleCalendar = () => {
      if (disabled) return;
      setShowCalendar((open) => {
        if (!open && widget.minDate) {
          setCalendarMonth(isoToMonthStart(widget.minDate));
        }
        return !open;
      });
    };

    return (
      <div ref={widgetRowRef} className="flex flex-wrap gap-2 mt-2.5 items-center">
        <div className="relative flex items-center">
          <input
            type="text"
            value={dateValue}
            placeholder="DD-MM-YYYY"
            inputMode="numeric"
            maxLength={10}
            disabled={disabled}
            readOnly
            onClick={toggleCalendar}
            onChange={(e) => handleDateChange(e.target.value)}
            aria-label="Leave date (pick from the calendar)"
            className="w-[145px] px-3 py-2.5 pr-10 border border-[#eceef5] rounded-[11px] text-[13px] font-inherit text-[#1f2430] outline-none transition-colors focus:border-[var(--primary-color)] disabled:opacity-60 cursor-pointer"
          />
          <button
            type="button"
            aria-label="Open date picker"
            title="Open date picker"
            disabled={disabled}
            onClick={toggleCalendar}
            className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-md border-none bg-transparent text-[#6b7280] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          >
            <Calendar size={16} />
          </button>
          {showCalendar && !disabled && (
            <div className="absolute bottom-full left-0 z-30 mb-1 w-[296px] rounded-xl border border-[#eceef5] bg-white p-3 shadow-[0_8px_24px_rgba(43,30,120,0.16)]">
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  disabled={!canGoPrevious}
                  onClick={() => setCalendarMonth(previousMonth)}
                  className="h-7 w-7 rounded-md border-none bg-transparent text-lg text-[#1f2430] disabled:opacity-25"
                >
                  ‹
                </button>
                <span className="text-[13px] font-semibold text-[#1f2430]">
                  {monthLabel}
                </span>
                <button
                  type="button"
                  disabled={!canGoNext}
                  onClick={() => setCalendarMonth(nextMonth)}
                  className="h-7 w-7 rounded-md border-none bg-transparent text-lg text-[#1f2430] disabled:opacity-25"
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-7 text-center text-[11px] font-medium text-[#526079]">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <span key={day} className="py-1">
                      {day}
                    </span>
                  ),
                )}
                {calendarDays.map((day) => {
                  const iso = localDateToIso(day);
                  const outsideMonth =
                    day.getMonth() !== calendarMonth.getMonth();
                  const weekend = isWeekend(iso);
                  const holiday = isHoliday(iso);
                  const selected =
                    iso === dateValue.split("-").reverse().join("-");
                  const startDateReference = widget.minDate === iso;
                  const selectable = isSelectable(iso);
                  return (
                    <button
                      key={iso}
                      type="button"
                      disabled={!selectable}
                      title={
                        holiday
                          ? holidayDates.get(iso)
                          : weekend
                          ? "Weekend"
                          : undefined
                      }
                      onClick={() => {
                        handleDateChange(isoToDisplayDate(iso));
                        setShowCalendar(false);
                      }}
                      className={`mx-auto my-0.5 flex h-7 w-7 items-center justify-center rounded-full border-none text-[12px] ${
                        outsideMonth ? "text-[#b7bdc9]" : "text-[#1f2430]"
                      } ${weekend ? "bg-[#ffe0e3] text-[#e33b49]" : ""} ${
                        holiday ? "bg-[#2f68df] text-white" : ""
                      } ${
                        startDateReference && !holiday && !weekend
                          ? "bg-[#dbeafe] text-[#1d4ed8]"
                          : ""
                      } ${
                        selected ? "ring-2 ring-[#1f5bd8] ring-offset-1" : ""
                      } ${
                        selectable
                          ? "cursor-pointer hover:bg-[var(--primary-light)]"
                          : "cursor-not-allowed opacity-75"
                      }`}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex items-center justify-center gap-4 border-t border-[#eceef5] pt-2 text-[10px] text-[#526079]">
                <span>
                  <i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#e33b49]" />
                  Weekend
                </span>
                <span>
                  <i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#2f68df]" />
                  Holiday
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setDateValue("");
                    setDateError(false);
                    setShowCalendar(false);
                  }}
                  className="border-none bg-transparent px-1 text-[12px] font-medium text-[#1677d2] cursor-pointer hover:text-[#125eaa]"
                >
                  Clear
                </button>
                <button
                  type="button"
                  disabled={!isSelectable(getLocalIsoDate())}
                  onClick={() => {
                    handleDateChange(isoToDisplayDate(getLocalIsoDate()));
                    setCalendarMonth(isoToMonthStart(getLocalIsoDate()));
                    setShowCalendar(false);
                  }}
                  className="border-none bg-transparent px-1 text-[12px] font-medium text-[#1677d2] cursor-pointer hover:text-[#125eaa] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Today
                </button>
              </div>
            </div>
          )}
        </div>
        {dateError && (
          <span className="basis-full text-[12px] text-red-600">
            Enter a valid weekday on or after {isoToDisplayDate(minimumDate)};
            weekends are not allowed.
          </span>
        )}
        <button
          type="button"
          disabled={disabled || !dateValue}
          onClick={handleDateSubmit}
          style={GRADIENT_STYLE}
          className={`px-4 py-2.5 rounded-[11px] text-[13px] font-semibold text-white border-none cursor-pointer shadow-[0_5px_14px_rgba(109,94,252,0.3)] transition-transform hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed`}
        >
          Set date
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSubmit("cancel")}
          className="px-4 py-2.5 rounded-[11px] text-[13px] font-semibold bg-white text-[var(--primary-color)] border-[1.5px] border-[var(--primary-color)] cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (widget.type === "dataCard") {
    const fields = widget.cardFields ?? [];
    const initials = (widget.cardTitle ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");

    return (
      <div className="mt-2.5 w-full max-w-[300px] bg-white rounded-2xl border border-[#eceef5] shadow-[0_2px_8px_rgba(43,30,120,0.04)] p-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            style={GRADIENT_STYLE}
            className={`w-10 h-10 rounded-full text-white flex items-center justify-center text-[13px] font-bold shrink-0`}
          >
            {initials || "—"}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-[#1f2430] m-0 break-words">
              {widget.cardTitle}
            </p>
            {widget.cardSubtitle && (
              <p className="text-[12px] text-[#8a90a5] m-0 mt-0.5 truncate">
                {widget.cardSubtitle}
              </p>
            )}
          </div>
        </div>
        <div className="border-t border-[#eceef5] pt-2.5 flex flex-col gap-1.5">
          {fields.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 text-[12.5px]"
            >
              <span className="text-[#8a90a5]">{f.label}</span>
              <span className="flex items-center gap-1.5 min-w-0">
                <span className="text-[#1f2430] font-semibold text-right truncate">
                  {f.value}
                </span>
                <button
                  type="button"
                  onClick={() => copyValue(f.value, i)}
                  aria-label={`Copy ${f.label}`}
                  className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-[#a7adbd] hover:text-[var(--primary-color)] hover:bg-[var(--primary-light)] transition-colors"
                >
                  {copiedField === i ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="9" y="9" width="12" height="12" rx="2" />
                      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                    </svg>
                  )}
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (widget.type === "leaveTypes") {
    const options = widget.options ?? [];
    return (
      <div className="flex flex-col gap-2 mt-2.5 w-full">
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onSubmit(`type:${opt.code}`)}
            className="flex justify-between items-center gap-2.5 px-[15px] py-3.5 border border-[#eceef5] bg-white rounded-2xl cursor-pointer shadow-[0_2px_8px_rgba(43,30,120,0.04)] transition-all duration-150 text-left hover:border-[var(--primary-color)] hover:bg-[var(--primary-light)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-semibold text-[#1f2430] text-[13px]">
              {opt.name} ({opt.code})
            </span>
            <span
              className={
                opt.balance === null || opt.balance <= 0
                  ? "text-[11.5px] font-bold text-[#9aa0b0] bg-[#f0f1f5] px-2.5 py-1 rounded-full whitespace-nowrap"
                  : "text-[11.5px] font-bold text-[#0f9d68] bg-[#e6f8f0] px-2.5 py-1 rounded-full whitespace-nowrap"
              }
            >
              {opt.balance === null ? "no balance" : `${opt.balance} left`}
            </span>
          </button>
        ))}
      </div>
    );
  }

  if (widget.type === "download" && widget.url) {
    const liveColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-color")
      .trim()
      .replace("#", "");

    const separator = widget.url.includes("?") ? "&" : "?";

    const colorParam = liveColor
      ? `${separator}color=${encodeURIComponent(liveColor)}`
      : "";

    const fullUrl = `${import.meta.env.VITE_API_URL ?? ""}${
      widget.url
    }${colorParam}`;

    return (
      <div className="flex mt-2.5">
        <a
          href={fullUrl}
          download={widget.filename}
          aria-disabled={downloaded}
          onClick={(e) => {
            if (downloaded) {
              e.preventDefault();
              return;
            }

            setDownloaded(true);
          }}
          style={GRADIENT_STYLE}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[11px] text-[13px] font-semibold text-white border-none no-underline shadow-[0_5px_14px_rgba(109,94,252,0.3)] transition-all duration-150 ${
            downloaded
              ? "opacity-45 cursor-not-allowed"
              : "cursor-pointer hover:-translate-y-0.5"
          }`}
        >
          {downloaded
            ? `Downloaded ${widget.filename}`
            : `Download ${widget.filename}`}
        </a>
      </div>
    );
  }

  if (widget.type === "teamPreview") {
    return (
      <div className="mt-2.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            onOpenTeamPreview(widget.teamName ?? "", widget.members ?? [])
          }
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[11px] text-[12.5px] font-semibold text-[var(--primary-color)] bg-white border-[1.5px] border-[var(--primary-color)] cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View again
        </button>
      </div>
    );
  }

  if (widget.type === "listPreview") {
    return (
      <div className="mt-2.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            onOpenListPreview(widget.listTitle ?? "", widget.listRows ?? [])
          }
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[11px] text-[12.5px] font-semibold text-[var(--primary-color)] bg-white border-[1.5px] border-[var(--primary-color)] cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View again
        </button>
      </div>
    );
  }

  if (widget.type === "notice") {
    return null;
  }

  if (widget.type === "steps") {
    const items = widget.stepsList ?? [];
    return (
      <div className="mt-2.5 w-full max-w-[300px] bg-white rounded-2xl border border-[#eceef5] shadow-[0_2px_8px_rgba(43,30,120,0.04)] p-4">
        {widget.stepsTitle && (
          <p className="text-[13px] font-bold text-[#1f2430] m-0 mb-3">
            {widget.stepsTitle}
          </p>
        )}
        <div className="flex flex-col gap-2.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span
                style={GRADIENT_STYLE}
                className="shrink-0 w-[20px] h-[20px] rounded-full text-white text-[11px] font-bold flex items-center justify-center mt-0.5"
              >
                {i + 1}
              </span>
              <span className="text-[12.5px] text-[#3a3f4d] leading-snug pt-0.5">
                {item}
              </span>
            </div>
          ))}
        </div>
        {widget.stepsNote && (
          <p className="text-[11.5px] text-[#8a90a5] mt-3 pt-3 border-t border-[#eceef5] m-0">
            {widget.stepsNote}
          </p>
        )}
      </div>
    );
  }

  return null;
}

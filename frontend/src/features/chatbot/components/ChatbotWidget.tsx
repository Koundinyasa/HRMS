import { useState, useRef, useEffect } from "react";
import React from "react";

import {
    useChatbot,
} from "../hooks/useChatbot";



import {
    useDashboard,
} from "@/features/employee/dashboard/hooks/useDashboard";

import type {
    ChatMessage,
    ChatAction,
    ChatWidget,
} from "../types/chatbot.types";

interface ChatbotWidgetProps {
    isOpen: boolean;
    onToggle: () => void;
}

function getWidgetStorageKey(
    employeeId?: string
): string {
    return `hrmsChatbotWidgetMessages-${employeeId ?? "guest"}`;
}

function loadWidgetMessages(
    employeeId?: string
): ChatMessage[] | null {

    const saved =
        window.localStorage.getItem(
            getWidgetStorageKey(employeeId)
        );

    if (!saved) return null;

    try {

        const parsed =
            JSON.parse(saved);

        if (!Array.isArray(parsed))
            return null;

        return parsed;

    } catch {

        return null;

    }
}

function getDefaultMessages(
    employeeName?: string
): ChatMessage[] {

    return [
        {
            id: 1,

            text: `Hi ${employeeName ?? "there"
                } 👋 I'm your HRMS Assistant. Pick an option below or type your question.`,

            sender: "bot",

            timestamp: new Date(),
        },
    ];
}

function formatTime(
    ts: Date | string
) {

    const d =
        ts instanceof Date
            ? ts
            : new Date(ts);

    if (isNaN(d.getTime()))
        return "";

    return d.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit",
        }
    );
}

function isMenuActions(
    actions: ChatAction[]
) {

    if (!actions.length)
        return false;

    const flowLabels = [
        "confirm leave",
        "cancel",
        "skip",
    ];

    const looksLikeFlow =
        actions.some((a) =>
            flowLabels.includes(
                a.label.toLowerCase()
            )
        );

    if (looksLikeFlow)
        return false;

    return (
        actions.some((a) =>
            a.send.startsWith("menu:")
        ) ||
        actions.length >= 3
    );
}

const GRADIENT =
    "bg-[linear-gradient(135deg,#6d5efc_0%,#9a6df0_100%)]";

export default function ChatbotWidget({
    isOpen,
    onToggle,
}: ChatbotWidgetProps) {

    const {
        profileData,
    } = useDashboard();

    const {
        sendChat,
    } = useChatbot();

    const employee =
        profileData?.data?.profile;

    const employeeId =
        employee?.EmployeeID;

    const employeeName =
        employee?.FullName;

    const designation =
        employee?.Designation;

    const [messages, setMessages] =
        useState<ChatMessage[]>(() => {

            const saved =
                loadWidgetMessages(
                    employeeId
                );

            return (
                saved ??
                getDefaultMessages(
                    employeeName
                )
            );

        });

    const [inputValue, setInputValue] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const messagesEndRef =
        useRef<HTMLDivElement>(null);

    const menuShownRef =
        useRef(false);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);

    useEffect(() => {

        const saved =
            loadWidgetMessages(
                employeeId
            );

        setMessages(
            saved ??
            getDefaultMessages(
                employeeName
            )
        );

        menuShownRef.current =
            false;

    }, [
        employeeId,
        employeeName,
    ]);

    useEffect(() => {
        localStorage.setItem(
            getWidgetStorageKey(employeeId),
            JSON.stringify(messages)
        );
    }, [messages, employeeId]);

    useEffect(() => {

        if (
            isOpen &&
            !menuShownRef.current &&
            messages.length <= 1
        ) {

            menuShownRef.current =
                true;

            void sendText(
                "menu:main",
                {
                    silent: true,
                }
            );

        }

    }, [isOpen, messages.length]);




    const sendText = async (
        text: string,
        options?: {
            silent?: boolean;
        }
    ) => {
        const trimmed = text.trim();

        if (!trimmed) return;

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
                    JSON.stringify(updated)
                );

                return updated;
            });
        }

        setInputValue("");
        setLoading(true);

        try {
            const response = await sendChat(trimmed);

            console.log("Chatbot Response:", response);

            const botMessage: ChatMessage = {
                id: Date.now() + Math.random(),
                text: response.botResponse,
                sender: "bot",
                timestamp: new Date(response.timestamp),
                actions: response.actions ?? [],
                widget: response.widget ?? undefined,
            };

            setMessages((prev) => {
                const updated = [...prev, botMessage];

                localStorage.setItem(
                    getWidgetStorageKey(employeeId),
                    JSON.stringify(updated)
                );

                return updated;
            });
        } catch (error) {
            console.error(error);

            const errorMessage: ChatMessage = {
                id: Date.now(),
                text: "Sorry, something went wrong. Please try again.",
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages((prev) => {
                const updated = [...prev, errorMessage];

                localStorage.setItem(
                    getWidgetStorageKey(employeeId),
                    JSON.stringify(updated)
                );

                return updated;
            });
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        const toSend = inputValue
        setInputValue('')
        await sendText(toSend)
    }

    const handleActionClick = async (action: ChatAction) => {
        setInputValue('')
        await sendText(action.send)
    }

    const openMainMenu = async () => {
        setInputValue('')
        await sendText('menu:main', { silent: true })
    }

    const lastMessageId = messages.length ? messages[messages.length - 1].id : -1

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                title="Chat with us"
                className={`fixed bottom-[30px] right-[30px] w-[62px] h-[62px] rounded-full ${GRADIENT} text-white border-none cursor-pointer text-[26px] flex items-center justify-center shadow-[0_10px_26px_rgba(109,94,252,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_14px_34px_rgba(109,94,252,0.62)] z-[999]`}
            >
                <span className="flex items-center justify-center">
                    <svg width="30" height="30" viewBox="0 0 64 64" fill="none">
                        <rect x="14" y="22" width="36" height="30" rx="12" fill="white" fillOpacity="0.95" />
                        <rect x="26" y="8" width="12" height="14" rx="6" fill="white" fillOpacity="0.95" />
                        <circle cx="32" cy="10" r="3" fill="white" />
                        <circle cx="24" cy="36" r="5" fill="#6d5efc" />
                        <circle cx="40" cy="36" r="5" fill="#6d5efc" />
                        <rect x="24" y="44" width="16" height="4" rx="2" fill="#6d5efc" />
                        <rect x="4" y="30" width="6" height="12" rx="3" fill="white" fillOpacity="0.95" />
                        <rect x="54" y="30" width="6" height="12" rx="3" fill="white" fillOpacity="0.95" />
                    </svg>
                </span>
                {!isOpen && (
                    <span className="absolute -bottom-[34px] right-0 bg-white text-gray-800 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
                        Let's Chat
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-[105px] right-[30px] w-[400px] h-[620px] bg-[#f7f7fc] rounded-[24px] shadow-[0_24px_70px_rgba(43,30,120,0.22)] flex flex-col overflow-hidden z-[999] animate-[cbSlideUp_0.3s_ease] max-[600px]:w-[calc(100%-24px)] max-[600px]:h-[72vh] max-[600px]:bottom-[90px] max-[600px]:right-3">

                    {/* Header — curves into the chat body via a rounded ::after-style overlay div */}
                    <div className={`${GRADIENT} text-white px-5 pt-[18px] pb-[26px] flex items-center gap-3 relative`}>
                        <div className="absolute left-0 right-0 -bottom-px h-[22px] bg-[#f7f7fc] rounded-t-[22px]" />

                        <div className="relative w-11 h-11 rounded-full bg-white/20 border-2 border-white/35 flex items-center justify-center text-[22px] shrink-0 z-10">
                            🤖
                            <span className="absolute bottom-0.5 right-0.5 w-[11px] h-[11px] rounded-full bg-[#3ee6a0] border-2 border-[#7d63ee]" />
                        </div>

                        <div className="flex flex-col leading-tight z-10">
                            <h3 className="m-0 text-[15.5px] font-bold">HRMS Assistant</h3>
                            <span className="text-[11.5px] opacity-90">Online · replies instantly</span>
                        </div>

                        <span className="ml-auto text-[11px] bg-white/20 px-2.5 py-1 rounded-full capitalize z-10">
                            {designation}
                        </span>

                        <button
                            onClick={onToggle}
                            className="text-white text-2xl w-[30px] h-[30px] flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors z-10"
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 pb-4 pt-1.5 flex flex-col gap-4 bg-[#f7f7fc] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {messages.map(msg => {
                            const isLast = msg.id === lastMessageId
                            const actions = msg.actions ?? []
                            const menuMode = msg.sender === 'bot' && isMenuActions(actions)
                            const isBot = msg.sender === 'bot'

                            return (
                                <div key={msg.id} className={`flex gap-2.5 items-end ${isBot ? '' : 'justify-end'} animate-[cbFadeIn_0.25s_ease]`}>
                                    {isBot && (
                                        <div className={`w-[30px] h-[30px] rounded-full ${GRADIENT} text-white flex items-center justify-center text-[15px] shrink-0 shadow-[0_3px_8px_rgba(109,94,252,0.3)]`}>
                                            🤖
                                        </div>
                                    )}

                                    <div className={`flex flex-col max-w-[84%] ${isBot ? 'items-start' : 'items-end'}`}>
                                        <div
                                            className={
                                                isBot
                                                    ? 'px-[15px] py-3 rounded-[18px] rounded-bl-md bg-white text-[#1f2430] text-[13.5px] leading-relaxed whitespace-pre-line break-words shadow-[0_3px_14px_rgba(43,30,120,0.07)]'
                                                    : `px-[15px] py-3 rounded-[18px] rounded-br-md ${GRADIENT} text-white text-[13.5px] leading-relaxed whitespace-pre-line break-words shadow-[0_5px_16px_rgba(109,94,252,0.32)]`
                                            }
                                        >
                                            {msg.text}
                                        </div>

                                        {/* Action buttons (Confirm/Cancel/Skip or menu grid) */}
                                        {isBot && actions.length > 0 && (
                                            <div className={menuMode ? 'grid grid-cols-2 gap-2.5 mt-3 w-full' : 'flex flex-wrap gap-2 mt-2.5'}>
                                                {actions.map((action, i) => {
                                                    const isBack = action.label.startsWith('←')
                                                    const isSecondary =
                                                        isBack ||
                                                        action.label.toLowerCase() === 'cancel' ||
                                                        action.label.toLowerCase() === 'skip'
                                                    const disabled = loading || !isLast

                                                    if (menuMode) {
                                                        return (
                                                            <button
                                                                key={i}
                                                                type="button"
                                                                disabled={disabled}
                                                                onClick={() => handleActionClick(action)}
                                                                className={`bg-white text-[#1f2430] border border-[#eceef5] shadow-[0_2px_8px_rgba(43,30,120,0.04)] px-3.5 py-4 rounded-2xl flex items-center gap-2 font-bold text-[13px] text-left transition-all duration-150 hover:border-[#c9c2ff] hover:bg-[#f6f4ff] hover:text-[#6d5efc] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(109,94,252,0.15)] disabled:opacity-45 disabled:cursor-not-allowed ${isBack ? 'col-span-2 justify-center' : ''}`}
                                                            >
                                                                {action.label}
                                                            </button>
                                                        )
                                                    }

                                                    return (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            disabled={disabled}
                                                            onClick={() => handleActionClick(action)}
                                                            className={
                                                                isSecondary
                                                                    ? 'px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-white text-[#6d5efc] border-[1.5px] border-[#e2e0fb] cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed'
                                                                    : `px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white ${GRADIENT} border-none cursor-pointer shadow-[0_5px_14px_rgba(109,94,252,0.3)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(109,94,252,0.42)] active:translate-y-0 active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed`
                                                            }
                                                        >
                                                            {action.label}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}

                                        {/* Interactive widget: date picker or leave-type cards */}
                                        {isBot && msg.widget && (
                                            <ChatWidgetRenderer
                                                widget={msg.widget}
                                                disabled={loading || !isLast}
                                                onSubmit={sendText}
                                            />
                                        )}

                                        <span className="text-[10px] text-[#8a90a5] mt-1 px-1">{formatTime(msg.timestamp)}</span>
                                    </div>
                                </div>
                            )
                        })}

                        {loading && (
                            <div className="flex gap-2.5 items-end">
                                <div className={`w-[30px] h-[30px] rounded-full ${GRADIENT} text-white flex items-center justify-center text-[15px] shrink-0 shadow-[0_3px_8px_rgba(109,94,252,0.3)]`}>
                                    🤖
                                </div>
                                <div className="flex gap-1 px-4 py-3.5 bg-white rounded-[18px] rounded-bl-md shadow-[0_3px_14px_rgba(43,30,120,0.07)]">
                                    <span className="w-[7px] h-[7px] rounded-full bg-[#6d5efc] opacity-60 animate-bounce" />
                                    <span className="w-[7px] h-[7px] rounded-full bg-[#6d5efc] opacity-60 animate-bounce [animation-delay:0.15s]" />
                                    <span className="w-[7px] h-[7px] rounded-full bg-[#6d5efc] opacity-60 animate-bounce [animation-delay:0.3s]" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <form onSubmit={sendMessage} className="flex gap-2 px-3.5 py-3 bg-white border-t border-[#eceef5] items-center">
                        <button
                            type="button"
                            onClick={openMainMenu}
                            disabled={loading}
                            title="Main menu"
                            className="bg-[#f4f2ff] text-[#6d5efc] border border-[#e2e0fb] rounded-xl w-[42px] h-[42px] shrink-0 text-[17px] flex items-center justify-center transition-colors hover:bg-[#e9e5ff] disabled:opacity-45 disabled:cursor-not-allowed"
                        >
                            ☰
                        </button>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a question, or use the menu..."
                            disabled={loading}
                            className="flex-1 px-[15px] py-3 border border-[#eceef5] rounded-xl text-[13px] font-inherit outline-none bg-[#f7f7fc] transition-colors focus:border-[#6d5efc] focus:bg-white placeholder:text-[#a7adbd]"
                        />
                        <button
                            type="submit"
                            disabled={loading || !inputValue.trim()}
                            className={`${GRADIENT} text-white border-none rounded-xl w-[42px] h-[42px] shrink-0 text-[17px] flex items-center justify-center transition-transform shadow-[0_5px_14px_rgba(109,94,252,0.35)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none`}
                        >
                            →
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}

// ── Widget renderer ───────────────────────────────────────────────────────────

interface ChatWidgetRendererProps {
    widget: ChatWidget;
    disabled: boolean;
    onSubmit: (text: string) => void;
}

function ChatWidgetRenderer({ widget, disabled, onSubmit }: ChatWidgetRendererProps) {
    const [dateValue, setDateValue] = useState('')

    if (widget.type === 'date') {
        return (
            <div className="flex flex-wrap gap-2 mt-2.5 items-center">
                <input
                    type="date"
                    value={dateValue}
                    min={widget.minDate}
                    disabled={disabled}
                    onChange={(e) => setDateValue(e.target.value)}
                    className="px-3 py-2.5 border border-[#eceef5] rounded-[11px] text-[13px] font-inherit text-[#1f2430] outline-none transition-colors focus:border-[#6d5efc] disabled:opacity-60"
                />
                <button
                    type="button"
                    disabled={disabled || !dateValue}
                    onClick={() => onSubmit(dateValue)}
                    className={`px-4 py-2.5 rounded-[11px] text-[13px] font-semibold text-white ${GRADIENT} border-none cursor-pointer shadow-[0_5px_14px_rgba(109,94,252,0.3)] transition-transform hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed`}
                >
                    Set date
                </button>
            </div>
        )
    }

    if (widget.type === 'leaveTypes') {
        const options = widget.options ?? []
        return (
            <div className="flex flex-col gap-2 mt-2.5 w-full">
                {options.map((opt, i) => (
                    <button
                        key={i}
                        type="button"
                        disabled={disabled}
                        onClick={() => onSubmit(`type:${opt.code}`)}
                        className="flex justify-between items-center gap-2.5 px-[15px] py-3.5 border border-[#eceef5] bg-white rounded-2xl cursor-pointer shadow-[0_2px_8px_rgba(43,30,120,0.04)] transition-all duration-150 text-left hover:border-[#c9c2ff] hover:bg-[#f6f4ff] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="font-semibold text-[#1f2430] text-[13px]">{opt.name} ({opt.code})</span>
                        <span
                            className={
                                opt.balance === null || opt.balance <= 0
                                    ? 'text-[11.5px] font-bold text-[#9aa0b0] bg-[#f0f1f5] px-2.5 py-1 rounded-full whitespace-nowrap'
                                    : 'text-[11.5px] font-bold text-[#0f9d68] bg-[#e6f8f0] px-2.5 py-1 rounded-full whitespace-nowrap'
                            }
                        >
                            {opt.balance === null ? 'no balance' : `${opt.balance} left`}
                        </span>
                    </button>
                ))}
            </div>
        )
    }

    return null
}
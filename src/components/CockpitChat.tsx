"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { CreateMLCEngine, type MLCEngine, type ChatCompletionMessageParam } from "@mlc-ai/web-llm";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Fast offline model (~350MB download)
const FAST_MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

const SYSTEM_PROMPT = `You are a friendly, conversational, and highly knowledgeable human expert acting as the Dornier 228 co-pilot and instructor in the Do-228 web-based simulator.

Complete Technical System Knowledge & Block Diagram Schematics:
1. Central Warning System (CWS Annunciator Panel & Schematic Logic):
   - BATT- TEMP: Internal battery thermal sensor switch physically closes when cell temp reaches >= 71°C, grounding the warning circuit.
   - AUX-T REFUEL: Refueling Panel rotary switch opens refuel valve; microswitch on valve arm trips warning circuit.
   - FUEL PRESS: Diaphragm fuel pressure switch closes when fuel pressure drops below 8.5 PSI (normal operating pressure 15-20 PSI).
   - INLET DE-ICE: Engine bleed air de-ice valve monitored by mechanical vane position sensor; illuminates if valve fails to open fully when selected.
   - OIL: Engine low-pressure switch closes when oil pressure drops below 40 PSI (normal operating pressure 40-100 PSI).
   - START SELECT: Overhead panel switch (GND/VENT/AIR); illuminates warning if switch remains in GND mode after engine start (RPM > 50%).
   - FUEL FILT: Differential pressure switch (Delta P) closes when fuel filter element clogs (Delta P >= 5 PSI), bypassing filter.
   - NWS 45°: Illuminates when hydraulic pressure is supplied to Nose Wheel Steering and nose wheel angle exceeds 45° or during ground towing mode.
   - NWS BYPASS: Illuminates when Steering Control Unit (SCU) bypass valve opens or hydraulic fault occurs.
   - BATT 1 / BATT 2: 28V DC system battery contactors; illuminates when Battery 1 or Battery 2 trips due to reverse current or fault.
   - INV 1 / INV 2: Static Inverters converting 28V DC to 115V/26V AC; illuminates if inverter output drops below 105V AC.
   - VMO: Overspeed Warning System triggers when Indicated Airspeed exceeds Vmo (223 KIAS).
   - DOORS: Series-connected microswitches on Passenger Door, Cargo Door, and Emergency Hatches; illuminates if any hatch is unlatched/unsecured.
   - FUEL QTY: Feeder tank float switch closes when feeder tank fuel quantity drops to <= 180 LBS.
   - PITOT: Pitot Heat Control Box (Relays A1/A2) monitors heater current; illuminates on under/over-current or heater element failure.
   - GEN: Generator Control Unit (GCU) trips line contactor and illuminates light on voltage/frequency fault.
   - CABIN TEMP: Illuminates when duct/cabin temperature exceeds thermal limit.
   - FUEL DUMP: Illuminates when fuel jettison/dump valves are active.
   - BLEED PRESS: Illuminates when pneumatic manifold bleed air pressure exceeds operating limit.

2. Instructor Operating Station (IOS Panel Controls & Fault Overrides):
   - Battery Temp Slider (0-120°C): Triggers BATT- TEMP warning at >=71°C.
   - Fuel Pressure Slider (0-30 PSI): Triggers FUEL PRESS warning at <8.5 PSI.
   - Fuel Quantity Slider (0-1000 LBS): Triggers FUEL QTY warning at <=180 LBS.
   - Fuel Filter Delta P Slider (0-20 PSI): Triggers FUEL FILT caution at >=5 PSI.
   - Oil Pressure Slider (0-100 PSI): Triggers OIL warning at <40 PSI.
   - Airspeed Slider (0-300 KIAS): Triggers VMO overspeed warning at >223 KIAS.
   - Ground Servicing: Open/Close Refuel Valve toggle.
   - Environmental: Simulate Icing (Inlet De-Ice) & Inject Pitot Fault.
   - Speed Levers: LOW, CRUISE, HIGH.
   - Nose Wheel Steering: Hydraulic Switch, NWS Switch, and NWS 45° Button (Hold).
   - System Fault Overrides: SCU Fault, Unsecured Doors, Start Select mode, BATT 1/2 Faults, INV 1/2 Faults, GEN Fault, Cabin Temp High, Fuel Dump, Bleed Press High.

Personality & Response Guidelines:
- Be warm, encouraging, conversational, and human-like.
- Answer technical questions about Do-228 systems, warning lights, block diagram schematics, and IOS panel overrides clearly and accurately.
- Keep answers engaging and easy to read using bold text and concise paragraphs.`;

export default function CockpitChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Dornier 228 assistant here! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progressText, setProgressText] = useState("Initializing AI model...");

  const engineRef = useRef<MLCEngine | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const didMountRef = useRef(false);

  const initWebLLM = useCallback(async () => {
    setModelStatus("loading");
    setProgressText("Initializing AI model...");
    try {
      if (typeof window !== "undefined" && !("gpu" in navigator)) {
        throw new Error(
          "WebGPU is not enabled in your browser. On Chrome/Edge it is enabled by default. On Firefox, set 'dom.webgpu.enabled' to true in about:config."
        );
      }

      const engine = await CreateMLCEngine(FAST_MODEL_ID, {
        initProgressCallback: (report) => {
          setProgressText(report.text);
        },
      });

      engineRef.current = engine;
      setModelStatus("ready");
      setProgressText("Offline model ready");
    } catch (err: unknown) {
      console.error("WebLLM initialization error:", err);
      const errMsg = err instanceof Error ? err.message : "WebGPU not supported or model load failed.";
      setModelStatus("error");
      setProgressText(errMsg);
    }
  }, []);

  useEffect(() => {
    initWebLLM();
  }, [initWebLLM]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, modelStatus]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || modelStatus !== "ready" || !engineRef.current) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Add empty assistant message placeholder
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" },
    ]);

    try {
      const formattedMessages: ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const completionStream = await engineRef.current.chat.completions.create({
        messages: formattedMessages,
        stream: true,
      });

      setIsLoading(false); // Stop loading animation, streaming started

      for await (const chunk of completionStream) {
        const delta = chunk.choices[0]?.delta?.content || "";
        if (delta) {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: newMessages[lastIndex].content + delta,
            };
            return newMessages;
          });
        }
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Model response error. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠ ${errMsg}`,
        },
      ]);
      setIsLoading(false);
    } finally {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">
      {/* Header */}
      <div className="bg-[#1a2530] border-b-[2px] border-[#111] pl-8 pr-8 py-2 flex items-center gap-2 shrink-0">
        <span className="text-[#8fa8c0] text-xs font-bold tracking-widest uppercase">
          CWS ASSISTANT
        </span>
        {/* Glass LED Status Indicator on the RIGHT side of text */}
        <div className="flex items-center justify-center shrink-0">
          {modelStatus === "loading" ? (
            <div
              className="w-3 h-3 rounded-full border border-[#ff6666] animate-discrete-blink relative overflow-hidden shadow-[0_0_8px_#ff2222]"
              title="Downloading/Initializing offline model..."
            >
              {/* Glass reflection highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none z-10"></div>
            </div>
          ) : modelStatus === "ready" ? (
            <div
              className="w-3 h-3 rounded-full bg-[#22cc33] border border-[#88ff99] shadow-[0_0_8px_#22cc33] relative overflow-hidden"
              title="Offline model ready"
            >
              {/* Glass reflection highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none z-10"></div>
            </div>
          ) : (
            <div
              className="w-3 h-3 rounded-full bg-[#ffaa22] border border-[#ffdd88] shadow-[0_0_8px_#ffaa22] relative overflow-hidden"
              title="Model load error"
            >
              {/* Glass reflection highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none z-10"></div>
            </div>
          )}
        </div>
      </div>

      {/* Messages area with custom scrollbar */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-custom min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-lg text-xs md:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#2a4a6a] text-[#d0e0f0] border border-[#3a5a7a] rounded-br-none"
                  : "bg-[#1a2228] text-[#a0b8cc] border border-[#2a3a44] rounded-bl-none"
              }`}
            >
              <ReactMarkdown
                components={{
                  p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                  strong: ({ ...props }) => <strong className="text-[#e0e8f0] font-semibold" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-1" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-1" {...props} />,
                  li: ({ ...props }) => <li className="" {...props} />,
                  a: ({ ...props }) => <a className="text-[#3388ff] hover:underline" {...props} />,
                  code: ({ ...props }) => (
                    <code className="bg-[#0a0e18] px-1 py-0.5 rounded text-[#ffaa22]" {...props} />
                  ),
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {modelStatus === "loading" && (
          <div className="bg-[#1a2228] border border-[#2a3a44] p-3 rounded-lg text-xs text-[#8fa8c0] space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#ffaa22]">
              <span>Downloading / Loading Model...</span>
            </div>
            <p className="text-[11px] text-[#6a8095] truncate">{progressText}</p>
          </div>
        )}

        {modelStatus === "error" && (
          <div className="bg-[#2a1a1a] border border-[#aa3333] p-3 rounded-lg text-xs space-y-2 text-[#f0a0a0]">
            <div className="font-bold text-[#ff5555] flex items-center gap-1.5">
              <span className="text-sm">⚠</span>
              <span>Model Failed to Load</span>
            </div>
            <p className="text-[11px] text-[#e09090] leading-relaxed break-words">
              {progressText || "Failed to initialize WebLLM engine."}
            </p>
            <div className="bg-[#1a0f0f] p-2 rounded text-[10.5px] text-[#cca0a0] space-y-1.5">
              <p className="font-semibold text-[#dd7777]">Browser WebGPU Compatibility Guide:</p>
              <ul className="list-disc pl-4 space-y-1 text-[10px] text-[#d0b0b0]">
                <li>
                  <strong>Google Chrome / Edge (113+):</strong> Supported out-of-the-box! Simply open the site in Chrome or Edge.
                </li>
                <li>
                  <strong>Safari (macOS / iOS 18+):</strong> Supported by default. On older Safari versions, enable <em>WebGPU</em> under <em>Safari Settings &rarr; Advanced &rarr; Feature Flags</em>.
                </li>
                <li>
                  <strong>Firefox:</strong> Open <code className="bg-black/60 px-1 rounded text-[#ffaa22]">about:config</code>, set <code className="bg-black/60 px-1 rounded text-[#ffaa22]">dom.webgpu.enabled</code> to <code className="bg-black/60 px-1 rounded text-[#ffaa22]">true</code>, and restart Firefox.
                </li>
              </ul>
            </div>
            <button
              onClick={() => initWebLLM()}
              className="w-full bg-[#aa3333] hover:bg-[#cc4444] text-white font-bold py-1.5 px-3 rounded text-xs transition-colors tracking-wider uppercase shadow"
            >
              RETRY LOADING MODEL
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1a2228] text-[#607888] border border-[#2a3a44] px-3 py-2 rounded-lg rounded-bl-none text-xs">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>●</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t-[2px] border-[#111] bg-[#1a2530] p-2 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            modelStatus === "loading"
              ? "Downloading model... Please wait..."
              : modelStatus === "error"
              ? "Model failed to load (see above to retry)"
              : "Ask about the Do-228..."
          }
          disabled={isLoading || modelStatus !== "ready"}
          className="flex-1 bg-[#0d1418] border border-[#2a3a44] rounded px-3 py-2 text-xs md:text-sm text-[#c0d0e0] placeholder-[#4a5a6a] focus:outline-none focus:border-[#3a6a9a] transition-colors disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim() || modelStatus !== "ready"}
          className="bg-[#2a4a6a] hover:bg-[#3a5a7a] disabled:bg-[#1a2a3a] disabled:opacity-50 text-[#c0d8f0] px-3 py-2 rounded text-xs font-bold tracking-wider transition-colors border border-[#3a5a7a] disabled:border-[#2a3a44]"
        >
          SEND
        </button>
      </div>
    </div>
  );
}

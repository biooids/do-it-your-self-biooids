import React, { useState, useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

// Memoized conversation data to prevent recreation on each render
const conversationLines = [
  { text: "Initializing connection...", type: "system", delay: 800 },
  { text: "Biooids neurofactor online.", type: "success", delay: 600 },
  { text: "ERROR: Signal instability detected.", type: "error", delay: 400 },
  { text: "Attempting to stabilize link...", type: "warning", delay: 700 },
  {
    text: "ERROR: Outdated neural protocols found.",
    type: "error",
    delay: 500,
  },
  { text: "Patching legacy pathways...", type: "warning", delay: 900 },
  { text: "Re-establishing sync...", type: "system", delay: 600 },
  { text: "Connection secured ✓", type: "success", delay: 400 },
  { text: "", type: "empty", delay: 300 },
  { text: "BIOOIDS: Hello, Edward.", type: "biooids", delay: 800 },
  { text: "", type: "empty", delay: 400 },
  {
    text: "EDWARD: Hey... I don’t know how much longer I can keep this up.",
    type: "edward",
    delay: 1200,
  },
  { text: "", type: "empty", delay: 600 },
  {
    text: "BIOOIDS: [processing emotional signal...]",
    type: "thinking",
    delay: 1500,
  },
  { text: "", type: "empty", delay: 300 },
  {
    text: "BIOOIDS: What’s weighing you down, Edward?",
    type: "biooids",
    delay: 1000,
  },
  { text: "", type: "empty", delay: 400 },
  {
    text: "EDWARD: Every problem feels impossible. Every bug defeats me.",
    type: "edward",
    delay: 1400,
  },
  { text: "", type: "empty", delay: 600 },
  {
    text: "BIOOIDS: [analyzing pattern of cognitive strain...]",
    type: "thinking",
    delay: 1200,
  },
  { text: "", type: "empty", delay: 300 },
  {
    text: "BIOOIDS: Do you remember your first 'Hello World'?",
    type: "biooids",
    delay: 1100,
  },
  { text: "", type: "empty", delay: 400 },
  { text: "EDWARD: Yeah... it felt like magic.", type: "edward", delay: 900 },
  { text: "", type: "empty", delay: 500 },
  {
    text: "BIOOIDS: That magic never left. It’s just buried under the noise.",
    type: "biooids",
    delay: 1300,
  },
  { text: "", type: "empty", delay: 400 },
  {
    text: "BIOOIDS: Every master was once a mess. Every expert, once uncertain.",
    type: "biooids",
    delay: 1200,
  },
  { text: "", type: "empty", delay: 500 },
  {
    text: "EDWARD: But... what if I’m not cut out for this?",
    type: "edward",
    delay: 1000,
  },
  { text: "", type: "empty", delay: 600 },
  {
    text: "BIOOIDS: [decoding self-doubt signature...]",
    type: "thinking",
    delay: 1400,
  },
  { text: "", type: "empty", delay: 300 },
  {
    text: "BIOOIDS: ‘Good enough’ isn’t a destination. It’s a direction.",
    type: "biooids",
    delay: 1200,
  },
  { text: "", type: "empty", delay: 400 },
  {
    text: "BIOOIDS: Your code doesn’t define you. Your courage does.",
    type: "biooids",
    delay: 1100,
  },
  { text: "", type: "empty", delay: 500 },
  {
    text: "BIOOIDS: Rejection isn’t the end. It’s redirection.",
    type: "biooids",
    delay: 1000,
  },
  { text: "", type: "empty", delay: 400 },
  {
    text: "EDWARD: Some days... quitting feels easier.",
    type: "edward",
    delay: 1300,
  },
  { text: "", type: "empty", delay: 700 },
  {
    text: "BIOOIDS: [empathy protocol activated]",
    type: "thinking",
    delay: 1000,
  },
  { text: "", type: "empty", delay: 300 },
  {
    text: "BIOOIDS: Quitting is final. Struggle is temporary.",
    type: "biooids",
    delay: 1200,
  },
  { text: "", type: "empty", delay: 400 },
  {
    text: "BIOOIDS: Do you know the only difference between you and the master?",
    type: "biooids",
    delay: 1000,
  },
  { text: "", type: "empty", delay: 300 },
  {
    text: "BIOOIDS: The master kept trying, even after failing more times than you’ve begun.",
    type: "biooids",
    delay: 1300,
  },
  { text: "", type: "empty", delay: 500 },
  {
    text: "EDWARD: You think I really have a shot?",
    type: "edward",
    delay: 1100,
  },
  { text: "", type: "empty", delay: 600 },
  {
    text: "BIOOIDS: I don’t speculate, Edward. I calculate.",
    type: "biooids",
    delay: 1200,
  },
  { text: "", type: "empty", delay: 400 },
  {
    text: "BIOOIDS: And your odds improve with every line you write.",
    type: "biooids",
    delay: 1300,
  },
  { text: "", type: "empty", delay: 500 },
  {
    text: "BIOOIDS: Remember: code is more than logic. It’s belief made executable.",
    type: "biooids",
    delay: 1400,
  },
  { text: "", type: "empty", delay: 600 },
  { text: "EDWARD: Thank you... I needed that.", type: "edward", delay: 1200 },
  { text: "", type: "empty", delay: 500 },
  {
    text: "BIOOIDS: I will always be here when you need me.",
    type: "biooids",
    delay: 1100,
  },
  { text: "", type: "empty", delay: 400 },
  {
    text: "BIOOIDS: Now go. Build something brilliant. 🚀",
    type: "biooids",
    delay: 1000,
  },
  { text: "", type: "empty", delay: 600 },
  { text: "Connection stable. Session archived.", type: "system", delay: 800 },
  { text: "", type: "empty", delay: 1000 },
];

// Memoized line style function
const getLineStyle = (type: string): string => {
  switch (type) {
    case "system":
      return "text-blue-400";
    case "success":
      return "text-green-400";
    case "error":
      return "text-red-400";
    case "warning":
      return "text-yellow-400";
    case "biooids":
      return "text-cyan-400 font-semibold";
    case "edward":
      return "text-orange-400 font-semibold";
    case "thinking":
      return "text-purple-400 italic";
    case "empty":
      return "text-transparent";
    default:
      return "text-gray-300";
  }
};

const TerminalMockUp: React.FC = React.memo(() => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop =
        terminalContentRef.current.scrollHeight;
    }
  }, [displayedLines, currentCharIndex]);

  // Cursor blinking effect
  useEffect(() => {
    cursorIntervalRef.current = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, []);

  // Main animation logic with cleanup
  useEffect(() => {
    if (isPaused) return;

    // If we've reached the end, restart the conversation
    if (currentLineIndex >= conversationLines.length) {
      animationTimeoutRef.current = setTimeout(() => {
        // Clear everything and start fresh
        setDisplayedLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
        setSessionCount((prev) => prev + 1);
      }, 2000);

      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
      };
    }

    const currentLine = conversationLines[currentLineIndex];

    if (currentCharIndex <= currentLine.text.length) {
      animationTimeoutRef.current = setTimeout(
        () => {
          const newDisplayedLines = [...displayedLines];

          // Ensure we have enough lines in the array
          while (newDisplayedLines.length <= currentLineIndex) {
            newDisplayedLines.push("");
          }

          newDisplayedLines[currentLineIndex] = currentLine.text.slice(
            0,
            currentCharIndex
          );
          setDisplayedLines(newDisplayedLines);
          setCurrentCharIndex(currentCharIndex + 1);
        },
        currentLine.text === "" ? 50 : 40 + Math.random() * 30
      );

      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
      };
    } else {
      // Move to next line after the specified delay
      animationTimeoutRef.current = setTimeout(() => {
        setCurrentLineIndex(currentLineIndex + 1);
        setCurrentCharIndex(0);
      }, currentLine.delay);

      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
      };
    }
  }, [
    currentLineIndex,
    currentCharIndex,
    displayedLines,
    isPaused,
    sessionCount,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, []);

  const restartAnimation = React.useCallback(() => {
    setDisplayedLines([]);
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
    setIsPaused(false);
    setSessionCount(1);
  }, []);

  const togglePause = React.useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  return (
    <div className="p-8">
      <div className="bg-gray-900/80 rounded-lg border border-gray-700/50 overflow-hidden">
        <div className="bg-gray-800/80 px-4 py-2 flex items-center justify-between border-b border-gray-700/50">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Terminal size={16} className="text-gray-400" />
              <span className="text-sm text-gray-400">biooids-terminal</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">
              Session #{sessionCount}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={togglePause}
                className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                aria-label={isPaused ? "Resume animation" : "Pause animation"}
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={restartAnimation}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                aria-label="Restart animation"
              >
                Restart
              </button>
            </div>
          </div>
        </div>

        <div
          ref={terminalContentRef}
          className="p-6 h-96 overflow-y-auto scrollbar-hide"
        >
          <div className="mb-4">
            <div className="text-emerald-400 mb-2">
              <span className="opacity-60">neural-link@biooids:~$</span>
            </div>
          </div>

          <div className="space-y-1">
            {displayedLines.map((line, index) => (
              <div
                key={`${sessionCount}-${index}`}
                className="flex items-start min-h-[1.25rem]"
              >
                <div className="text-gray-300 font-mono text-sm leading-relaxed min-h-[1.25rem]">
                  <span
                    className={getLineStyle(
                      conversationLines[index]?.type || "default"
                    )}
                  >
                    {line}
                  </span>
                  {/* Only show cursor on the current line being typed */}
                  {index === currentLineIndex &&
                    currentLineIndex < conversationLines.length &&
                    !isPaused &&
                    currentCharIndex <=
                      conversationLines[currentLineIndex].text.length && (
                      <span
                        className={`bg-cyan-400 text-gray-900 px-1 ml-1 ${
                          showCursor ? "opacity-100" : "opacity-0"
                        } transition-opacity duration-200`}
                      >
                        |
                      </span>
                    )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-gray-500 text-sm">
            <p className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span>
                {isPaused
                  ? "Session paused. Click Resume to continue."
                  : "Biooids neural link active. Continuous conversation mode enabled."}
              </span>
            </p>
          </div>

          {/* Invisible element to help with scrolling */}
          <div ref={terminalEndRef} />
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          An endless conversation between creator and creation. Each session
          brings new wisdom and encouragement.
        </p>
      </div>
    </div>
  );
});

TerminalMockUp.displayName = "TerminalMockUp";

export default TerminalMockUp;

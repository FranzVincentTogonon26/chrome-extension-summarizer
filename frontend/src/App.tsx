import { useEffect, useState, useCallback } from "react";

type Status = "extracting" | "summarizing" | "done" | "error";

function App() {
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<Status>("extracting");
  const [copied, setCopied] = useState(false);

  const summarize = useCallback(async () => {
    try {
      setStatus("extracting");

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const response = await chrome.tabs.sendMessage(tab.id!, {
        type: "EXTRACT_TEXT",
      });

      setStatus("summarizing");

      const res = await fetch(`http://localhost:8000/api/summarize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: response.text }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      setSummary(""); // reset before streaming

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        setSummary((prev) => prev + decoder.decode(value, { stream: true }));
      }

      setStatus("done");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    summarize();
  }, [summarize]);

  const handleRetry = () => {
    setSummary("");
    setStatus("extracting");
    summarize();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-85 min-h-40 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-sm">Article Summarizer</span>
        </div>

        {status === "extracting" && (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse" />
            Reading..
          </span>
        )}

        {status === "summarizing" && (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse" />
            Summarizing..
          </span>
        )}

        {status === "done" && (
          <span className="text-xs text-green-500">Done</span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-3">
        {status === "summarizing" && !summary && (
          <div className="flex items-center gap-1 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce delay-150" />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce delay-300" />
          </div>
        )}

        {summary && (
          <p className="text-sm text-gray-700 leading-relaxed">
            {summary}
          </p>
        )}

        {status === "error" && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-red-400">
              Could not summarize this page.
            </p>
            <button
              onClick={handleRetry}
              className="self-start text-xs text-blue-500 hover:underline"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      {status === "done" && (
        <div className="flex items-center justify-end px-4 py-2 border-t border-gray-100">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            {copied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 text-green-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy summary
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
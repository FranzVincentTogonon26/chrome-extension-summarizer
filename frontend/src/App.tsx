import { useState } from "react"

type Status = "extracting" | "summarizing" | "done" | "error0";

function App() {

  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<Status>("extracting");
  const [copied, setCoped] = useState(false);

  return (
    <div className="w-85 min-h-40 bg-white flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-sm">Article Summarizer</span>
        </div>

        { status === "extracting" && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse" />
              Reading..
            </span>
          )
        }

        { status === "summarizing" && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse" />
              Summarizing..
            </span>
          )
        }



      </div>

    </div>
  )
}

export default App

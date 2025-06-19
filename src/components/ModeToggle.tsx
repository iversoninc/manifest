import { useFlowStore } from "../state/useFlowStore";

export function ModeToggle() {
  const mode = useFlowStore((s) => s.mode);
  const setMode = useFlowStore((s) => s.setMode);

  return (
    <div className="inline-flex bg-gray-700 rounded-xl p-1">
      <button
        onClick={() => setMode("hifi")}
        className={`
          px-3 py-1.5 text-sm font-medium transition-all
          ${mode === "hifi" 
            ? "bg-gray-500 text-white" 
            : "text-gray-300 hover:text-white"}
        `}
      >
        Hi-Fi
      </button>
      <button
        onClick={() => setMode("wireframe")}
        className={`
          px-3 py-1.5 text-sm font-medium transition-all
          ${mode === "wireframe" 
            ? "bg-gray-500 text-white" 
            : "text-gray-200 hover:text-white"}
        `}
      >
        Wireframe
      </button>
    </div>
  );
}

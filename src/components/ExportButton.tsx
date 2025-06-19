import { useFlowStore } from "../state/useFlowStore";
import { exportCodeToZip } from "../lib/codegen/exportToZip";

export function ExportButton() {
  const screens = useFlowStore((s) => s.screens);

  if (!screens.length) return null;

  return (
    <button
      onClick={() => exportCodeToZip(screens)}
      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center justify-center"
      title="Export React Native Code"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>
  );
}
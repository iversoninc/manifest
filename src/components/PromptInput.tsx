// src/components/PromptInput.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { getLayoutFromPrompt } from "../lib/aiClient";
import { useFlowStore } from "../state/useFlowStore";
import type { ScreenData } from "../types/flow";
import { Spinner } from "./Spinner";


export function PromptInput() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const setScreens = useFlowStore((state: { setScreens: (screens: ScreenData[]) => void }) => state.setScreens);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || loading) return; // Prevent submission if already loading
    
    setLoading(true);
    try {
      const screens = await getLayoutFromPrompt(value);
      console.log("Parsed screens:", screens);
      setScreens(screens);
      setValue("");
    } catch (error) {
      console.error("Error generating layout:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Describe your app flow..."
        className="flex-1 px-3 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Spinner /> : "Generate"}
      </button>
    </form>
  );
}
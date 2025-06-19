import { useFlowStore } from "./state/useFlowStore";
import { PromptInput } from "./components/PromptInput";
import type { ScreenData } from "./types/flow";
import { ModeToggle } from "./components/ModeToggle";
import { WireframeCanvas } from "./components/WireframeCanvas";
import { ExportButton } from "./components/ExportButton";
import { Screen } from "./components/Screen";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef } from "react";
import { CANVAS_CONFIG } from "./config/screenConfig";
import { usePanZoom } from "./hooks/usePanZoom";

function App() {
  const screens = useFlowStore((state: { screens: ScreenData[] }) => state.screens);
  const mode = useFlowStore((s) => s.mode);
  const framework = "tailwind" as const;
  
  // Hi-Fi mode pan/zoom state (shared for all screens)
  const {
    transform,
    handleWheel,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  } = usePanZoom();
  const hifiContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Main canvas area - takes up most of the screen */}
      <div className="mx-2 my-2 flex-grow relative bg-gray-800 rounded-xl">
        <AnimatePresence mode="wait">
          {screens.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full w-full"
            >
              <p className="text-sm text-gray-400 italic">
                No screens yet. Try prompting something!
              </p>
            </motion.div>
          ) : mode === "wireframe" ? (
            <motion.div
              key="wireframe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl"
              style={{ overflow: 'hidden' }}
            >
              <WireframeCanvas />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl"
              style={{ overflow: 'hidden' }}
              onWheel={handleWheel}
              ref={hifiContainerRef}
            >
              <div className="h-full w-full overflow-auto flex items-center justify-center">
                <div 
                  style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    transformOrigin: 'center center',
                    display: 'flex',
                    padding: '40px',
                    transition: 'transform 0.05s ease'
                  }}
                  onMouseDown={(e) => {
                    const pos = e;
                    if (pos) handleDragStart(e.clientX, e.clientY);
                  }}
                  onMouseMove={(e) => {
                    if (e.buttons === 1) handleDragMove(e.clientX, e.clientY);
                  }}
                  onMouseUp={handleDragEnd}
                >
                  {screens.map((screen, i) => (
                    <Screen 
                      key={i} 
                      screen={screen} 
                      framework={framework}
                    />
                  ))}
                </div>
                <div className="absolute bottom-4 right-4 bg-gray-800 text-gray-300 px-3 py-1 rounded-md text-sm">
                  {Math.round(transform.scale * 100)}% zoom
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Bottom control bar */}
      <div className="bg-gray-900 pt-2 pb-4 pl-4 pr-4 flex items-center gap-4">
        {/* Logo on the left */}
        <div className="mr-4">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Wireflow</h1>
        </div>
        
        {/* Prompt input in the center - takes most of the space */}
        <div className="flex-grow">
          <PromptInput />
        </div>
        
        {/* Controls on the right */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          <ExportButton />
        </div>
      </div>
    </div>
  );
}

export default App;
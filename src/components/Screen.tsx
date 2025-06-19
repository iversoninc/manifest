// src/components/Screen.tsx
import React, { useEffect } from 'react';
import type { ComponentData, ScreenData } from '../types/flow';
import { frameworkMap } from '../lib/frameworkMap';
import { getPointerPosition } from '../hooks/usePanZoom';
import { SCREEN_WIDTH, SCREEN_HEIGHT, LAYOUT_CONFIG, VISUAL_CONFIG } from '../config/screenConfig';

interface ScreenProps {
  screen: ScreenData;
  framework: string;
}

/**
 * Screen component to render each individual screen in high fidelity mode
 * Using shared configuration for consistent dimensions and styling
 */
export function Screen({ screen, framework }: ScreenProps) {
  const screenWidth = SCREEN_WIDTH;
  const screenHeight = SCREEN_HEIGHT;

  const tabBar = screen.components.find(c => c.type === 'TabBar' || c.type === 'BottomNav');
  const mainComponents = screen.components.filter(c => c.type !== 'TabBar' && c.type !== 'BottomNav');

  // Recursive renderer for nested children
  function renderComponent(comp: ComponentData, framework: string): React.ReactNode {
    const Comp = frameworkMap[framework as keyof typeof frameworkMap][comp.type]?.render;
    if (!Comp) return null;
    // Pass the original props, including children (which is an array of ComponentData)
    return <React.Fragment key={comp.label}>{Comp(comp)}</React.Fragment>;
  }

  return (
    <div className="flex flex-col items-center" style={{ margin: '0 20px' }}>
      {/* Pill-shaped screen name/label above the card */}
      <div className="mb-2">
        <span className="inline-block rounded-full bg-gray-700 px-4 py-1 text-gray-200 text-sm font-medium shadow-sm">
          {screen.screen}
        </span>
      </div>
      <div
        className="shadow rounded-lg relative"
        style={{
          width: screenWidth,
          height: screenHeight,
          borderRadius: VISUAL_CONFIG.cornerRadius,
          boxShadow: `0px ${VISUAL_CONFIG.shadow.offsetY}px ${VISUAL_CONFIG.shadow.blur}px ${VISUAL_CONFIG.shadow.color}`,
          border: `1px solid #444`,
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        {/* Screen content (no header) */}
        <div className="p-4 flex flex-col h-full" style={{ gap: `${LAYOUT_CONFIG.componentSpacing}px`, paddingBottom: tabBar ? 72 : undefined }}>
          {mainComponents.map((comp: ComponentData, i: number) => renderComponent(comp, framework))}
        </div>
        {tabBar && (
          <div className="absolute left-0 bottom-0 w-full">
            {frameworkMap[framework as keyof typeof frameworkMap][tabBar.type]?.render(tabBar)}
          </div>
        )}
      </div>
    </div>
  );
}
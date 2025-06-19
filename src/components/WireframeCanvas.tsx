// src/components/WireframeCanvas.tsx
import React, { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Group, Text, Line } from 'react-konva';
import Konva from 'konva';
import { useFlowStore } from '../state/useFlowStore';
import { usePanZoom, getPointerPosition } from '../hooks/usePanZoom';
import { SCREEN_WIDTH, SCREEN_HEIGHT, LAYOUT_CONFIG, VISUAL_CONFIG } from '../config/screenConfig';

export function WireframeCanvas() {
  const screens = useFlowStore((s) => s.screens);
  const {
    transform,
    handleWheel,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    setTransform
  } = usePanZoom();
  
  // Use shared configuration
  const screenWidth = SCREEN_WIDTH;
  const screenHeight = SCREEN_HEIGHT;
  const spacing = LAYOUT_CONFIG.spacing;
  
  // Track stage dimensions
  const [stageWidth, setStageWidth] = useState(window.innerWidth);
  const [stageHeight, setStageHeight] = useState(window.innerHeight);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setStageWidth(window.innerWidth);
      setStageHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Initial positioning - center the canvas when first rendered
  useEffect(() => {
    if (screens.length > 0) {
      const containerCenter = {
        x: stageWidth / 2,
        y: stageHeight / 2,
      };
      
      // Calculate total width needed for all screens
      const totalWidth = (screenWidth + spacing) * screens.length - spacing;
      
      const newPosition = { 
        x: containerCenter.x - (totalWidth / 2), 
        y: containerCenter.y - (screenHeight / 2)
      };
      
      setTransform(newPosition);
    }
  }, [screens.length, stageWidth, stageHeight, screenWidth, screenHeight, spacing, setTransform]);

  // Konva event handlers unified with getPointerPosition (only needed at Stage level)
  const handleKonvaWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    handleWheel(e.evt);
  };

  const handleKonvaDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    const pos = getPointerPosition(e);
    if (pos) handleDragStart(pos.x, pos.y);
  };

  const handleKonvaDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const pos = getPointerPosition(e);
    if (pos) handleDragMove(pos.x, pos.y);
  };

  const handleKonvaDragEnd = () => {
    handleDragEnd();
  };

  // Flow layout - position screens horizontally with proper spacing
  const getScreenPosition = (index: number) => {
    const x = index * (screenWidth + spacing);
    const y = 0;
    return { x, y };
  };

  // Draw connection lines between screens
  const renderConnectionLines = () => {
    if (screens.length <= 1) return null;
    
    return screens.map((_, i) => {
      if (i === screens.length - 1) return null;
      
      const start = getScreenPosition(i);
      const end = getScreenPosition(i + 1);
      
      return (
        <Line
          key={`line-${i}`}
          points={[
            start.x + screenWidth + 10, 
            start.y + screenHeight / 2, 
            end.x - 10, 
            end.y + screenHeight / 2
          ]}
          stroke="#6366f1"
          strokeWidth={2}
          dash={[10, 5]}
          lineCap="round"
        />
      );
    });
  };

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      scale={{ x: transform.scale, y: transform.scale }}
      position={{ x: transform.x, y: transform.y }}
      draggable={true}
      onWheel={handleKonvaWheel}
      onDragStart={handleKonvaDragStart}
      onDragMove={handleKonvaDragMove}
      onDragEnd={handleKonvaDragEnd}
    >
      <Layer>
        {renderConnectionLines()}
        {screens.map((screen, index) => {
          const { x, y } = getScreenPosition(index);

          return (
            <Group key={screen.screen} x={x} y={y}>
              {/* Phone frame background */}
              <Rect 
                width={screenWidth} 
                height={screenHeight} 
                fillLinearGradientStartPoint={{ x: 0, y: 0 }} 
                fillLinearGradientEndPoint={{ x: 0, y: screenHeight }}
                fillLinearGradientColorStops={[0, VISUAL_CONFIG.gradientStart, 1, VISUAL_CONFIG.gradientEnd]}
                stroke={VISUAL_CONFIG.borderColor}
                strokeWidth={VISUAL_CONFIG.borderWidth}
                cornerRadius={VISUAL_CONFIG.cornerRadius}
                shadowColor={VISUAL_CONFIG.shadow.color}
                shadowBlur={VISUAL_CONFIG.shadow.blur}
                shadowOffsetY={VISUAL_CONFIG.shadow.offsetY}
              />
              
              {/* Screen title bar */}
              <Rect
                width={screenWidth}
                height={50}
                fill="#f8f9fa"
                cornerRadius={[12, 12, 0, 0]}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
              
              <Text
                text={screen.screen}
                fontSize={16}
                fontStyle="bold"
                fill="#1f2937"
                x={15}
                y={18}
              />
            </Group>
          );
        })}
      </Layer>
    </Stage>
  );
}
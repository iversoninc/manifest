// src/hooks/usePanZoom.ts
import { useState, useRef, useCallback } from 'react';
import { CANVAS_CONFIG } from '../config/screenConfig';

interface PanZoomState {
  scale: number;
  x: number;
  y: number;
}

interface UsePanZoomOptions {
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
}

export function usePanZoom(options: UsePanZoomOptions = {}) {
  const {
    minScale = CANVAS_CONFIG.minScale,
    maxScale = CANVAS_CONFIG.maxScale,
    scaleStep = CANVAS_CONFIG.scaleStep
  } = options;

  const [transform, setTransform] = useState<PanZoomState>({
    scale: 1,
    x: 0,
    y: 0
  });

  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Handle wheel zoom
  const handleWheel = useCallback((e: WheelEvent | React.WheelEvent) => {
    e.preventDefault();
    
    const direction = e.deltaY > 0 ? 1 : -1;
    const newScale = direction > 0 ? transform.scale / scaleStep : transform.scale * scaleStep;
    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));
    
    setTransform(prev => ({
      ...prev,
      scale: clampedScale
    }));
  }, [transform.scale, scaleStep, minScale, maxScale]);

  // Handle drag start
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    isDragging.current = true;
    lastPointer.current = { x: clientX, y: clientY };
  }, []);

  // Handle drag move
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    
    const deltaX = clientX - lastPointer.current.x;
    const deltaY = clientY - lastPointer.current.y;
    
    setTransform(prev => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    lastPointer.current = { x: clientX, y: clientY };
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Reset transform
  const reset = useCallback((newTransform?: Partial<PanZoomState>) => {
    setTransform({
      scale: 1,
      x: 0,
      y: 0,
      ...newTransform
    });
  }, []);

  // Set transform manually
  const setManualTransform = useCallback((newTransform: Partial<PanZoomState>) => {
    setTransform(prev => ({
      ...prev,
      ...newTransform
    }));
  }, []);

  return {
    transform,
    handleWheel,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    reset,
    setTransform: setManualTransform,
    isDragging: isDragging.current
  };
}

// Utility to normalize pointer events from DOM or Konva
export function getPointerPosition(e: any): { x: number; y: number } | null {
  // Konva event: e.evt is the native event, e.target.getStage()?.getPointerPosition() gives stage coords
  if (e && typeof e === 'object') {
    // Konva event object
    if (e.target && typeof e.target.getStage === 'function') {
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) return { x: pos.x, y: pos.y };
    }
    // DOM MouseEvent or React.MouseEvent
    if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
      return { x: e.clientX, y: e.clientY };
    }
  }
  return null;
}
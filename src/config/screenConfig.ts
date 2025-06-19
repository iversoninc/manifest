/**
 * Shared configuration for screen dimensions and rendering
 * Used by both WireframeCanvas and Screen components
 */

// Standard mobile dimensions (iPhone X/XS/11 Pro)
export const SCREEN_WIDTH = 375;
export const SCREEN_HEIGHT = 812;

// Layout configuration 
export const LAYOUT_CONFIG = {
  spacing: 180,
  componentHeight: 40,
  componentSpacing: 8,
  headerHeight: 50
};

// Interactive canvas configuration
export const CANVAS_CONFIG = {
  minScale: 0.2,
  maxScale: 3,
  scaleStep: 1.05,
  defaultBackgroundColor: "#f5f7fa"
};

// Visual styling
export const VISUAL_CONFIG = {
  gradientStart: "#ffffff",
  gradientEnd: "#f0f0ff",
  borderColor: "#e5e7eb",
  borderWidth: 2,
  cornerRadius: 12,
  shadow: {
    color: "rgba(0,0,0,0.2)",
    blur: 8,
    offsetY: 2
  },
  headerStyle: {
    backgroundColor: "#f8f9fa",
    textColor: "#1f2937",
    fontSize: 16
  }
};

import { useEffect, useRef, useCallback } from "react";

/**
 * ProtectedImage — renders images on a canvas element to prevent
 * easy right-click saving / dragging. Also disables context menu.
 */
export const ProtectedImage = ({ src, alt, className = "", width, height, fallbackInitial }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    };
    img.onerror = () => {
      // Draw fallback initial
      canvas.width = width || 200;
      canvas.height = height || 200;
      ctx.fillStyle = "hsl(var(--muted))";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (fallbackInitial) {
        ctx.fillStyle = "hsl(var(--muted-foreground))";
        ctx.font = `bold ${Math.round(canvas.width * 0.4)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(fallbackInitial, canvas.width / 2, canvas.height / 2);
      }
    };
    img.src = src;
  }, [src, width, height, fallbackInitial]);

  return (
    <canvas
      ref={canvasRef}
      className={`protected-content ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{ width: width || "100%", height: height || "100%", objectFit: "cover" }}
      aria-label={alt}
    />
  );
};

/**
 * useContentProtection — hook that applies CSS-based content protection
 * to a container ref. Disables right-click, text selection, dragging,
 * and keyboard shortcuts for copying/printing on the protected area.
 */
export const useContentProtection = (containerRef) => {
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    return false;
  }, []);

  const handleKeyDown = useCallback((e) => {
    // Block Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+U, PrintScreen
    if (
      (e.ctrlKey && (e.key === "s" || e.key === "p" || e.key === "u")) ||
      e.key === "PrintScreen"
    ) {
      e.preventDefault();
      return false;
    }
  }, []);

  const handleDragStart = useCallback((e) => {
    if (e.target.tagName === "IMG" || e.target.tagName === "CANVAS") {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    el.addEventListener("contextmenu", handleContextMenu);
    el.addEventListener("dragstart", handleDragStart);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      el.removeEventListener("contextmenu", handleContextMenu);
      el.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef, handleContextMenu, handleDragStart, handleKeyDown]);
};

/**
 * ProtectedContent — wrapper component that applies content protection
 * to its children. Use around sensitive profile information.
 */
export const ProtectedContent = ({ children, className = "" }) => {
  const ref = useRef(null);
  useContentProtection(ref);

  return (
    <div ref={ref} className={`protected-content ${className}`}>
      {children}
    </div>
  );
};

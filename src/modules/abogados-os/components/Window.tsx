import React, { useState, useRef } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import type { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  window: windowState,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // --- DRAG HANDLERS ---
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag if clicking the title bar background, not buttons
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    e.stopPropagation();
    onFocus(windowState.id);
    
    // Prevent dragging if maximized
    if (windowState.isMaximized) return;

    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && !windowState.isMaximized) {
      e.preventDefault();
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      
      // Boundary checks (keep at least 50px of title bar visible)
      const maxX = window.innerWidth - 50;
      const maxY = window.innerHeight - 50;
      
      const boundedX = Math.max(-windowState.width + 50, Math.min(newX, maxX));
      const boundedY = Math.max(32, Math.min(newY, maxY)); // Respect top bar (32px)
      
      onMove(windowState.id, boundedX, boundedY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore errors if element removed
      }
    }
  };

  // --- RESIZE HANDLERS ---
  const handleResizeStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFocus(windowState.id);
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: windowState.width,
      h: windowState.height
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e: React.PointerEvent) => {
    if (isResizing) {
      e.preventDefault();
      const deltaX = e.clientX - resizeStart.current.x;
      const deltaY = e.clientY - resizeStart.current.y;
      
      const newW = Math.max(320, resizeStart.current.w + deltaX); // Min width
      const newH = Math.max(200, resizeStart.current.h + deltaY); // Min height
      
      onResize(windowState.id, newW, newH);
    }
  };

  const handleResizeEnd = (e: React.PointerEvent) => {
    setIsResizing(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {
       // Ignore
    }
  };

  if (windowState.isMinimized) return null;

  // Render logic: dynamic style based on state
  // FIX: When maximized, set 'top' to 32px to avoid overlapping the System Top Bar
  const style: React.CSSProperties = windowState.isMaximized
    ? { 
        top: '32px', // Height of the top bar
        left: 0, 
        width: '100%', 
        height: 'calc(100% - 32px - 80px)', // Leave space for Top Bar and Dock 
        transform: 'none', 
        borderRadius: 0 
      } 
    : { 
        top: windowState.y, 
        left: windowState.x, 
        width: windowState.width, 
        height: windowState.height 
      };

  return (
    <div
      className={`absolute flex flex-col overflow-hidden transition-all duration-200
        ${windowState.isMaximized ? 'rounded-none border-0' : 'rounded-xl border'}
        ${isActive ? 'shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 border-white/20' : 'shadow-xl z-0 border-white/10'}
        glass-panel
      `}
      style={{
        ...style,
        zIndex: windowState.zIndex,
      }}
      onPointerDown={() => onFocus(windowState.id)}
    >
      {/* Title Bar */}
      <div 
        className={`
          h-12 flex items-center justify-between px-4 select-none flex-shrink-0 touch-none cursor-default
          ${isActive ? 'bg-white/20 dark:bg-black/20' : 'bg-transparent'}
          border-b border-white/10 backdrop-blur-md
        `}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center gap-4 w-full">
          {/* Traffic Lights - Mac Style - LARGER AND VISIBLE ICONS */}
          <div className="flex gap-3 window-controls flex-shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }} 
              className="w-4 h-4 rounded-full bg-[#FF5F57] border border-[#E0443E] flex items-center justify-center hover:brightness-90 active:scale-95 transition-transform shadow-sm"
              title="Cerrar"
            >
              <X size={10} className="text-black/70" strokeWidth={3} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }} 
              className="w-4 h-4 rounded-full bg-[#FEBC2E] border border-[#D89E24] flex items-center justify-center hover:brightness-90 active:scale-95 transition-transform shadow-sm"
              title="Minimizar"
            >
              <Minus size={10} className="text-black/70" strokeWidth={3} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMaximize(windowState.id); }} 
              className="w-4 h-4 rounded-full bg-[#28C840] border border-[#1AAB29] flex items-center justify-center hover:brightness-90 active:scale-95 transition-transform shadow-sm"
              title={windowState.isMaximized ? "Restaurar" : "Maximizar"}
            >
               {windowState.isMaximized ? 
                 <Square size={8} className="text-black/70" strokeWidth={3} fill="currentColor"/> : 
                 <Maximize2 size={10} className="text-black/70" strokeWidth={3}/>
               }
            </button>
          </div>

          {/* Title */}
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 font-sans tracking-wide truncate flex-1 text-center pr-16 drop-shadow-sm">
            {windowState.title}
          </span>
        </div>
      </div>

      {/* App Content */}
      <div className="flex-1 relative overflow-hidden bg-white/95 dark:bg-[#121212]/95 backdrop-blur-3xl">
        {children}
        
        {/* Click Blocker for background windows (optional, but helps focus logic) */}
        {!isActive && <div className="absolute inset-0 bg-transparent z-10" />}
      </div>

      {/* Resize Handle (Bottom Right) */}
      {!windowState.isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-12 h-12 cursor-se-resize z-50 flex items-end justify-end p-2 touch-none"
          onPointerDown={handleResizeStart}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeEnd}
        >
           {/* Decorative grip lines */}
           <svg width="16" height="16" viewBox="0 0 12 12" fill="none" className="opacity-70 text-gray-600 dark:text-gray-400">
             <path d="M11 1L11 11L1 11" stroke="currentColor" strokeWidth="2.5"/>
             <path d="M8 4L8 8L4 8" stroke="currentColor" strokeWidth="2.5"/>
           </svg>
        </div>
      )}
    </div>
  );
};
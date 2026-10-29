import React from 'react';

/**
 * BackgroundPastel reproduces the soft pastel organic background
 * from the reference screenshot:
 * - Gentle warm beige / peach organic blob on top-left and center
 * - Lavender / lilac organic shape wrapping the top-right / right
 * - Soft powder blue and muted grey-slate shapes at bottom-left and edges
 * - Low-contrast, gentle blur, smooth transitions
 */
export const BackgroundPastel: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#E7E9ED] dark:bg-[#0D111A] transition-colors duration-500">
      {/* Top-Left Peach/Warm Beige blob */}
      <div 
        className="absolute -top-[12%] -left-[8%] w-[55vw] h-[55vw] max-w-[850px] max-h-[850px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 dark:opacity-20 blur-[90px] transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, #F5DFC9 0%, #EBD4BD 50%, #E0C7B0 100%)',
        }}
      />

      {/* Top-Right Soft Lilac / Lavender blob */}
      <div 
        className="absolute -top-[15%] -right-[10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-75 dark:opacity-25 blur-[100px] transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, #DFDBED 0%, #D1CCEA 45%, #C2BCDF 100%)',
        }}
      />

      {/* Center Warm Apricot / Amber glow (subtle, as seen in the lighting card backdrop) */}
      <div 
        className="absolute top-[35%] left-[25%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] rounded-full mix-blend-soft-light opacity-50 dark:opacity-15 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #FBE6D2 0%, #F5CEB0 60%, transparent 100%)',
        }}
      />

      {/* Bottom-Left Powder Blue / Cool Grey shape */}
      <div 
        className="absolute -bottom-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 dark:opacity-25 blur-[95px] transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, #D3DEED 0%, #C4D3E6 50%, #B2C4DD 100%)',
        }}
      />

      {/* Bottom-Right Soft Sage / Lavender blend */}
      <div 
        className="absolute -bottom-[10%] -right-[5%] w-[50vw] h-[50vw] max-w-[750px] max-h-[750px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-65 dark:opacity-20 blur-[100px] transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, #E1E8DE 0%, #D8D2EB 50%, #CAC5E3 100%)',
        }}
      />

      {/* Subtle organic wavy overlay lines / SVG contours inspired by the background illustration */}
      <svg className="absolute inset-0 w-full h-full opacity-25 dark:opacity-10" preserveAspectRatio="none" viewBox="0 0 1440 900">
        <path
          d="M-100,200 C300,100 500,450 900,300 C1200,180 1400,320 1600,250 L1600,-100 L-100,-100 Z"
          fill="rgba(247, 230, 215, 0.45)"
        />
        <path
          d="M-50,600 C250,750 600,500 1000,680 C1300,800 1500,650 1600,700 L1600,1000 L-50,1000 Z"
          fill="rgba(215, 225, 240, 0.4)"
        />
        <path
          d="M700,-50 C950,200 1150,100 1350,350 C1450,480 1550,400 1650,450 L1650,-50 Z"
          fill="rgba(224, 219, 240, 0.35)"
        />
      </svg>
    </div>
  );
};

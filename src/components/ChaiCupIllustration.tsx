import React from 'react';

/**
 * Authentic inline SVG illustration of a traditional Kulhad Chai cup
 * with steam curls and green tea leaves.
 * Uses theme CSS variables:
 * - Cup in lemon
 * - Leaves in leaf
 * - Steam in leaf-tint
 * - Accents in on-lemon
 * Zero hex codes used.
 */
export const ChaiCupIllustration: React.FC<{ className?: string }> = ({ className = 'w-64 h-64 sm:w-80 sm:h-80' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Decorative soft leaf background blob */}
      <div 
        className="absolute inset-2 rounded-full bg-leaf-soft border-2 border-leaf-tint pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div 
        className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-leaf-soft opacity-70 pointer-events-none -z-10"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
        role="img"
        aria-label="Illustration of hot kulhad chai with tea leaves and steam"
      >
        {/* Steam wisps in leaf-tint with on-lemon accent */}
        <g strokeWidth="4" strokeLinecap="round">
          {/* Steam curl 1 */}
          <path
            d="M95 70 C 85 55, 105 40, 95 25"
            stroke="var(--color-leaf)"
            strokeDasharray="6 3"
            opacity="0.85"
          />
          {/* Steam curl 2 */}
          <path
            d="M120 65 C 135 50, 110 35, 122 18"
            stroke="var(--color-leaf-ink)"
            opacity="0.9"
          />
          {/* Steam curl 3 */}
          <path
            d="M145 70 C 155 55, 138 42, 150 25"
            stroke="var(--color-leaf)"
            strokeDasharray="6 3"
            opacity="0.85"
          />
        </g>

        {/* Kulhad Base Shadow */}
        <ellipse
          cx="120"
          cy="208"
          rx="52"
          ry="9"
          fill="var(--color-leaf-tint)"
        />

        {/* Traditional Terracotta Kulhad Body in lemon */}
        <path
          d="M72 100 L84 195 C85 201, 92 205, 100 205 L140 205 C148 205, 155 201, 156 195 L168 100 Z"
          fill="var(--color-lemon)"
          stroke="var(--color-on-lemon)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Kulhad Rim Lip */}
        <ellipse
          cx="120"
          cy="100"
          rx="48"
          ry="11"
          fill="var(--color-lemon)"
          stroke="var(--color-on-lemon)"
          strokeWidth="3.5"
        />

        {/* Piping Hot Chai Liquid Level */}
        <ellipse
          cx="120"
          cy="100"
          rx="42"
          ry="8"
          fill="var(--color-on-lemon)"
          opacity="0.18"
        />

        {/* Clay Kulhad Decorative Grooves */}
        <path
          d="M80 125 Q 120 134 160 125"
          stroke="var(--color-on-lemon)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M83 148 Q 120 157 157 148"
          stroke="var(--color-on-lemon)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M86 172 Q 120 180 154 172"
          stroke="var(--color-on-lemon)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Fresh Tea Leaves at the cart base */}
        {/* Leaf Left */}
        <g transform="translate(48, 178) rotate(-22)">
          <path
            d="M0 20 C 10 5, 25 5, 30 0 C 25 15, 15 25, 0 20 Z"
            fill="var(--color-leaf)"
            stroke="var(--color-leaf-ink)"
            strokeWidth="2"
          />
          <path
            d="M0 20 Q 15 12 30 0"
            stroke="var(--color-leaf-ink)"
            strokeWidth="1.5"
          />
        </g>

        {/* Leaf Right */}
        <g transform="translate(162, 174) rotate(18)">
          <path
            d="M0 0 C 15 2, 28 14, 32 28 C 18 24, 6 15, 0 0 Z"
            fill="var(--color-leaf)"
            stroke="var(--color-leaf-ink)"
            strokeWidth="2"
          />
          <path
            d="M0 0 Q 16 14 32 28"
            stroke="var(--color-leaf-ink)"
            strokeWidth="1.5"
          />
        </g>

        {/* Small cardamom pod & tea leaf accent */}
        <g transform="translate(148, 196) rotate(-10)">
          <path
            d="M0 8 C 3 2, 9 2, 12 8 C 9 14, 3 14, 0 8 Z"
            fill="var(--color-leaf-tint)"
            stroke="var(--color-leaf-ink)"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
};

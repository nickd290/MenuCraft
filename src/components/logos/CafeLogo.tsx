export const CafeLogo = () => {
  return (
    <svg width="140" height="70" viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Coffee cup */}
      <g transform="translate(20, 15)">
        {/* Cup body */}
        <path
          d="M 15 10 L 12 28 Q 12 32, 16 32 L 24 32 Q 28 32, 28 28 L 25 10 Z"
          fill="#6f4e37"
          stroke="#3c2f2f"
          strokeWidth="1"
        />
        {/* Handle */}
        <path
          d="M 28 15 Q 33 15, 33 20 Q 33 25, 28 25"
          fill="none"
          stroke="#3c2f2f"
          strokeWidth="1.5"
        />
        {/* Steam */}
        <path d="M 17 8 Q 16 4, 17 0" stroke="#dda15e" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M 20 8 Q 21 4, 20 0" stroke="#dda15e" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M 23 8 Q 24 4, 23 0" stroke="#dda15e" strokeWidth="1.5" fill="none" opacity="0.6" />
        {/* Saucer */}
        <ellipse cx="20" cy="33" rx="12" ry="2" fill="#8b6f47" />
      </g>

      {/* Text: DAILY GRIND */}
      <text
        x="70"
        y="35"
        fontFamily="Georgia, serif"
        fontSize="18"
        fontWeight="600"
        fill="#6f4e37"
        textAnchor="middle"
        letterSpacing="1"
      >
        DAILY GRIND
      </text>

      {/* Text: CAFE */}
      <text
        x="70"
        y="50"
        fontFamily="Georgia, serif"
        fontSize="14"
        fill="#8b6f47"
        textAnchor="middle"
        letterSpacing="3"
      >
        CAFE
      </text>
    </svg>
  )
}
export const BreakfastLogo = () => {
  return (
    <svg width="140" height="70" viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sun icon */}
      <g transform="translate(25, 25)">
        <circle cx="10" cy="10" r="8" fill="#ffd60a" />
        {/* Sun rays */}
        <line x1="10" y1="0" x2="10" y2="3" stroke="#ff9500" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="17" x2="10" y2="20" stroke="#ff9500" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="10" x2="3" y2="10" stroke="#ff9500" strokeWidth="2" strokeLinecap="round" />
        <line x1="17" y1="10" x2="20" y2="10" stroke="#ff9500" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="3" x2="5" y2="5" stroke="#ff9500" strokeWidth="2" strokeLinecap="round" />
        <line x1="15" y1="15" x2="17" y2="17" stroke="#ff9500" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="17" x2="5" y2="15" stroke="#ff9500" strokeWidth="2" strokeLinecap="round" />
        <line x1="15" y1="5" x2="17" y2="3" stroke="#ff9500" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Text: SUNRISE */}
      <text
        x="70"
        y="35"
        fontFamily="Arial Black, sans-serif"
        fontSize="20"
        fontWeight="black"
        fill="#ff9500"
        textAnchor="middle"
        letterSpacing="2"
      >
        SUNRISE
      </text>

      {/* Text: DINER */}
      <text
        x="70"
        y="50"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="#2b2d42"
        textAnchor="middle"
        letterSpacing="4"
      >
        DINER
      </text>

      {/* Coffee cup icon */}
      <g transform="translate(105, 25)">
        <rect x="5" y="8" width="8" height="10" rx="1" fill="#e63946" stroke="#2b2d42" strokeWidth="0.8" />
        <path d="M 13 11 Q 15 11, 15 13 Q 15 15, 13 15" fill="none" stroke="#2b2d42" strokeWidth="0.8" />
        <path d="M 7 6 Q 7 4, 8 4" stroke="#2b2d42" strokeWidth="0.8" fill="none" />
        <path d="M 11 6 Q 11 4, 10 4" stroke="#2b2d42" strokeWidth="0.8" fill="none" />
      </g>
    </svg>
  )
}
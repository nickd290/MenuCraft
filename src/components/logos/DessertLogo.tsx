export const DessertLogo = () => {
  return (
    <svg width="140" height="70" viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cupcake */}
      <g transform="translate(20, 15)">
        {/* Frosting/top */}
        <path
          d="M 10 12 Q 8 8, 10 6 Q 12 8, 14 6 Q 16 8, 18 6 Q 20 8, 20 12 Z"
          fill="#d4a5a5"
          stroke="#9b59b6"
          strokeWidth="0.8"
        />
        {/* Wrapper */}
        <path
          d="M 10 12 L 8 22 Q 8 24, 10 24 L 20 24 Q 22 24, 22 22 L 20 12 Z"
          fill="#fff5f7"
          stroke="#9b59b6"
          strokeWidth="0.8"
        />
        {/* Wrapper lines */}
        <line x1="12" y1="14" x2="10" y2="22" stroke="#d4a5a5" strokeWidth="0.5" />
        <line x1="15" y1="13" x2="15" y2="23" stroke="#d4a5a5" strokeWidth="0.5" />
        <line x1="18" y1="14" x2="20" y2="22" stroke="#d4a5a5" strokeWidth="0.5" />
        {/* Cherry */}
        <circle cx="15" cy="5" r="1.5" fill="#9b59b6" />
        <path d="M 15 5 Q 16 6, 15 8" stroke="#9b59b6" strokeWidth="0.5" fill="none" />
      </g>

      {/* Text: Sweet Endings */}
      <text
        x="70"
        y="38"
        fontFamily="Brush Script MT, cursive"
        fontSize="24"
        fill="#9b59b6"
        textAnchor="middle"
        fontStyle="italic"
      >
        Sweet Endings
      </text>

      {/* Whisk icon */}
      <g transform="translate(105, 18)">
        {/* Handle */}
        <rect x="8" y="0" width="1.5" height="18" fill="#d4a5a5" />
        {/* Whisk wires */}
        <path d="M 5 18 Q 5 24, 8.5 25" stroke="#d4a5a5" strokeWidth="0.8" fill="none" />
        <path d="M 7 18 Q 7 26, 8.5 27" stroke="#d4a5a5" strokeWidth="0.8" fill="none" />
        <path d="M 11 18 Q 11 26, 9.5 27" stroke="#d4a5a5" strokeWidth="0.8" fill="none" />
        <path d="M 13 18 Q 13 24, 9.5 25" stroke="#d4a5a5" strokeWidth="0.8" fill="none" />
      </g>

      {/* Decorative sparkles */}
      <text x="50" y="50" fontSize="10" fill="#9b59b6" opacity="0.5">✦</text>
      <text x="88" y="48" fontSize="8" fill="#d4a5a5" opacity="0.5">✦</text>
    </svg>
  )
}
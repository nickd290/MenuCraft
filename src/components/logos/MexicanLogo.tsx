export const MexicanLogo = () => {
  return (
    <svg width="140" height="70" viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chili pepper left */}
      <g transform="translate(15, 15)">
        <path
          d="M 8 5 Q 6 8, 7 12 L 9 25 Q 10 28, 12 28 Q 14 28, 15 25 L 13 12 Q 14 8, 12 5"
          fill="#ff6347"
          stroke="#d2691e"
          strokeWidth="1"
        />
        <path d="M 10 3 Q 8 4, 10 6 Q 12 4, 10 3" fill="#32cd32" />
      </g>

      {/* Text: LA CANTINA */}
      <text
        x="70"
        y="45"
        fontFamily="Impact, Arial Black, sans-serif"
        fontSize="24"
        fontWeight="black"
        fill="#d2691e"
        textAnchor="middle"
        letterSpacing="2"
      >
        LA CANTINA
      </text>

      {/* Chili pepper right */}
      <g transform="translate(115, 15)">
        <path
          d="M 8 5 Q 6 8, 7 12 L 9 25 Q 10 28, 12 28 Q 14 28, 15 25 L 13 12 Q 14 8, 12 5"
          fill="#ff6347"
          stroke="#d2691e"
          strokeWidth="1"
        />
        <path d="M 10 3 Q 8 4, 10 6 Q 12 4, 10 3" fill="#32cd32" />
      </g>

      {/* Decorative pattern */}
      <rect x="55" y="52" width="6" height="6" fill="#ff6347" transform="rotate(45 58 55)" />
      <rect x="76" y="52" width="6" height="6" fill="#32cd32" transform="rotate(45 79 55)" />
    </svg>
  )
}
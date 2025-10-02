export const SteakhouseLogo = () => {
  return (
    <svg width="140" height="70" viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Knife */}
      <g transform="translate(25, 20)">
        <rect x="8" y="0" width="2" height="25" fill="#d4af37" />
        <path d="M 7 25 L 9 35 L 11 25 Z" fill="#f5f5f5" />
      </g>

      {/* Fork */}
      <g transform="translate(105, 20)">
        <rect x="8" y="10" width="2" height="25" fill="#d4af37" />
        <line x1="5" y1="0" x2="5" y2="12" stroke="#f5f5f5" strokeWidth="1.5" />
        <line x1="9" y1="0" x2="9" y2="12" stroke="#f5f5f5" strokeWidth="1.5" />
        <line x1="13" y1="0" x2="13" y2="12" stroke="#f5f5f5" strokeWidth="1.5" />
      </g>

      {/* Text: PRIME 28 */}
      <text
        x="70"
        y="42"
        fontFamily="Georgia, serif"
        fontSize="24"
        fontWeight="bold"
        fill="#f5f5f5"
        textAnchor="middle"
        letterSpacing="3"
      >
        PRIME 28
      </text>

      {/* Decorative line */}
      <line x1="50" y1="50" x2="90" y2="50" stroke="#8b0000" strokeWidth="2" />
    </svg>
  )
}
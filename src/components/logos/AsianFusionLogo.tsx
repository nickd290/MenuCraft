export const AsianFusionLogo = () => {
  return (
    <svg width="130" height="60" viewBox="0 0 130 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chopsticks */}
      <g transform="translate(20, 15)">
        <rect x="0" y="0" width="1.5" height="30" fill="#1c1c1c" transform="rotate(-15 0 0)" />
        <rect x="6" y="0" width="1.5" height="30" fill="#1c1c1c" transform="rotate(15 6 0)" />
      </g>

      {/* Text: ZEN KITCHEN */}
      <text
        x="65"
        y="35"
        fontFamily="Arial, sans-serif"
        fontSize="18"
        fontWeight="300"
        fill="#1c1c1c"
        textAnchor="middle"
        letterSpacing="6"
      >
        ZEN KITCHEN
      </text>

      {/* Red accent square */}
      <rect x="45" y="42" width="40" height="2" fill="#c41e3a" />

      {/* Bamboo element */}
      <g transform="translate(100, 15)">
        <rect x="0" y="0" width="3" height="12" fill="#1c1c1c" opacity="0.1" />
        <line x1="0" y1="4" x2="3" y2="4" stroke="#1c1c1c" strokeWidth="0.5" />
        <line x1="0" y1="8" x2="3" y2="8" stroke="#1c1c1c" strokeWidth="0.5" />
        <rect x="5" y="5" width="3" height="12" fill="#1c1c1c" opacity="0.1" />
        <line x1="5" y1="9" x2="8" y2="9" stroke="#1c1c1c" strokeWidth="0.5" />
        <line x1="5" y1="13" x2="8" y2="13" stroke="#1c1c1c" strokeWidth="0.5" />
      </g>
    </svg>
  )
}
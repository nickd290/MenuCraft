export const BistroLogo = () => {
  return (
    <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Eiffel Tower icon */}
      <g transform="translate(15, 10)">
        <path
          d="M 10 35 L 5 15 L 8 15 L 10 5 L 12 15 L 15 15 L 10 35 Z"
          fill="#c85a3f"
          stroke="#3d2817"
          strokeWidth="0.5"
        />
        <line x1="6" y1="22" x2="14" y2="22" stroke="#3d2817" strokeWidth="0.5" />
        <line x1="7" y1="28" x2="13" y2="28" stroke="#3d2817" strokeWidth="0.5" />
      </g>

      {/* Text: LE BISTRO */}
      <text
        x="35"
        y="35"
        fontFamily="Georgia, serif"
        fontSize="18"
        fontWeight="bold"
        fill="#3d2817"
        letterSpacing="2"
      >
        LE BISTRO
      </text>

      {/* Decorative underline */}
      <line x1="35" y1="40" x2="110" y2="40" stroke="#c85a3f" strokeWidth="1" />
    </svg>
  )
}
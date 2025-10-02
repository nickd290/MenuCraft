export const ItalianLogo = () => {
  return (
    <svg width="140" height="65" viewBox="0 0 140 65" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Olive branch left */}
      <g transform="translate(10, 25)">
        <path
          d="M 0 15 Q 5 10, 10 5 Q 8 8, 10 10 Q 12 8, 15 5 Q 13 10, 18 10"
          stroke="#008c45"
          strokeWidth="1.5"
          fill="none"
        />
        <ellipse cx="8" cy="8" rx="2" ry="3" fill="#008c45" />
        <ellipse cx="14" cy="7" rx="2" ry="3" fill="#008c45" />
        <ellipse cx="18" cy="10" rx="2" ry="3" fill="#008c45" />
      </g>

      {/* Text: Bella Italia */}
      <text
        x="70"
        y="40"
        fontFamily="Brush Script MT, cursive"
        fontSize="28"
        fill="#cd212a"
        textAnchor="middle"
        fontStyle="italic"
      >
        Bella Italia
      </text>

      {/* Olive branch right */}
      <g transform="translate(112, 25) scale(-1, 1)">
        <path
          d="M 0 15 Q 5 10, 10 5 Q 8 8, 10 10 Q 12 8, 15 5 Q 13 10, 18 10"
          stroke="#008c45"
          strokeWidth="1.5"
          fill="none"
        />
        <ellipse cx="8" cy="8" rx="2" ry="3" fill="#008c45" />
        <ellipse cx="14" cy="7" rx="2" ry="3" fill="#008c45" />
        <ellipse cx="18" cy="10" rx="2" ry="3" fill="#008c45" />
      </g>

      {/* Decorative dots */}
      <circle cx="70" cy="50" r="1.5" fill="#cd212a" />
      <circle cx="65" cy="50" r="1" fill="#008c45" />
      <circle cx="75" cy="50" r="1" fill="#008c45" />
    </svg>
  )
}
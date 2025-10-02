export const FineDiningLogo = () => {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer decorative circle */}
      <circle cx="40" cy="40" r="38" stroke="#d4af37" strokeWidth="1.5" fill="none" />
      <circle cx="40" cy="40" r="35" stroke="#d4af37" strokeWidth="0.5" fill="none" />

      {/* Inner monogram circle */}
      <circle cx="40" cy="40" r="28" stroke="#d4af37" strokeWidth="1" fill="none" />

      {/* Monogram F */}
      <text
        x="30"
        y="48"
        fontFamily="Playfair Display, Georgia, serif"
        fontSize="32"
        fontWeight="bold"
        fill="#1a1a1a"
        style={{ fontStyle: 'italic' }}
      >
        F
      </text>

      {/* Monogram D */}
      <text
        x="44"
        y="48"
        fontFamily="Playfair Display, Georgia, serif"
        fontSize="32"
        fontWeight="bold"
        fill="#1a1a1a"
        style={{ fontStyle: 'italic' }}
      >
        D
      </text>

      {/* Decorative flourishes */}
      <path
        d="M 20 40 Q 25 35, 30 40"
        stroke="#d4af37"
        strokeWidth="0.5"
        fill="none"
      />
      <path
        d="M 60 40 Q 55 35, 50 40"
        stroke="#d4af37"
        strokeWidth="0.5"
        fill="none"
      />

      {/* Top ornament */}
      <circle cx="40" cy="8" r="2" fill="#d4af37" />
      <path d="M 38 10 L 40 8 L 42 10" stroke="#d4af37" strokeWidth="0.5" fill="none" />
    </svg>
  )
}
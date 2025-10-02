interface BarPubLogoProps {
  restaurantName?: string
}

export const BarPubLogo = ({ restaurantName = 'THE TAVERN' }: BarPubLogoProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Shield and Beer mug icon */}
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield background */}
        <path
          d="M 25 5 L 10 8 L 10 25 Q 10 32, 25 40 Q 40 32, 40 25 L 40 8 Z"
          fill="#ff8c42"
          stroke="#f5f5dc"
          strokeWidth="1.5"
        />

        {/* Beer mug */}
        <g transform="translate(17, 12)">
          <rect x="3" y="3" width="10" height="14" rx="1" fill="#f5f5dc" stroke="#1e3a5f" strokeWidth="1" />
          <rect x="4" y="4" width="8" height="6" fill="#ffd700" opacity="0.3" />
          <path d="M 13 8 Q 16 8, 16 11 Q 16 14, 13 14" fill="none" stroke="#1e3a5f" strokeWidth="1" />
          {/* Foam */}
          <ellipse cx="8" cy="3" rx="5" ry="2.5" fill="#f5f5dc" />
          <ellipse cx="6" cy="2" rx="2" ry="1.5" fill="#f5f5dc" />
          <ellipse cx="10" cy="2" rx="2" ry="1.5" fill="#f5f5dc" />
        </g>
      </svg>

      {/* Restaurant name */}
      <div className="text-center">
        <div
          className="text-xl font-black tracking-widest text-[#ff8c42] uppercase"
          style={{ fontFamily: 'Impact, Arial Black, sans-serif', lineHeight: '1.2' }}
        >
          {restaurantName}
        </div>
      </div>
    </div>
  )
}
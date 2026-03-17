export default function OperisLogo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="operis-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* Main "O" ring — circuit-style with gaps */}
      <path
        d="
          M60 16
          C35.7 16 16 35.7 16 60
          C16 84.3 35.7 104 60 104
          C84.3 104 104 84.3 104 60
          C104 35.7 84.3 16 60 16
          Z
        "
        stroke="url(#operis-grad)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="18 8 28 8 18 8 28 8 18 8 28 8"
      />

      {/* Inner circuit traces */}
      {/* Horizontal center line */}
      <line
        x1="38"
        y1="60"
        x2="82"
        y2="60"
        stroke="url(#operis-grad)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Vertical short line top */}
      <line
        x1="60"
        y1="34"
        x2="60"
        y2="50"
        stroke="url(#operis-grad)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Vertical short line bottom */}
      <line
        x1="60"
        y1="70"
        x2="60"
        y2="86"
        stroke="url(#operis-grad)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Diagonal trace top-left */}
      <line
        x1="42"
        y1="42"
        x2="52"
        y2="52"
        stroke="url(#operis-grad)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Diagonal trace bottom-right */}
      <line
        x1="68"
        y1="68"
        x2="78"
        y2="78"
        stroke="url(#operis-grad)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Circuit nodes (dots at junctions) */}
      <circle cx="60" cy="60" r="5" fill="url(#operis-grad)" />
      <circle cx="60" cy="34" r="4" fill="url(#operis-grad)" />
      <circle cx="60" cy="86" r="4" fill="url(#operis-grad)" />
      <circle cx="38" cy="60" r="4" fill="url(#operis-grad)" />
      <circle cx="82" cy="60" r="4" fill="url(#operis-grad)" />

      {/* Corner nodes on the ring */}
      <circle cx="28" cy="28" r="4.5" fill="url(#operis-grad)" />
      <circle cx="92" cy="28" r="4.5" fill="url(#operis-grad)" />
      <circle cx="28" cy="92" r="4.5" fill="url(#operis-grad)" />
      <circle cx="92" cy="92" r="4.5" fill="url(#operis-grad)" />
    </svg>
  );
}

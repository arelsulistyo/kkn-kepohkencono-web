export default function KepohMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`kp-mark ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="20" cy="12" r="9.5" fill="#C9A13B" />
      <g fill="currentColor">
        <circle cx="9" cy="19" r="5" />
        <circle cx="15.5" cy="15" r="6" />
        <circle cx="24.5" cy="15" r="6" />
        <circle cx="31" cy="19" r="5" />
        <rect x="4" y="17" width="32" height="6.5" rx="3.25" />
        <path d="M18.3 22.5 17.9 29.6c-.2 1.8-1.5 3-3.9 3.9h12c-2.4-.9-3.7-2.1-3.9-3.9l-.4-7.1Z" />
      </g>
      <path
        d="M3 34.6c5.7-1.8 11.3-1.8 17-.4s11.3 1.4 17-.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 38.2c3.7-1 7.3-1 11 0s7.3 1 11 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity=".55"
      />
    </svg>
  );
}

export default function Larry({ size = 100 }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 140 154" fill="none">
      <ellipse cx="70" cy="28" rx="50" ry="8" fill="#5D8A3C" />
      <rect x="40" y="5" width="60" height="25" rx="8" fill="#6AAA48" />
      <rect x="38" y="22" width="64" height="8" fill="#4A7A30" rx="2" />
      <ellipse cx="70" cy="99" rx="52" ry="56" fill="#C4963A" />
      <ellipse cx="70" cy="97" rx="48" ry="52" fill="#D4A645" />
      <circle cx="50" cy="84" r="4" fill="#BA8A30" opacity="0.6" />
      <circle cx="90" cy="74" r="3" fill="#BA8A30" opacity="0.6" />
      <circle cx="60" cy="114" r="5" fill="#BA8A30" opacity="0.6" />
      <circle cx="85" cy="109" r="3" fill="#BA8A30" opacity="0.6" />
      <circle cx="57" cy="87" r="13" fill="white" />
      <circle cx="83" cy="87" r="13" fill="white" />
      <circle cx="59" cy="88" r="7" fill="#1E2D40" />
      <circle cx="85" cy="88" r="7" fill="#1E2D40" />
      <circle cx="61" cy="85" r="2.5" fill="white" />
      <circle cx="87" cy="85" r="2.5" fill="white" />
      <path d="M 52 107 Q 70 121 88 107" stroke="#8A5A10" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <ellipse cx="22" cy="107" rx="16" ry="10" fill="#C4963A" transform="rotate(-20 22 107)" />
      <ellipse cx="118" cy="107" rx="16" ry="10" fill="#C4963A" transform="rotate(20 118 107)" />
      <circle cx="115" cy="97" r="10" fill="#D4A645" />
    </svg>
  );
}

export default function Richard({ size = 160 }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 200 230" fill="none">
      <ellipse cx="100" cy="165" rx="78" ry="68" fill="#F4A0A0" />
      <ellipse cx="100" cy="180" rx="66" ry="52" fill="#F5F0E8" />
      <rect x="88" y="160" width="10" height="52" fill="#444" rx="3" />
      <ellipse cx="100" cy="93" rx="62" ry="68" fill="#F4A0A0" />
      <ellipse cx="40" cy="88" rx="15" ry="20" fill="#F4A0A0" />
      <ellipse cx="160" cy="88" rx="15" ry="20" fill="#F4A0A0" />
      <circle cx="78" cy="80" r="15" fill="white" />
      <circle cx="122" cy="80" r="15" fill="white" />
      <circle cx="80" cy="81" r="9" fill="#1E2D40" />
      <circle cx="124" cy="81" r="9" fill="#1E2D40" />
      <circle cx="83" cy="78" r="3.5" fill="white" />
      <circle cx="127" cy="78" r="3.5" fill="white" />
      <ellipse cx="100" cy="102" rx="13" ry="9" fill="#E88A8A" />
      <circle cx="95" cy="102" r="3.5" fill="#C07070" />
      <circle cx="105" cy="102" r="3.5" fill="#C07070" />
      <path d="M 80 120 Q 100 134 120 120" stroke="#C07070" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 52 50 Q 64 30 100 26 Q 136 30 148 50" stroke="#333" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="200" rx="32" ry="16" fill="#F4A0A0" />
      <ellipse cx="162" cy="200" rx="32" ry="16" fill="#F4A0A0" />
    </svg>
  );
}

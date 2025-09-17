export default function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit={10}
      color="currentColor"
      className={className}
    >
      <defs>
        <style>{`.cls-63ce7424ea57ea6c8380057f-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}`}</style>
      </defs>
      <line
        x1="2.5"
        y1={12}
        x2="23.5"
        y2={12}
        className="cls-63ce7424ea57ea6c8380057f-1"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        stroke="currentColor"
      />
      <polyline
        points="10.14 4.36 2.5 12 10.14 19.64"
        className="cls-63ce7424ea57ea6c8380057f-1"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        stroke="currentColor"
      />
    </svg>
  );
}

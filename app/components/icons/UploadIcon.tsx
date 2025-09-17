export const UploadIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <line
        x1={12}
        y1="2.5"
        x2={12}
        y2="19.64"
        className="stroke-current"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <polyline
        points="19.62 10.12 12 2.5 4.38 10.12"
        className="fill-none stroke-current"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <polyline
        points="19.62 18.69 19.62 22.5 4.38 22.5 4.38 18.69"
        className="fill-none stroke-current"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

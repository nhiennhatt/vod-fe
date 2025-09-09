import React from "react";

interface CircularProgressProps {
  size?: number;
  thickness?: number;
  color?: string;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 48,
  thickness = 4,
  color = "#3B82F6", // blue-500
  className = "",
}) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * 0.25; // 25% để tạo hiệu ứng loading

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="animate-spin"
        style={{ animationDuration: "1s" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB" // gray-200
          strokeWidth={thickness}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            transformOrigin: "center",
            transform: "rotate(-90deg)",
          }}
        />
      </svg>
    </div>
  );
};

export const SmallCircularProgress: React.FC<Omit<CircularProgressProps, "size">> = (props) => (
  <CircularProgress size={24} {...props} />
);

export const MediumCircularProgress: React.FC<Omit<CircularProgressProps, "size">> = (props) => (
  <CircularProgress size={48} {...props} />
);

export const LargeCircularProgress: React.FC<Omit<CircularProgressProps, "size">> = (props) => (
  <CircularProgress size={64} {...props} />
);

export const LoadingSpinner: React.FC<{
  text?: string;
  size?: number;
  color?: string;
  className?: string;
}> = ({ text = "Đang tải...", size = 48, color = "#3B82F6", className = "" }) => (
  <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
    <CircularProgress size={size} color={color} />
    {text && (
      <p className="text-sm text-gray-600 font-medium">{text}</p>
    )}
  </div>
);

export const FullScreenLoading: React.FC<{
  text?: string;
  color?: string;
}> = ({ text = "Đang tải...", color = "#3B82F6" }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner text={text} size={64} color={color} />
  </div>
);

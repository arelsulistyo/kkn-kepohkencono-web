import React from "react";

interface StepItemProps {
  stepNumber: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  badgeColor: string;
  showArrow?: boolean;
}

const StepItem: React.FC<StepItemProps> = ({
  stepNumber,
  title,
  description,
  icon,
  gradientFrom,
  gradientTo,
  badgeColor,
  showArrow = false,
}) => {
  return (
    <div className="relative">
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
          {icon}
        </div>
        <div className={`${badgeColor} text-xs font-semibold px-3 py-1 rounded-full mb-3`}>
          Langkah {stepNumber}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
      {/* Arrow for desktop */}
      {showArrow && (
        <div className="hidden md:block absolute top-8 -right-3 text-gray-300">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default StepItem;
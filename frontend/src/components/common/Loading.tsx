import React from "react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : "min-h-[200px]"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        {/* Message */}
        {message && (
          <p className="text-sm font-medium text-gray-500">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loading;
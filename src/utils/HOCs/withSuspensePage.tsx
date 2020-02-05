import React from "react"

const loadingLayoutStyle = {
  width: "100%",
  height: "100%",
  display: "flex"
};

export const LoadingLayout: React.FC = () => {
  return (
    <div style={loadingLayoutStyle}>
      LOADING ...
    </div>
  );
};

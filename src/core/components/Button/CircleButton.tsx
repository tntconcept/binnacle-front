import React from "react"
import "./circlebutton.css"

interface ICircleButton {
  isLoading?: boolean;
  onClick?: () => void;
}

const CircleButton: React.FC<ICircleButton> = props => {
  return (
    <button
      className="circle-container"
      onClick={props.onClick}>
      {props.children}
      {props.isLoading && (
        <svg
          className="spinner"
          viewBox="0 0 50 50">
          <circle
            className="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="2"
          />
        </svg>
      )}
    </button>
  );
};

export default CircleButton;

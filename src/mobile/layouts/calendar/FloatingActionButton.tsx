import React from "react"
import {Link} from "react-router-dom"
import {css} from "linaria"

const button = css`
  width: 50px;
  height: 50px;
  background-color: #10069f;
  display: flex;
  border-radius: 50%;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  font-size: 30px;
  justify-content: center;
  color: white;
  box-shadow: 2px 6px 6px 0 rgba(16, 6, 159, 0.15);
  position: fixed;
  right: 16px;
  bottom: 20px;
`;

const FloatingActionButton = () => {
  return (
    <Link to="/activity" className={button}>
      +
    </Link>
  );
};

export default FloatingActionButton;

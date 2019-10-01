import React from "react";

// https://codepen.io/aaroniker/pen/MWgjERQ?page=3

const Select = () => {
  return (
    <div>
      <select className="select">
        <option>Easy</option>
        <option selected>Normal</option>
        <option>Hard</option>
        <option>Expert</option>
      </select>
    </div>
  );
};

export default Select;

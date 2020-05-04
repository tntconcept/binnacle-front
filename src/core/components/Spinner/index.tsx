import React from "react"
import "core/components/Spinner/spinner.css"
import {cls} from "utils/helpers"
import useDelayLoading from "core/hooks/useDelayLoading"

const Spinner: React.FC<any> = ({className, ...props}) => {
  const showLoading = useDelayLoading(300);

  return showLoading ? (
    <div
      className={cls("spinner", className)}
      data-testid="spinner"
      {...props}
    />
  ) : null;
};

export default Spinner;

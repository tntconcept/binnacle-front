import React from "react"
import "core/components/Spinner/spinner.css"
import useDelayLoading from "core/hooks/useDelayLoading"
import {cls} from "utils/helpers"

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

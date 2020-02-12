import React from 'react'
import 'core/components/Spinner/spinner.css'
import useDelayLoading from "core/hooks/useDelayLoading"

const Spinner: React.FC<any> = props => {
  const showLoading = useDelayLoading(300);

  return showLoading ? <div className="spinner" data-testid="spinner" {...props} /> : null;
};

export default Spinner
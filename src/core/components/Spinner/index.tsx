import React from 'react'
import 'core/components/Spinner/spinner.css'

const Spinner: React.FC<any> = props => {
  return <div className="spinner" data-testid="spinner" {...props} />;
};

export default Spinner
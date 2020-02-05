import React from "react"
import {Link} from "react-router-dom"
import styles from './FloatingActionButton.module.css'

const FloatingActionButton = () => {
  return (
    <Link to="/activity" className={styles.button}>
      +
    </Link>
  );
};

export default FloatingActionButton;

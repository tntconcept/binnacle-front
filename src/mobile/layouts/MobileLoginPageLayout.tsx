import React from "react"
import LogoAutentia from "assets/icons/logo.svg"
import {LoginForm, LoginFormProps} from "core/forms/LoginForm"
import styles from './MobileLoginPageLayout.module.css'

const MobileLoginPageLayout: React.FC = props => {
  return (
    <div className={styles.container}>
      <img
        className={styles.logo}
        src={LogoAutentia}
        alt="Logo of Autentia" />
      {props.children}
      <p className={styles.version}>v{process.env.REACT_APP_VERSION}</p>
    </div>
  );
};

export default MobileLoginPageLayout;

export const MobileLoginFormLayout: React.FC<LoginFormProps> = props => {
  return (
    <div className={styles.form}>
      <LoginForm
        formikValues={props.formikValues}
        usernameRef={props.usernameRef}
      />
    </div>
  );
};

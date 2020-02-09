import React from "react"
import {LoginForm, LoginFormProps} from "core/forms/LoginForm"
import LogoAutentia from "assets/icons/logo.svg"
import {useTranslation} from "react-i18next"
import styles from "./DesktopLoginPageLayout.module.css"

const DesktopLoginPageLayout: React.FC = props => {
  return (
    <div
      className={styles.pageWrapper}
      /*      style={{
        backgroundImage: `url(${BackgroundPattern})`
      }}*/
    >
      {props.children}
      <p className={styles.version}>v{process.env.REACT_APP_VERSION}</p>
    </div>
  );
};

export default DesktopLoginPageLayout;

export const DesktopLoginFormLayout: React.FC<LoginFormProps> = props => {
  const { t } = useTranslation();

  return (
    <div className={styles.formContainer}>
      <img className={styles.logo} src={LogoAutentia} alt="Logo of Autentia" />
      <LoginForm
        formikValues={props.formikValues}
        usernameRef={props.usernameRef}
      >
        <h1 className={styles.title}>{t("login_page.welcome_title")}</h1>
        <h2 className={styles.subtitle}>{t("login_page.welcome_message")}</h2>
      </LoginForm>
    </div>
  );
};

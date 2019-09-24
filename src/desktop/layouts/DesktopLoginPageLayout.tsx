import React from "react";
import { styled } from "styletron-react";
import { LoginForm, LoginFormProps } from "core/forms/LoginForm";
import LogoAutentia from "assets/icons/logo.svg";
import { useTranslation } from "react-i18next";

const PageWrapper = styled("div", {
  display: "flex",
  padding: "32px",
  backgroundColor: "var(--bg-color)",
  height: "100%"
});

const FormContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "425px",
  margin: "auto 124px",
  boxShadow: "0 6px 15px 0 rgba(0, 0, 0, 0.16)",
  borderRadius: "5px",
  backgroundColor: "white",
  padding: "40px"
});

const Logo = styled("img", {
  margin: "0 0 32px 0",
  display: "block",
  width: "200px"
});

const Title = styled("h1", {
  fontFamily: "Montserrat",
  fontSize: "28px",
  fontWeight: "bold",
  margin: 0
});

const Subtitle = styled("h2", {
  fontFamily: "Montserrat",
  fontSize: "24px",
  fontWeight: "lighter",
  margin: "0 0 32px 0"
});

const IllustrationBlock = styled("div", {
  flex: "1"
});

const Version = styled("p", {
  fontSize: "16px",
  fontWeight: "lighter",
  position: "absolute",
  bottom: "16px",
  right: "24px"
});

const DesktopLoginPageLayout: React.FC = props => {
  return (
    <PageWrapper>
      <IllustrationBlock />
      {props.children}
      <Version>v{process.env.REACT_APP_VERSION}</Version>
    </PageWrapper>
  );
};

export default DesktopLoginPageLayout;

export const DesktopLoginFormLayout: React.FC<LoginFormProps> = props => {
  const { t } = useTranslation();

  return (
    <FormContainer>
      <Logo
        src={LogoAutentia}
        alt="Logo of Autentia" />
      <LoginForm
        formikValues={props.formikValues}
        usernameRef={props.usernameRef}
      >
        <Title>{t("login_page.welcome_title")}</Title>
        <Subtitle>{t("login_page.welcome_message")}</Subtitle>
      </LoginForm>
    </FormContainer>
  );
};

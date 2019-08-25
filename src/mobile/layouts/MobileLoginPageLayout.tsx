import React from "react";
import { styled } from "styletron-react";
import Logo_Autentia from "assets/icons/Logo_Autentia.svg";
import { LoginForm, LoginFormProps } from "core/forms/LoginForm";

const PageWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  padding: "24px"
});

const FormContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  maxHeight: "500px",
  width: "100%",
  margin: "0 auto",
  borderRadius: "3px"
});

const Logo = styled("img", {
  margin: "64px 0"
});

const Version = styled("p", {
  fontSize: "16px",
  fontWeight: "lighter",
  position: "absolute",
  bottom: "16px",
  right: "24px"
});

const MobileLoginPageLayout: React.FC = props => {
  return (
    <PageWrapper>
      <Logo
        src={Logo_Autentia}
        alt="Logo of Autentia" />
      {props.children}
      <Version>v{process.env.REACT_APP_VERSION}</Version>
    </PageWrapper>
  );
};

export default MobileLoginPageLayout;

export const MobileLoginFormLayout: React.FC<LoginFormProps> = props => {
  return (
    <FormContainer>
      <LoginForm
        formikValues={props.formikValues}
        usernameRef={props.usernameRef}
      />
    </FormContainer>
  );
};

import React, { useContext, useRef } from "react";
import { AuthContext } from "core/contexts/AuthContext";
import { Redirect } from "react-router-dom";
import Media from "react-media";
import MobileLoginPageLayout, {
  MobileLoginFormLayout
} from "mobile/layouts/MobileLoginPageLayout";
import { Formik } from "formik";
import DesktopLoginPageLayout, {
  DesktopLoginFormLayout
} from "desktop/layouts/DesktopLoginPageLayout";
import { loginFormSchema } from "core/forms/LoginForm/loginFormSchema";

// https://stackoverflow.com/questions/28889826/set-focus-on-input-after-render
const useFocus = <T,>(): [React.MutableRefObject<T | null>, () => void] => {
  const htmlElRef = useRef<T>(null);
  const setFocus = () => {
    htmlElRef.current && (htmlElRef.current as any).focus();
  };

  return [htmlElRef, setFocus];
};

const initialValues = { username: "", password: "" };

const LoginPage: React.FC = () => {
  const [usernameRef, setUsernameFocus] = useFocus<HTMLInputElement>();
  const auth = useContext(AuthContext);

  return auth.isAuthenticated ? (
    <Redirect to="/binnacle" />
  ) : (
    <Formik
      initialValues={initialValues}
      validationSchema={loginFormSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        auth
          .handleLogin(values.username, values.password)
          .then(_ => setSubmitting(false))
          .catch(error => {
            console.log(JSON.stringify(values, null, 2));
            if (error.response && error.response.status === 401) {
              setUsernameFocus();
              resetForm();
            } else {
              setSubmitting(false);
            }
          });
      }}
    >
      {values => {
        return (
          <Media query="(max-width: 480px)">
            {matches => {
              return matches ? (
                <MobileLoginPageLayout>
                  <MobileLoginFormLayout
                    formikValues={values}
                    usernameRef={usernameRef}
                  />
                </MobileLoginPageLayout>
              ) : (
                <DesktopLoginPageLayout>
                  <DesktopLoginFormLayout
                    formikValues={values}
                    usernameRef={usernameRef}
                  />
                </DesktopLoginPageLayout>
              );
            }}
          </Media>
        );
      }}
    </Formik>
  );
};

export default LoginPage;

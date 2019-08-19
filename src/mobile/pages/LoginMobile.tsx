import React, { useContext } from "react";
import TextInput from "core/components/TextInput";
import FormControl from "core/components/FormControl";
import PasswordInput from "core/components/PasswordInput";
import Button from "core/components/Button";
import { Form, Formik } from "formik";
import { styled } from "styletron-react";
import { AuthContext } from "core/contexts/AuthContext";
import { LoginSchema } from "core/form-validation/schemas";
import Logo_Autentia from "assets/icons/Logo_Autentia.svg";

const PageWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  padding: "24px"
});

const FormContainer = styled(Form, {
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

const LoginMobile: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
    <PageWrapper>
      <Logo
        src={Logo_Autentia}
        alt="Logo of Autentia" />
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log(JSON.stringify(values, null, 2));
          setSubmitting(false);
          auth.handleLogin(values.username, values.password);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting
        }) => (
          <FormContainer>
            <FormControl
              label="username"
              error={
                errors.username && touched.username
                  ? errors.username
                  : undefined
              }
            >
              <TextInput
                name="username"
                id="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                hasError={!!(errors.username && touched.username)}
              />
            </FormControl>
            <FormControl
              label="password"
              error={
                errors.password && touched.password
                  ? errors.password
                  : undefined
              }
            >
              <PasswordInput
                id="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                hasError={!!(errors.password && touched.password)}
              />
            </FormControl>
            <Button type="submit">{isSubmitting ? "Loading" : "LOGIN"}</Button>
          </FormContainer>
        )}
      </Formik>
      <Version>v2.0 Beta</Version>
    </PageWrapper>
  );
};

export default LoginMobile;

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
  padding: "32px",
  backgroundColor: "var(--bg-color)",
  height: "100%"
});

const FormContainer = styled(Form, {
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
  fontSize: "28px",
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

const LoginDesktop: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
    <PageWrapper>
      <IllustrationBlock />
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
            <Logo
              src={Logo_Autentia}
              alt="Logo of Autentia" />
            <Title>Bienvenido</Title>
            <Subtitle>Entra en tu cuenta</Subtitle>
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

export default LoginDesktop;

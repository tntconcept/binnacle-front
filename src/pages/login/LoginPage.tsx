import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import TextInput from "core/components/TextInput";
import FormControl from "core/components/FormControl";
import PasswordInput from "core/components/PasswordInput";
import Button from "core/components/Button";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { NotificationsContext } from "core/contexts/NotificationsContext";
import { styled } from "styletron-react";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required")
});

const PageWrapper = styled("div", {
  display: "flex",
  flex: "1 1 auto"
});

const FormContainer = styled(Form, {
  boxSizing: "unset",
  display: "flex",
  flexDirection: "column",
  maxHeight: "500px",
  width: "400px",
  margin: "0 auto",
  borderRadius: "3px",
  "@media screen and (min-width: 705px)": {
    padding: "32px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
  }
});

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  const addNotification = useContext(NotificationsContext);

  return (
    <PageWrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            console.log(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 700);
          addNotification("Lo recibo");
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
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
              />
            </FormControl>
            <Button type="submit">{isSubmitting ? "Loading" : "Login"}</Button>
          </FormContainer>
        )}
      </Formik>
    </PageWrapper>
  );
};

export default LoginPage;

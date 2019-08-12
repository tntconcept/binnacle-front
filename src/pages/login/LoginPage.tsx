import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./login.module.css";
import TextInput from "core/components/TextInput";
import FormControl from "core/components/FormControl";
import PasswordInput from "core/components/PasswordInput";
import Button from "core/components/Button";
import { Form, Formik } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required")
});

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            console.log(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 700);
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
          <Form className={styles.container}>
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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;

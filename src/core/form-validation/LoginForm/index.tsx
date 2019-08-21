import React from "react";
import FormControl from "core/components/FormControl";
import TextInput from "core/components/TextInput";
import PasswordInput from "core/components/PasswordInput";
import Button from "core/components/Button";
import { Formik } from "formik";
import { LoginSchema } from "core/form-validation/schemas";

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = props => {
  return (
    <React.Fragment>
      {props.children}
      <FormControl
        label="username"
        error={
          errors.username && touched.username ? errors.username : undefined
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
          errors.password && touched.password ? errors.password : undefined
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
    </React.Fragment>
  );
};

const LoginFormContainer: React.FC = () => {
  return (
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
              errors.username && touched.username ? errors.username : undefined
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
              errors.password && touched.password ? errors.password : undefined
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
  );
};

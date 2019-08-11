import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./login.module.css";
import TextInput from "core/components/TextInput";
import FormControl from "core/components/FormControl";
import PasswordInput from "core/components/PasswordInput";
import Button from "core/components/Button";
import useForm from "react-hook-form";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  const { handleSubmit, register, errors } = useForm({
    mode: "onBlur"
  });

  const onSubmit = (values: any) => {
    console.log(values);
  };

  console.log("errors", errors);

  return (
    <div className={styles.wrapper}>
      <form
        className={styles.container}
        onSubmit={handleSubmit(onSubmit)}>
        <FormControl label="username">
          <TextInput
            name="username"
            ref={register({
              required: "error message"
            })}
            id="username"
          />
        </FormControl>
        <FormControl label="password">
          <PasswordInput id="password" />
        </FormControl>
        <Button>Login</Button>
      </form>
    </div>
  );
};

export default LoginPage;

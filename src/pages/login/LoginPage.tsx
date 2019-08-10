import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  const [a, setA] = useState(false);

  console.log("2");
  useEffect(() => {
    if (a) {
      setA(false);
    }
  }, [a]);

  console.log("");

  return (
    <React.Fragment>
      <h1>Login {t("page")}</h1>;
      <img
        src="nada"
        alt="" />
    </React.Fragment>
  );
};

export default LoginPage;

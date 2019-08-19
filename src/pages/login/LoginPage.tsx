import React, { useContext } from "react";
import { AuthContext } from "core/contexts/AuthContext";
import { Redirect } from "react-router-dom";
import Media from "react-media";
import LoginMobile from "mobile/pages/LoginMobile";
import LoginDesktop from "desktop/pages/LoginDesktop";

const LoginPage: React.FC = () => {
  const auth = useContext(AuthContext);

  return auth.isAuthenticated ? (
    <Redirect to="/binnacle" />
  ) : (
    <Media query="(max-width: 480px)">
      {matches => (matches ? <LoginMobile /> : <LoginDesktop />)}
    </Media>
  );
};

export default LoginPage;

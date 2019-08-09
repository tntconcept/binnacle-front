import React from 'react'
import {useTranslation} from 'react-i18next'

const LoginPage: React.FC = () => {
  const {t} = useTranslation()

  return <h1>Login {t('page')}</h1>
};

export default LoginPage;

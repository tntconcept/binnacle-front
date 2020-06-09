import React, {useState} from 'react'
import TextField, {IFloatingLabelInput} from "commons/components/TextField"
import styles from "./PasswordField.module.css"
import {useTranslation} from "react-i18next"

const PasswordField: React.FC<IFloatingLabelInput> = (props) => {
  const { t } = useTranslation()
  const [passwordType, setPasswordType] = useState(true)

  return (
    <div className={styles.container}>
      <TextField
        type={passwordType ? "password": "text"}
        {...props}
      />
      <button
        type='button'
        className={styles.button}
        onClick={() => setPasswordType(!passwordType)}
        data-testid='password_visibility_button'
        tabIndex={-1}
      >
        {
          passwordType ? t("show") : t("hide")
        }
      </button>
    </div>
  )
}

export default PasswordField

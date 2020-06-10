import React, { useState } from 'react'
import styles from './PasswordField.module.css'
import { useTranslation } from 'react-i18next'
import { IFloatingLabelInput } from 'common/components/TextField'
import { TextField } from 'common/components'

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
          passwordType ? t("actions.show") : t("actions.hide")
        }
      </button>
    </div>
  )
}

export default PasswordField

import React, {useState} from 'react'
import TextField from "core/components/TextField/TextField"
import {ReactComponent as Visibility} from 'assets/icons/visibility.svg'
import {ReactComponent as VisibilityOff} from 'assets/icons/visibility_off.svg'

import classes from "./PasswordField.module.css"

interface PasswordField {
  label: string
}

const PasswordField: React.FC<PasswordField> = ({label, ...props}) => {
  const [passwordType, setPasswordType] = useState(true)

  return (
    <div className={classes.base}>
      <TextField
        label={label}
        className={classes.input}
        type={passwordType ? "password": "text"}
        {...props}>
        {props.children}
      </TextField>
      <button
        type='button'
        className={classes.button}
        onClick={() => setPasswordType(!passwordType)}
        data-testid='password_visibility_button'
      >
        {
          passwordType ? <VisibilityOff /> : <Visibility />
        }
      </button>
    </div>
  )
}

export default PasswordField

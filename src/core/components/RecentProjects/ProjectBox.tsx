import React from 'react'
import styles from './ProjectBox.module.css'
import {useField} from "formik"

interface IProjectBox {
  id: string,
  name: string,
  value: any,
  checked: boolean,
  required: boolean,
}

const ProjectBox: React.FC<IProjectBox> = (props) => {

  const [field, meta, helpers] = useField(props.name)

  const handleCheck = () => {
    helpers.setValue(props.value)
  }

  return (
    <>
      <input
        className={styles.base}
        id={props.id}
        name={props.name}
        type="radio"
        checked={props.checked}
        required={props.required}
        onChange={handleCheck}
      />
      <label
        htmlFor={props.id}
        className={`${styles.label} ${props.checked ? styles.labelSelected : ""}`}
      >
        <p>{props.value.project.name}</p>
        <p>{props.value.role.name}</p>
      </label>
    </>
  )
}

export default ProjectBox
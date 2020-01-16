import React from 'react'
import styles from './ProjectBox.module.css'

interface IProjectBox {
  id: string,
  name: string,
  value: any,
  checked: boolean,
  required: boolean,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProjectBox: React.FC<IProjectBox> = (props) => {
  return (
    <>
      <input
        className={styles.base}
        id={props.id}
        name={props.name}
        type="radio"
        checked={props.checked}
        required={props.required}
        onChange={props.onChange}
        onBlur={props.onBlur}
        data-testid={"role_" + props.value.role.id}
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
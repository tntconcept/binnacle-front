import React from "react"
import styles from "./ProjectBox.module.css"

interface IProjectBox {
  formik: any;
  id: string;
  name: string;
  value: any;
  checked: boolean;
  required: boolean;
}

const ProjectBox: React.FC<IProjectBox> = props => {
  const handleChange = () => {
    props.formik.setValues(
      {
        ...props.formik.values,
        organization: props.value.organization,
        project: props.value.project,
        role: props.value.role,
        billable: props.value.project.billable ? "yes" : "no"
      },
      false
    );
  };

  return (
    <>
      <input
        className={styles.base}
        id={props.id}
        name={props.name}
        type="radio"
        checked={props.checked}
        required={props.required}
        onChange={handleChange}
        data-testid={"role_" + props.value.role.id}
      />
      <label
        htmlFor={props.id}
        className={`${styles.label} ${
          props.checked ? styles.labelSelected : ""
        }`}
      >
        <p>{props.value.project.name}</p>
        <p>{props.value.role.name}</p>
      </label>
    </>
  );
};

export default ProjectBox;

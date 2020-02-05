import React from "react"
import styles from "core/components/RoleCard/RoleCard.module.css"

interface IRoleCard {
  formik: any;
  id: string;
  name: string;
  value: any;
  checked: boolean;
  required: boolean;
}

const RoleCard: React.FC<IRoleCard> = props => {
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

export default RoleCard;

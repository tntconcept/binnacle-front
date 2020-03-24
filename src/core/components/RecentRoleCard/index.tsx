import React from "react"
import styles from "core/components/RecentRoleCard/RecentRoleCard.module.css"
import {IRecentRole} from "api/interfaces/IRecentRole"

interface IRecentRoleCard {
  formik: any;
  id: number;
  name: string;
  value: IRecentRole;
  checked: boolean;
  required: boolean;
}

const RecentRoleCard: React.FC<IRecentRoleCard> = props => {
  const handleChange = () => {
    props.formik.setValues(
      {
        ...props.formik.values,
        role: {
          id: props.value.id,
          name: props.value.name
        },
        billable: props.value.projectBillable
      },
      false
    );
  };

  return (
    <>
      <input
        className={styles.base}
        id={props.id.toString()}
        name={props.name}
        type="radio"
        checked={props.checked}
        required={props.required}
        onChange={handleChange}
        data-testid={"role_" + props.value.id}
      />
      <label
        htmlFor={props.id.toString()}
        className={`${styles.label} ${
          props.checked ? styles.labelSelected : ""
        }`}
      >
        <p>{props.value.projectName}</p>
        <p>{props.value.name}</p>
      </label>
    </>
  );
};

export default RecentRoleCard;

import React from 'react'
import styles from 'features/ActivityForm/RecentRoleCard/RecentRoleCard.module.css'
import { IRecentRole } from 'api/interfaces/IRecentRole'
import { useFormikContext } from 'formik'
import { ActivityFormValues } from 'features/ActivityForm/ActivityForm'

interface IRecentRoleCard {
  id: number
  name: string
  value: IRecentRole
  checked: boolean
}

const RecentRoleCard: React.FC<IRecentRoleCard> = (props) => {
  const { values, setValues } = useFormikContext<ActivityFormValues>()

  const handleChange = (event: any) => {
    setValues(
      {
        ...values,
        recentRole: {
          id: props.value.id,
          name: props.value.name,
          projectName: props.value.projectName,
          projectBillable: props.value.projectBillable,
          // Date will be overridden in activity form
          date: new Date()
        },
        billable: props.value.projectBillable
      },
      false
    )
  }

  return (
    <>
      <input
        className={styles.base}
        id={props.id.toString()}
        name={props.name}
        type="radio"
        value={props.value.id}
        checked={props.checked}
        onChange={handleChange}
        data-testid={'role_' + props.value.id}
      />
      <label
        htmlFor={props.id.toString()}
        className={`${styles.label} ${props.checked ? styles.labelSelected : ''}`}
      >
        <p>{props.value.projectName}</p>
        <p>{props.value.name}</p>
      </label>
    </>
  )
}

export default RecentRoleCard

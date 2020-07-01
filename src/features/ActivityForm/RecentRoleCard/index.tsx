import React from 'react'
import styles from 'features/ActivityForm/RecentRoleCard/RecentRoleCard.module.css'
import { ReactComponent as UsersIcon } from 'assets/icons/users.svg'
import { ReactComponent as UserIcon } from 'assets/icons/user.svg'
import { IRecentRole } from 'api/interfaces/IRecentRole'
import { useFormikContext } from 'formik'
import { ActivityFormValues } from 'features/ActivityForm/ActivityForm'
import { useTranslation } from 'react-i18next'

interface IRecentRoleCard {
  id: number
  name: string
  value: IRecentRole
  checked: boolean
}

const RecentRoleCard: React.FC<IRecentRoleCard> = (props) => {
  const { t } = useTranslation()
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
          organizationName: props.value.organizationName,
          requireEvidence: props.value.requireEvidence,
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
        <p>
          <UsersIcon
            className={styles.icon}
            aria-label={t('activity_form.project') + ':'}
          />
          {props.value.projectName}
        </p>
        <p>
          <UserIcon
            className={styles.icon}
            aria-label={t('activity_form.role') + ':'}
          />
          {props.value.name}
        </p>
      </label>
    </>
  )
}

export default RecentRoleCard

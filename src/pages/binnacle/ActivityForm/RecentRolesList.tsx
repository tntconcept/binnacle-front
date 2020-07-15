import React from 'react'
import styles from 'pages/binnacle/ActivityForm/ActivityForm.module.css'
import { useFormikContext } from 'formik'
import { ActivityFormValues } from 'pages/binnacle/ActivityForm/ActivityFormLogic'
import RecentRoleCard from 'pages/binnacle/ActivityForm/RecentRoleCard'
import { useBinnacleResources } from 'features/BinnacleResourcesProvider'

const RecentRolesList = () => {
  const { activitiesReader } = useBinnacleResources()
  const recentRoles = activitiesReader().recentRoles || []

  const formik = useFormikContext<ActivityFormValues>()

  return (
    <div className={styles.rolesList}>
      {recentRoles.map((role) => (
        <RecentRoleCard
          key={role.id}
          id={role.id}
          name="recent_projects"
          value={role}
          checked={role.id === formik.values.recentRole!.id}
        />
      ))}
    </div>
  )
}

export default RecentRolesList

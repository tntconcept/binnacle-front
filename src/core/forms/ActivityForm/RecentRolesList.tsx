import React from "react"
import styles from "./ActivityForm.module.css"
import {useFormikContext} from "formik"
import {ActivityFormValues} from "core/forms/ActivityForm/ActivityForm"
import RecentRoleCard from "core/components/RecentRoleCard"
import {useCalendarResources} from "core/contexts/CalendarResourcesContext"

const RecentRolesList = () => {
  const recentRoles = useCalendarResources().activitiesResources.read().recentRoles || []
  const formik = useFormikContext<ActivityFormValues>();

  return (
    <div className={styles.rolesList}>
      {recentRoles.map(role => (
        <RecentRoleCard
          key={role.id}
          id={role.id}
          name="recent_projects"
          value={role}
          checked={role.id === formik.values.recentRole!.id}
        />
      ))}
    </div>
  );
};

export default RecentRolesList;

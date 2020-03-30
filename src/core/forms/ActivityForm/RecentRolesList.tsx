import React, {useContext} from "react"
import styles from "./ActivityForm.module.css"
import {useFormikContext} from "formik"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {ActivityFormValues} from "core/forms/ActivityForm/ActivityForm"
import RecentRoleCard from "core/components/RecentRoleCard"

const RecentRolesList = () => {
  const { state: binnacleState } = useContext(BinnacleDataContext);
  const formik = useFormikContext<ActivityFormValues>();

  return (
    <div className={styles.rolesList}>
      {binnacleState.recentRoles.map(role => (
        <RecentRoleCard
          key={role.id}
          id={role.id}
          name="recent_projects"
          value={role}
          checked={role.id === formik.values.role!.id}
        />
      ))}
    </div>
  );
};

export default RecentRolesList;

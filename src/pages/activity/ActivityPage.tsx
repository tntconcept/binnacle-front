import React from "react"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {useLocation} from "react-router-dom"
import {IActivity} from "interfaces/IActivity"

const ActivityPage = () => {
  const location = useLocation();

  return (
    <div>
      <ActivityForm
        activity={location.state as IActivity | undefined}
        initialSelectedRole={undefined}
        initialStartTime={undefined}
      />
    </div>
  );
};

export default ActivityPage;

import React from "react"
import ActivityForm from "core/forms/ActivityForm/ActivityForm"
import {Link, useHistory, useLocation} from "react-router-dom"
import {IActivity} from "interfaces/IActivity"
import {ReactComponent as ArrowLeft} from "assets/icons/chevron-left.svg"
import {format, isDate} from "date-fns"
import {es} from "date-fns/locale"
import styles from "./ActivityPage.module.css"

const calculateNavbarDate = (locationState: IActivity | Date | undefined) => {
  if (isDate(locationState)) {
    return format(locationState as Date, "dd 'de' MMMM", { locale: es });
  }

  if (!locationState) {
    return format(new Date(), "dd 'de' MMMM", { locale: es });
  }

  return format((locationState as IActivity).startDate, "dd 'de' MMMM", {
    locale: es
  });
};

const ActivityPage = () => {
  const location = useLocation();
  const history = useHistory();

  const activityExists = location.state
    ? isDate(location.state)
      ? undefined
      : (location.state as IActivity)
    : undefined;

  return (
    <div>
      <nav className={styles.baseNav}>
        <Link to="/binnacle" className={styles.backLink}>
          <ArrowLeft />
          Back
        </Link>
        <span>{calculateNavbarDate(location.state as IActivity | Date)}</span>
      </nav>
      <ActivityForm
        activity={activityExists}
        initialSelectedRole={undefined}
        initialStartTime={undefined}
        onAfterSubmit={() => history.push("/binnacle")}
      />
    </div>
  );
};

export default ActivityPage;

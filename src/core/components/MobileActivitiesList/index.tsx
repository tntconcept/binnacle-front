import React from 'react'
import styles from "./style.module.css"
import {ReactComponent as Clock} from "assets/icons/clock.svg"
import {ReactComponent as Users} from "assets/icons/users.svg"

const ActivitiesList = () => {
  return (
    <div className={styles.base}>
      <span className={styles.billable}>
        FACTURABLE
      </span>
      <div>
        <span className={styles.company}>Autentia company Lorem ipsum dolor sit amet asdaoq.</span>
        <div className={styles.headerBlockWithMarginBottom}>
          <Users className={styles.icon} />
          <p className={styles.projectAndRoleText}>
            Proyecto KN Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, voluptatibus?
          </p>
          <span className={styles.dot}>
            .
          </span>
          <p className={styles.projectAndRoleText}>
            Maquetador Pro
          </p>
        </div>
        <div className={styles.headerBlock}>
          <Clock className={styles.icon} />
          <span>
            10:30 - 12:30 (2h 30m)
          </span>
        </div>
      </div>
      <div className={styles.line}/>
      <p className={styles.description}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry’s standard …
      </p>
    </div>
  )
}

export default ActivitiesList
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IActivity } from 'api/interfaces/IActivity'
import { ActivityFormLogic } from './ActivityFormLogic'
import styles from 'pages/binnacle/ActivityForm/ActivityForm.module.css'
import { Field } from 'formik'
import { TextField, Checkbox, Button, FieldMessage } from 'common/components'
import ChooseRole from './ChooseRole'
import UploadImage from './UploadImage'
import RemoveActivityButton from './RemoveActivityButton'
import DurationInput from './DurationInput'
import DurationText from './DurationText'
import { isTimeOverlappingWithPreviousActivities } from 'pages/binnacle/ActivityForm/utils'
import { useBinnacleResources } from 'features/BinnacleResourcesProvider'
import DateTime from 'services/DateTime'
import { addMinutes } from 'date-fns'

interface IActivityForm {
  date: Date
  activity?: IActivity
  lastEndTime?: Date
  onAfterSubmit: () => void
}

export const ActivityForm: React.FC<IActivityForm> = (props) => {
  const { t } = useTranslation()

  return (
    <ActivityFormLogic
      date={props.date}
      activity={props.activity}
      lastEndTime={props.lastEndTime}
      onAfterSubmit={props.onAfterSubmit}
    >
      {(formik, utils) => (
        <form
          onSubmit={formik.handleSubmit}
          noValidate={true}
          className={styles.form}
        >
          <div className={styles.base}>
            <Field
              name="startTime"
              as={TextField}
              label={t('activity_form.start_time')}
              className={styles.startTime}
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              error={formik.errors.startTime && formik.touched.startTime}
              errorText={formik.errors.startTime}
            />
            <Field
              name="endTime"
              as={TextField}
              label={t('activity_form.end_time')}
              className={styles.endTime}
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              error={formik.errors.endTime && formik.touched.endTime}
              errorText={formik.errors.endTime}
            />
            <div className={styles.duration}>
              {utils.showDurationInput ? <DurationInput /> : <DurationText />}
            </div>
            <ChooseRole
              showRecentRoles={utils.showRecentRoles}
              toggleRecentRoles={utils.setShowRecentRoles}
              recentRoleExists={utils.recentRoleExists}
            />
            <Field
              name="billable"
              label={t('activity_form.billable')}
              checked={formik.values.billable}
              wrapperClassName={styles.billable}
              as={Checkbox}
            />
            <Field
              name="description"
              label={t('activity_form.description')}
              as={TextField}
              className={styles.description}
              isTextArea={true}
              error={formik.errors.description && formik.touched.description}
              errorText={formik.errors.description}
              hintText={`${formik.values.description.length} / 2048`}
              alignRightHelperText={true}
            />
            <UploadImage
              activityId={props.activity?.id}
              imgBase64={utils.imageBase64}
              handleChange={utils.setImageBase64}
              activityHasImg={props.activity?.hasImage ?? false}
            />
          </div>
          <div
            className={styles.footer}
            style={{
              justifyContent: props.activity ? 'space-between' : 'flex-end'
            }}
          >
            {props.activity && (
              <RemoveActivityButton
                activity={props.activity}
                onDeleted={props.onAfterSubmit}
              />
            )}
            <Button
              data-testid="save_activity"
              type="button"
              onClick={formik.handleSubmit}
              isLoading={formik.isSubmitting || utils.isPending}
              className={styles.saveButton}
            >
              {t('actions.save')}
            </Button>
          </div>
        </form>
      )}
    </ActivityFormLogic>
  )
}

interface ITimeOverlappingError {
  startDate: string
  endDate: string
  date: Date
  activityId?: number
}

const TimeOverlappingError: React.FC<ITimeOverlappingError> = (
  props: ITimeOverlappingError
) => {
  const { activitiesReader } = useBinnacleResources()

  const activitiesByDate = activitiesReader().activities

  const timeIntervals = useMemo(
    () =>
      activitiesByDate
        .find((day) => DateTime.isSameDay(day.date, props.date))!
        .activities.filter((activity) => activity.id !== props.activityId)
        .map((activity) => ({
          start: activity.startDate,
          end: addMinutes(activity.startDate, activity.duration)
        })),
    [activitiesByDate, props.activityId, props.date]
  )

  const error = isTimeOverlappingWithPreviousActivities(
    props.startDate,
    props.endDate,
    props.date,
    timeIntervals
  )

  const id = 'floating-label-startTime-input'

  return (
    <FieldMessage
      className={styles.timeOverlapError}
      id={id}
      error={error !== undefined}
      errorText={error}
    />
  )
}

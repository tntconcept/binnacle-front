// @ts-ignore
import React, {Fragment, unstable_useTransition as useTransition, useContext, useState} from "react"
import {Field, Formik} from "formik"
import {differenceInMinutes, parse} from "date-fns"
import styles from "features/ActivityForm/ActivityForm.module.css"
import {useTranslation} from "react-i18next"
import {IActivity} from "api/interfaces/IActivity"
import {IProjectRole} from "api/interfaces/IProjectRole"
import RemoveActivityButton from "features/ActivityForm/RemoveActivityButton"
import {IProject} from "api/interfaces/IProject"
import {IOrganization} from "api/interfaces/IOrganization"
import {useAutoFillHours} from "features/ActivityForm/useAutoFillHours"
import {SettingsContext} from "features/SettingsContext/SettingsContext"
import DurationInput from "features/ActivityForm/DurationInput"
import useRecentRole from "features/ActivityForm/useRecentRole"
import {ActivityFormSchema, ActivityFormSchemaWithSelectRole} from "features/ActivityForm/ActivityFormSchema"
import {getInitialValues} from "features/ActivityForm/utils"
import DurationText from "features/ActivityForm/DurationText"
import UploadImage from "features/ActivityForm/UploadImage"
import ChooseRole from "features/ActivityForm/ChooseRole"
import {IRecentRole} from "api/interfaces/IRecentRole"
import {useBinnacleResources} from "features/BinnacleResourcesProvider"
import {SUSPENSE_CONFIG} from "utils/constants"
import {Button, Checkbox, TextField} from "common/components"
import {useShowErrorNotification} from "features/Notifications"
import {createActivity, updateActivity} from "api/ActivitiesAPI"

interface IActivityForm {
  date: Date;
  activity?: IActivity;
  /** Last activity end time, fallback to settings start time value */
  lastEndTime?: Date;
  onAfterSubmit: () => void;
}

export interface ActivityFormValues {
  startTime: string;
  endTime: string;
  organization?: IOrganization;
  project?: IProject;
  role?: IProjectRole;
  recentRole?: IRecentRole;
  billable: boolean;
  description: string;
}

const ActivityForm: React.FC<IActivityForm> = props => {
  const { t } = useTranslation();
  const showErrorNotification = useShowErrorNotification();
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG)
  const { updateCalendarResources } = useBinnacleResources();
  const { state: settingsState } = useContext(SettingsContext);
  const { startTime, endTime } = useAutoFillHours(
    settingsState.autofillHours,
    settingsState.hoursInterval,
    props.lastEndTime
  );

  const recentRoleExists = useRecentRole(
    props.date,
    props.activity?.projectRole.id
  );
  const [showRecentRoles, toggleRecentRoles] = useState<boolean>(
    recentRoleExists !== undefined
  );

  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const handleSubmit = async (values: ActivityFormValues) => {
    if (props.activity) {
      try {
        const startDate = parse(
          values.startTime,
          "HH:mm",
          props.activity.startDate
        );
        const endTime = parse(
          values.endTime,
          "HH:mm",
          props.activity.startDate
        );
        const duration = differenceInMinutes(endTime, startDate);

        await updateActivity({
          startDate: startDate,
          billable: values.billable,
          description: values.description,
          duration: duration,
          projectRoleId: showRecentRoles
            ? values.recentRole!.id
            : values.role!.id,
          id: props.activity.id,
          hasImage: imageBase64 !== null,
          imageFile: imageBase64 !== null ? imageBase64 : undefined
        });

        startTransition(() => {
          props.onAfterSubmit();
          updateCalendarResources();
        })
      } catch (e) {
        showErrorNotification(e);
      }
    } else {
      try {
        const startDate = parse(values.startTime, "HH:mm", props.date);
        const endTime = parse(values.endTime, "HH:mm", props.date);
        const duration = differenceInMinutes(endTime, startDate);

        await createActivity({
          startDate: startDate,
          billable: values.billable,
          description: values.description,
          duration: duration,
          projectRoleId: showRecentRoles
            ? values.recentRole!.id
            : values.role!.id,
          hasImage: imageBase64 !== null,
          imageFile: imageBase64 !== null ? imageBase64 : undefined
        });

        startTransition(() => {
          props.onAfterSubmit();
          updateCalendarResources();
        })
      } catch (e) {
        showErrorNotification(e);
      }
    }
  };

  return (
    <Fragment>
      <Formik
        initialValues={getInitialValues(props.activity, recentRoleExists, {
          startTime,
          endTime
        })}
        validationSchema={
          showRecentRoles
            ? ActivityFormSchema
            : ActivityFormSchemaWithSelectRole
        }
        onSubmit={handleSubmit}
      >
        {formik => (
          <form
            onSubmit={formik.handleSubmit}
            noValidate={true}
            className={styles.form}
          >
            <div className={styles.base}>
              <Field
                name="startTime"
                as={TextField}
                label={t("activity_form.start_time")}
                className={styles.startTime}
                type="time"
                step="900"
                error={formik.errors.startTime && formik.touched.startTime}
                errorText={formik.errors.startTime}
              />
              <Field
                name="endTime"
                as={TextField}
                label={t("activity_form.end_time")}
                className={styles.endTime}
                type="time"
                step="900"
                error={formik.errors.endTime && formik.touched.endTime}
                errorText={formik.errors.endTime}
              />
              <div className={styles.duration}>
                {settingsState.showDurationInput ? (
                  <DurationInput />
                ) : (
                  <DurationText />
                )}
              </div>
              <ChooseRole
                showRecentRoles={showRecentRoles}
                toggleRecentRoles={toggleRecentRoles}
                recentRoleExists={recentRoleExists}
              />
              <Field
                name="billable"
                label={t("activity_form.billable")}
                checked={formik.values.billable}
                wrapperClassName={styles.billable}
                as={Checkbox}
              />
              <Field
                name="description"
                label={t("activity_form.description")}
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
                imgBase64={imageBase64}
                handleChange={setImageBase64}
                activityHasImg={props.activity?.hasImage ?? false}
              />
            </div>
            <div
              className={styles.footer}
              style={{
                justifyContent: props.activity ? "space-between" : "flex-end"
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
                isLoading={formik.isSubmitting || isPending}
              >
                {t("actions.save")}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Fragment>
  );
};

export default ActivityForm;

import React, {Fragment, useContext, useState} from "react"
import {Field, Formik} from "formik"
import TextField from "core/components/TextField/TextField"
import {differenceInMinutes, parse} from "date-fns"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import {useTranslation} from "react-i18next"
import {IActivity} from "api/interfaces/IActivity"
import {IProjectRole} from "api/interfaces/IProjectRole"
import {createActivity, deleteActivity, updateActivity} from "api/ActivitiesAPI"
import ActivityFormActions from "core/forms/ActivityForm/ActivityFormActions"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {BinnacleActions} from "core/contexts/BinnacleContext/BinnacleActions"
import FieldMessage from "core/components/FieldMessage"
import {IProject} from "api/interfaces/IProject"
import {IOrganization} from "api/interfaces/IOrganization"
import Checkbox from "core/components/Checkbox"
import {useAutoFillHours} from "core/forms/ActivityForm/useAutoFillHours"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import DurationInput from "core/forms/ActivityForm/DurationInput"
import useRecentRoles from "core/hooks/useRecentRoles"
import {ActivityFormSchema, ActivityFormSchemaWithSelectRole} from "core/forms/ActivityForm/ActivityFormSchema"
import {getInitialValues} from "core/forms/ActivityForm/utils"
import DurationText from "core/forms/ActivityForm/DurationText"
import UploadImage from "core/forms/ActivityForm/UploadImage"
import ChooseRole from "core/forms/ActivityForm/ChooseRole"
import {IRecentRole} from "api/interfaces/IRecentRole"
import {NotificationsContext} from "core/contexts/NotificationsContext"
import getErrorMessage from "api/HttpClient/HttpErrorMapper"

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
  recentRole?: IRecentRole
  billable: boolean;
  description: string;
}

const ActivityForm: React.FC<IActivityForm> = props => {
  const { t } = useTranslation();
  const showNotification = useContext(NotificationsContext)

  const { dispatch } = useContext(BinnacleDataContext);
  const { state: settingsState } = useContext(SettingsContext);
  const { startTime, endTime } = useAutoFillHours(
    settingsState.autofillHours,
    settingsState.hoursInterval,
    props.lastEndTime
  );
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const recentRoleExists = useRecentRoles(props.date, props.activity?.projectRole.id);
  const [showRecentRoles, toggleRecentRoles] = useState<boolean>(
    recentRoleExists !== undefined
  );

  const buildLastImputedRole = (values: ActivityFormValues): IRecentRole => {
    if (showRecentRoles) {
      return {
        id: values.recentRole!.id,
        name: values.recentRole!.name,
        projectName: values.recentRole!.projectName,
        projectBillable: values.recentRole!.projectBillable,
        date: props.date
      }
    } else {
      return {
        id: values.role!.id,
        name: values.role!.name,
        projectName: values.project!.name,
        projectBillable: values.project!.billable,
        date: props.date
      }
    }
  }

  const saveImputedRole = (values: ActivityFormValues) => {
    const imputedRole = buildLastImputedRole(values)

    if (showRecentRoles) {
      dispatch(BinnacleActions.updateLastImputedRole(imputedRole));
    } else {
      dispatch(BinnacleActions.addRecentRole(imputedRole));
    }
  }

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

        const response = await updateActivity({
          startDate: startDate,
          billable: values.billable,
          description: values.description,
          duration: duration,
          projectRoleId: values.recentRole ? values.recentRole.id : values.role!.id,
          id: props.activity.id,
          hasImage: imageBase64 !== null,
          imageFile: imageBase64 !== null ? imageBase64 : undefined
        });

        dispatch(BinnacleActions.updateActivity(response));
        saveImputedRole(values)
        props.onAfterSubmit()
      } catch (e) {
        showNotification(getErrorMessage(e))
      }
    } else {
      try {
        const startDate = parse(values.startTime, "HH:mm", props.date);
        const endTime = parse(values.endTime, "HH:mm", props.date);
        const duration = differenceInMinutes(endTime, startDate);

        const response = await createActivity({
          startDate: startDate,
          billable: values.billable,
          description: values.description,
          duration: duration,
          projectRoleId: values.recentRole ? values.recentRole.id : values.role!.id,
          hasImage: imageBase64 !== null,
          imageFile: imageBase64 !== null ? imageBase64 : undefined
        });

        dispatch(BinnacleActions.createActivity(response));
        saveImputedRole(values)
        props.onAfterSubmit()
      } catch (e) {
        showNotification(getErrorMessage(e))
      }
    }
  };

  const handleRemoveActivity = async () => {
    if (props.activity) {
      try {
        await deleteActivity(props.activity.id);
        dispatch(BinnacleActions.deleteActivity(props.activity));
        props.onAfterSubmit();
      } catch (e) {
        showNotification(getErrorMessage(e))
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
          <form onSubmit={formik.handleSubmit} noValidate={true}>
            <div className={styles.base}>
              <Field
                name="startTime"
                as={TextField}
                label={t("activity_form.start_time")}
                className={styles.startTime}
                type="time"
                step="900"
              >
                <FieldMessage
                  isError={formik.errors.startTime && formik.touched.startTime}
                  errorText={formik.errors.startTime}
                />
              </Field>
              <Field
                name="endTime"
                as={TextField}
                label={t("activity_form.end_time")}
                className={styles.endTime}
                type="time"
                step="900"
              >
                <FieldMessage
                  isError={formik.errors.endTime && formik.touched.endTime}
                  errorText={formik.errors.endTime}
                />
              </Field>
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
              >
                <FieldMessage
                  isError={
                    formik.errors.description && formik.touched.description
                  }
                  errorText={formik.errors.description}
                  alignRight={true}
                  hintText={`${formik.values.description.length} / 1024`}
                />
              </Field>
              <UploadImage
                activityId={props.activity?.id}
                imgBase64={imageBase64}
                handleChange={setImageBase64}
                activityHasImg={props.activity?.hasImage ?? false}
              />
            </div>
            <ActivityFormActions
              activity={props.activity}
              onRemove={handleRemoveActivity}
              onSave={formik.handleSubmit}
            />
          </form>
        )}
      </Formik>
    </Fragment>
  );
};

export default ActivityForm;

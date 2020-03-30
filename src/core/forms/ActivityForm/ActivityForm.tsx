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
import {FormikHelpers} from "formik/dist/types"
import {IProject} from "api/interfaces/IProject"
import {IOrganization} from "api/interfaces/IOrganization"
import Checkbox from "core/components/Checkbox"
import {useAutoFillHours} from "core/forms/ActivityForm/useAutoFillHours"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import DurationInput from "core/forms/ActivityForm/DurationInput"
import useRecentRoles from "core/hooks/useRecentRoles"
import {ActivityFormSchema} from "core/forms/ActivityForm/ActivityFormSchema"
import {getInitialValues} from "core/forms/ActivityForm/utils"
import DurationText from "core/forms/ActivityForm/DurationText"
import UploadImage from "core/forms/ActivityForm/UploadImage"
import ChooseRole from "core/forms/ActivityForm/ChooseRole"
import ErrorModal from "core/components/ErrorModal"
import useModal from "core/hooks/useModal"

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
  billable: boolean;
  description: string;
}

const ActivityForm: React.FC<IActivityForm> = props => {
  const { t } = useTranslation();
  const {
    modalIsOpen: errorModalIsOpen,
    toggleModal: toggleErrorModal
  } = useModal();

  const { dispatch } = useContext(BinnacleDataContext);
  const { state: settingsState } = useContext(SettingsContext);
  const { startTime, endTime } = useAutoFillHours(
    settingsState.autofillHours,
    settingsState.hoursInterval,
    props.lastEndTime
  );
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const recentRoleExists = useRecentRoles(props.activity?.projectRole.id);
  const [showRecentRoles, toggleRecentRoles] = useState(
    recentRoleExists !== undefined
  );

  const handleSubmit = async (
    values: ActivityFormValues,
    formikHelpers: FormikHelpers<ActivityFormValues>
  ) => {
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
          projectRoleId: values.role!.id,
          id: props.activity.id,
          hasImage: imageBase64 !== null,
          imageFile: imageBase64 !== null ? (imageBase64 as string) : undefined
        });

        dispatch(BinnacleActions.updateActivity(response));
      } catch (e) {
        toggleErrorModal();
      }
    } else {
      try {
        const startDate = parse(values.startTime, "HH:mm", props.date);
        const endTime = parse(values.endTime, "HH:mm", props.date);
        const duration = differenceInMinutes(endTime, startDate);

        const response = await createActivity({
          billable: values.billable,
          description: values.description,
          duration: duration,
          startDate: (startDate.toISOString() as unknown) as Date,
          projectRoleId: values.role!.id,
          hasImage: imageBase64 !== null,
          imageFile: imageBase64 !== null ? (imageBase64 as string) : undefined
        });

        dispatch(BinnacleActions.createActivity(response));
      } catch (e) {
        toggleErrorModal();
      }
    }

    const imputedRole = {
      id: values.role!.id,
      name: values.role!.name,
      projectName: values.project!.name,
      projectBillable: values.project!.billable,
      date: props.date
    };

    // This can be done inside create or update activity reducer, instead of here.
    if (showRecentRoles) {
      dispatch(BinnacleActions.updateLastImputedRole(imputedRole));
    } else {
      dispatch(BinnacleActions.addRecentRole(imputedRole));
    }

    props.onAfterSubmit();
  };

  const handleRemoveActivity = async () => {
    if (props.activity) {
      try {
        await deleteActivity(props.activity.id);
        dispatch(BinnacleActions.deleteActivity(props.activity));
        props.onAfterSubmit();
      } catch (e) {
        toggleErrorModal();
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
        validationSchema={ActivityFormSchema}
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
                hasImage={props.activity?.hasImage ?? false}
                toggleErrorModal={toggleErrorModal}
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
      {errorModalIsOpen && (
        <ErrorModal
          message={{
            title: "Whoops!",
            description: "An error occurred"
          }}
          onClose={toggleErrorModal}
          onConfirm={toggleErrorModal}
          confirmText={t("actions.accept")}
        />
      )}
    </Fragment>
  );
};

export default ActivityForm;

import React, {useContext, useState} from "react"
import {Field, Formik} from "formik"
import TextField from "core/components/TextField/TextField"
import {differenceInMinutes, parse} from "date-fns"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import RecentRoleCard from "core/components/RecentRoleCard"
import {useTranslation} from "react-i18next"
import ChooseRole from "core/forms/ActivityForm/ChooseRole"
import {IActivity} from "api/interfaces/IActivity"
import {IProjectRole} from "api/interfaces/IProjectRole"
import {createActivity, getActivityImage, updateActivity} from "api/ActivitiesAPI"
import ActivityFormFooter from "core/forms/ActivityForm/ActivityFormFooter"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {BinnacleActions} from "core/contexts/BinnacleContext/BinnacleActions"
import FieldMessage from "core/components/FieldMessage"
import {FormikHelpers} from "formik/dist/types"
import {IProject} from "api/interfaces/IProject"
import {IOrganization} from "api/interfaces/IOrganization"
import Checkbox from "core/components/Checkbox"
import {useAutoFillHours} from "core/forms/ActivityForm/useAutoFillHours"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import DurationField from "core/forms/ActivityForm/DurationField"
import {getDuration} from "utils/TimeUtils"
import useRecentRoles from "core/hooks/useRecentRoles"
import ImageFile from "core/components/ImageFile"
import Button from "core/components/Button"
import {ActivityFormSchema} from "core/forms/ActivityForm/ActivityFormSchema"
import {getInitialValues, openImageInTab} from "core/forms/ActivityForm/utils"

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
  const { state: binnacleState, dispatch } = useContext(BinnacleDataContext);
  const { state: settingsState } = useContext(SettingsContext);
  const { startTime, endTime } = useAutoFillHours(
    settingsState.autofillHours,
    settingsState.hoursInterval,
    props.lastEndTime
  );
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [hasImage, setHasImage] = useState(props.activity?.hasImage ?? false);

  const roleFound = useRecentRoles(props.activity?.projectRole.id);

  // If role is not found then show the combobox
  const [selectsMode, setSelectesMode] = useState(!roleFound);

  const handleSubmit = async (
    values: ActivityFormValues,
    formikHelpers: FormikHelpers<ActivityFormValues>
  ) => {
    if (props.activity) {
      const startDate = parse(
        values.startTime,
        "HH:mm",
        props.activity.startDate
      );
      const endTime = parse(values.endTime, "HH:mm", props.activity.startDate);
      const duration = differenceInMinutes(endTime, startDate);

      const response = await updateActivity({
        startDate: startDate,
        billable: values.billable,
        description: values.description,
        duration: duration,
        projectRoleId: values.role!.id,
        id: props.activity.id,
        hasImage: hasImage,
        imageFile: hasImage ? (imageBase64 as string) : undefined
      });

      dispatch(BinnacleActions.updateActivity(response));
    } else {
      const startDate = parse(values.startTime, "HH:mm", props.date);
      const endTime = parse(values.endTime, "HH:mm", props.date);
      const duration = differenceInMinutes(endTime, startDate);

      const response = await createActivity({
        billable: values.billable,
        description: values.description,
        duration: duration,
        startDate: (startDate.toISOString() as unknown) as Date,
        projectRoleId: values.role!.id,
        hasImage: hasImage,
        imageFile: hasImage ? (imageBase64 as string) : undefined
      });

      dispatch(BinnacleActions.createActivity(response));
    }

    const imputedRole = {
      id: values.role!.id,
      name: values.role!.name,
      projectName: values.project!.name,
      projectBillable: values.project!.billable,
      // useDirectly props.date
      date: props.date
      // date: parse(values.startTime, "HH:mm", props.date)
    };

    if (selectsMode) {
      dispatch(BinnacleActions.addRecentRole(imputedRole));
    } else {
      dispatch(BinnacleActions.updateLastImputedRole(imputedRole));
    }

    props.onAfterSubmit();
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const dateLeft = parse(startTime, "HH:mm", new Date());
    const dateRight = parse(endTime, "HH:mm", new Date());

    const difference = differenceInMinutes(dateLeft, dateRight);

    return getDuration(difference, settingsState.useDecimalTimeFormat);
  };

  const onChangeImage = (value: string | null) => {
    setImageBase64(value);
    setHasImage(true);
  };

  const openImage = async () => {
    if (imageBase64 === null) {
      const image = await getActivityImage(props.activity!.id);
      setImageBase64(image);
      openImageInTab(image);
    } else {
      openImageInTab(imageBase64);
    }
  };

  const removeImage = () => {
    setImageBase64(null);
    setHasImage(false);
  };

  return (
    <Formik
      initialValues={getInitialValues(props.activity, roleFound, {
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
                <DurationField />
              ) : (
                <React.Fragment>
                  <span>{t("activity_form.duration")}</span>
                  <span>
                    {formik.errors.endTime && formik.touched.endTime
                      ? "-"
                      : calculateDuration(
                          formik.values.startTime,
                          formik.values.endTime
                        )}
                  </span>
                </React.Fragment>
              )}
            </div>
            <div className={styles.entities}>
              <div
                className={styles.selectsContainer}
                role="group"
                aria-labelledby="selects_head"
              >
                <div id="selects_head" className={styles.selectsTitle}>
                  {selectsMode
                    ? t("activity_form.select_role")
                    : t("activity_form.recent_roles")}
                </div>
                {roleFound && (
                  <button
                    className={styles.button}
                    onClick={() => {
                      if (!selectsMode) {
                        formik.setValues(
                          {
                            ...formik.values,
                            organization: undefined,
                            project: undefined,
                            role: undefined
                          },
                          false
                        );
                        setSelectesMode(true);
                      } else {
                        formik.setValues(
                          {
                            ...formik.values,
                            organization: roleFound
                              ? (({ foo: true } as unknown) as any)
                              : undefined,
                            project: roleFound
                              ? (({ foo: true } as unknown) as any)
                              : undefined,
                            role: roleFound
                              ? {
                                  id: roleFound!.id,
                                  name: roleFound!.name
                                }
                              : undefined
                          },
                          false
                        );
                        setSelectesMode(false);
                      }
                    }}
                    type="button"
                  >
                    {selectsMode ? (
                      t("activity_form.back_to_recent_roles")
                    ) : (
                      <span>+ {t("activity_form.add_role")}</span>
                    )}
                  </button>
                )}
                {selectsMode ? (
                  <ChooseRole />
                ) : (
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
                )}
              </div>
            </div>
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
            <div className={styles.image}>
              <span>{t("activity_form.image")}</span>
              <div>
                <ImageFile
                  label="Upload"
                  value={imageBase64}
                  onChange={onChangeImage}
                />
                {hasImage && (
                  <Button type="button" onClick={openImage}>
                    Ver
                  </Button>
                )}
                {hasImage && (
                  <Button type="button" onClick={removeImage}>
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </div>
          <ActivityFormFooter
            activity={props.activity}
            onRemove={props.onAfterSubmit}
          />
        </form>
      )}
    </Formik>
  );
};

export default ActivityForm;

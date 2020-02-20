import React, {useContext, useMemo, useState} from "react"
import {Field, Formik} from "formik"
import TextField from "core/components/TextField/TextField"
import {addMinutes, differenceInMinutes, format, isAfter, parse} from "date-fns"
import * as Yup from "yup"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import RecentRoleCard from "core/components/RecentRoleCard"
import {useTranslation} from "react-i18next"
import i18n from "i18n"
import ChooseRole from "core/forms/ActivityForm/ChooseRole"
import {IActivity} from "interfaces/IActivity"
import {IProjectRole} from "interfaces/IProjectRole"
import {createActivity, updateActivity} from "services/activitiesService"
import ActivityFormFooter from "core/forms/ActivityForm/ActivityFormFooter"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {BinnacleActions} from "core/contexts/BinnacleContext/binnacleActions"
import FieldMessage from "core/components/FieldMessage"
import {FormikHelpers} from "formik/dist/types"
import {IProject} from "interfaces/IProject"
import {IOrganization} from "interfaces/IOrganization"
import Checkbox from "core/components/Checkbox"
import {useAutoFillHours} from "core/forms/ActivityForm/useAutoFillHours"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import DurationField from "core/forms/ActivityForm/DurationField"
import {getDuration} from "utils/TimeUtils"
import useRecentRoles from "core/hooks/useRecentRoles"

const ActivityFormSchema = Yup.object().shape({
  startTime: Yup.string().required(i18n.t("form_errors.field_required")),
  /*    .test("is-greater", "end time should be greater", function (value) {
        const {endTime} = this.parent
        return moment(value, "HH:mm").isSameOrAfter(moment(start, "HH:mm"))
      }),*/
  endTime: Yup.string()
    .required(i18n.t("form_errors.field_required"))
    .test("is-greater", i18n.t("form_errors.end_time_greater"), function(
      value
    ) {
      const { startTime } = this.parent;
      const startDate = parse(startTime, "HH:mm", new Date());
      const endDate = parse(value, "HH:mm", new Date());

      // console.log(startDate, endDate);

      return isAfter(endDate, startDate);
    }),
  organization: Yup.object().required(i18n.t("form_errors.select_an_option")),
  project: Yup.object().required(i18n.t("form_errors.select_an_option")),
  role: Yup.object().required(i18n.t("form_errors.select_an_option")),
  billable: Yup.string().required(i18n.t("form_errors.field_required")),
  description: Yup.string()
    .required(i18n.t("form_errors.field_required"))
    .max(1024, i18n.t("form_errors.max_length"))
});

interface IActivityForm {
  date: Date;
  activity?: IActivity;
  /** Last activity end time, fallback to settings start time value */
  lastEndTime?: Date;
  /** Last activity role */
  // Cuando exista el rol significa que existen roles frequentes.
  lastActivityRole?: IProjectRole;
  onAfterSubmit: () => void;
}

interface Values {
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

  const roleFound = useRecentRoles(props.activity?.projectRole.id);

  // If role is not found then show the combobox
  const [selectsMode, setSelectesMode] = useState(!roleFound);

  const initialValues = useMemo<Values>(() => {
    if (props.activity) {
      return {
        startTime: format(props.activity.startDate, "HH:mm"),
        endTime: format(
          addMinutes(props.activity.startDate, props.activity.duration),
          "HH:mm"
        ),
        organization: props.activity.organization,
        project: props.activity.project,
        role: props.activity.projectRole,
        billable: props.activity.billable,
        description: props.activity.description
      };
    }

    return {
      startTime: startTime,
      endTime: endTime,
      organization: roleFound ? {foo: true} as unknown as any : undefined,
      project: roleFound ? {foo: true} as unknown as any : undefined,
      role: roleFound ? {
        id: roleFound!.id,
        name: roleFound!.name
      } : undefined,
      billable: roleFound?.projectBillable ?? false,
      description: ""
    };
  }, [props.activity, roleFound, startTime, endTime]);

  const handleSubmit = async (
    values: Values,
    formikHelpers: FormikHelpers<Values>
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
        id: props.activity.id
      });

      dispatch(BinnacleActions.updateActivity(response));
    } else {
      const startDate = parse(values.startTime, "HH:mm", props.date);
      const endTime = parse(values.endTime, "HH:mm", props.date);
      const duration = differenceInMinutes(endTime, startDate);

      // TODO CHECK ENTITIES EXISTS
      const response = await createActivity({
        billable: values.billable,
        description: values.description,
        duration: duration,
        startDate: (startDate.toISOString() as unknown) as Date,
        projectRoleId: values.role!.id
      });

      // TODO En las acciones de editar o crear, guardar el ultimo rol imputado, quizas con un lastUsed o algo parecido en el rol
      dispatch(BinnacleActions.createActivity(response));
    }

    // TODO IMPLEMENTAR, ELIMINAR LA PROP DE LASTIMPUTEDROLE
    if (selectsMode) {
      const role = {
        id: values.role!.id,
        name: values.role!.name,
        projectName: values.project!.name,
        projectBillable: values.project!.billable,
        // useDirectly props.date
        date: parse(values.startTime, "HH:mm", props.date)
      }
      console.log("new Role Imputed", role)
      dispatch(BinnacleActions.addLatestRole(role))
    }

    props.onAfterSubmit();
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const dateLeft = parse(startTime, "HH:mm", new Date());
    const dateRight = parse(endTime, "HH:mm", new Date());

    const difference = differenceInMinutes(dateLeft, dateRight);

    return getDuration(difference, settingsState.useDecimalTimeFormat);
  };

  console.log(initialValues)

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ActivityFormSchema}
      onSubmit={handleSubmit}
    >
      {formik => (
        <form onSubmit={formik.handleSubmit}>
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
              <div className={styles.selectsContainer} role='group' aria-labelledby='selects_head'>
                <div id='selects_head' className={styles.selectsTitle}>
                  {selectsMode
                    ? t("activity_form.select_role")
                    : t("activity_form.recent_roles")}
                </div>
                {roleFound && (
                  <button
                    className={styles.button}
                    onClick={() => {
                      if (!selectsMode) {
                        formik.setValues({
                          ...formik.values,
                          organization: undefined,
                          project: undefined,
                          role: undefined
                        }, false)
                        setSelectesMode(true)
                      } else {
                        formik.setValues({
                          ...formik.values,
                          organization: roleFound ? {foo: true} as unknown as any : undefined,
                          project: roleFound ? {foo: true} as unknown as any : undefined,
                          role: roleFound ? {
                            id: roleFound!.id,
                            name: roleFound!.name
                          } : undefined
                        }, false)
                        setSelectesMode(false)
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
                  <ChooseRole
                    formik={formik}
                    initialOrganization={
                      !roleFound ? props.activity?.organization : undefined
                    }
                    initialProject={
                      !roleFound ? props.activity?.project : undefined
                    }
                  />
                ) : (
                  <div className={styles.rolesList}>
                    {binnacleState.recentRoles.map(role => (
                      <RecentRoleCard
                        key={role.id}
                        id={role.id}
                        name="frequent_projects"
                        value={role}
                        checked={role.id === formik.values.role!.id}
                        required={true}
                        formik={formik}
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
          </div>
          <ActivityFormFooter
            activity={props.activity}
            onSave={() => console.log("onSave called")}
            onRemove={props.onAfterSubmit}
          />
        </form>
      )}
    </Formik>
  );
};

export default ActivityForm;

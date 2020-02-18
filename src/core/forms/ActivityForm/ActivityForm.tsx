import React, {useContext, useMemo, useState} from "react"
import {Field, Formik} from "formik"
import TextField from "core/components/TextField/TextField"
import {addMinutes, differenceInMinutes, format, isAfter, parse, parseISO} from "date-fns"
import * as Yup from "yup"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import ProjectBox from "core/components/RoleCard"
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

const optionsDefault = new Array(10).fill(null).map((value, index, array) => ({
  id: index,
  name: `Test ${index}`
}));

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
    .max(1024, "La descripción tiene que ser más corta")
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
  const { dispatch } = useContext(BinnacleDataContext);
  const { state: settingsState } = useContext(SettingsContext);
  const { startTime, endTime } = useAutoFillHours(
    settingsState.autofillHours,
    settingsState.hoursInterval,
    props.lastEndTime
  );

  const frequentRoles = [
    {
      organization: {
        id: 1,
        name: "Empresa 1"
      },
      project: {
        id: 1,
        name: "Indra Project",
        open: true,
        billable: true
      },
      role: {
        id: 1,
        name: "Maquetador"
      }
    },
    {
      organization: {
        id: 100,
        name: "KAkut"
      },
      project: {
        id: 5,
        name: "NobodyKnows",
        billable: true,
        open: true
      },
      role: {
        id: 10,
        name: "Secret"
      }
    }
  ];

  const roleFound = frequentRoles.find(
    item =>
      item.role.id ===
      (props.lastActivityRole
        ? props.lastActivityRole.id
        : props.activity
          ? props.activity.projectRole.id
          : null)
  );

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
      organization: roleFound?.organization,
      project: roleFound?.project,
      role: roleFound?.role,
      billable: false,
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

      props.onAfterSubmit();
    } else {
      const startDate = parse(values.startTime, "HH:mm", props.date);
      // Try to create an activity from 09:00 to 13:00
      console.log("UTC", startDate.toUTCString()); //  UTC Wed, 12 Feb 2020 08:00:00 GMT
      console.log("Date", startDate.toDateString()); // Date Wed Feb 12 2020
      console.log("ISO", startDate.toISOString()); //  ISO 2020-02-12T08:00:00.000Z !!
      console.log("LocalDate", startDate.toLocaleDateString()); // LocalDate 12/02/2020
      console.log("Locale", startDate.toLocaleString()); // Locale 12/02/2020, 09:00:00
      console.log("LocalTime", startDate.toLocaleTimeString()); // LocalTime 09:00:00 !!
      const endTime = parse(values.endTime, "HH:mm", props.date);
      const duration = differenceInMinutes(endTime, startDate);

      console.log("ParseISO", parseISO("2020-02-12T08:00:00.000Z")); // Wed Feb 12 2020 09:00:00 GMT+0100 (Central European Standard Time)
      console.log(
        "FormatTime",
        format(parseISO("2020-02-12T08:00:00.000Z"), "HH:mm")
      ); // 09:00

      console.log("ActiviyDate Post startDate", "2020-02-05T08:00:00");
      console.log("ActivityDate GET Parsed", parseISO("2020-03-04T08:00:00")); // Wed Mar 04 2020 08:00:00 GMT+0100 (Central European Standard Time)

      // TODO CHECK ENTITIES EXISTS
      const response = await createActivity({
        billable: values.billable,
        description: values.description,
        duration: duration,
        startDate: (startDate.toISOString() as unknown) as Date,
        projectRoleId: values.role!.id
      });

      dispatch(BinnacleActions.createActivity(response));

      props.onAfterSubmit();
    }

    console.log("Is Working", JSON.stringify(values, null, 2));
    // alert(JSON.stringify(values, null, 2))
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const dateLeft = parse(startTime, "HH:mm", new Date());
    const dateRight = parse(endTime, "HH:mm", new Date());

    const difference = differenceInMinutes(dateLeft, dateRight);

    return getDuration(difference, settingsState.useDecimalTimeFormat);
  };

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
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>
                  {selectsMode
                    ? t("activity_form.select_role")
                    : t("activity_form.frequent_roles")}
                </legend>
                {roleFound && (
                  <button
                    className={styles.button}
                    onClick={() => setSelectesMode(!selectsMode)}
                    type="button"
                  >
                    {selectsMode ? (
                      t("activity_form.back_to_frequent_roles")
                    ) : (
                      <span>+ {t("activity_form.add_role")}</span>
                    )}
                  </button>
                )}

                {selectsMode ? (
                  <ChooseRole formik={formik} />
                ) : (
                  <div className={styles.rolesList}>
                    {frequentRoles.map(item => (
                      <ProjectBox
                        key={item.role.id}
                        id={item.role.id.toString()}
                        name="frequent_projects"
                        value={item}
                        checked={item.role.id === formik.values.role!.id}
                        required={true}
                        formik={formik}
                      />
                    ))}
                  </div>
                )}
              </fieldset>
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

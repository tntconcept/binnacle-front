import React, {useMemo, useState} from "react"
import {useFormik} from "formik"
import FloatingLabelInput from "core/components/FloatingLabelField/FloatingLabelInput"
import {addMinutes, differenceInMinutes, format, isAfter, parse} from "date-fns"
import * as Yup from "yup"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import {getHumanizedDuration} from "core/forms/ActivityForm/TimeUtils"
import ProjectBox from "core/components/RecentProjects/ProjectBox"
import {useTranslation} from "react-i18next"
import i18n from "i18n"
import ChooseRole from "core/forms/ActivityForm/ChooseRole"
import {IActivity} from "interfaces/IActivity"
import {IProjectRole} from "interfaces/IProjectRole"
import {createActivity, updateActivity} from "services/activitiesService"

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
  description: Yup.string().required(i18n.t("form_errors.field_required"))
});

interface IActivityForm {
  activity?: IActivity;
  /** Last activity end time, fallback to settings start time value  */
  initialStartTime?: string;
  /** Last activity role or activity edit */
  // Cuando exista el rol significa que existen roles frequentes.
  initialSelectedRole?: IProjectRole;
}

const ActivityForm: React.FC<IActivityForm> = props => {
  const { t } = useTranslation();
  const frequentRoles = [
    {
      organization: {
        id: 200,
        name: "Autentia"
      },
      project: {
        id: 1,
        name: "Zara",
        billable: false,
        open: true
      },
      role: {
        id: 15,
        name: "React developer"
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
      (props.initialSelectedRole
        ? props.initialSelectedRole.id
        : props.activity
        ? props.activity.projectRole.id
        : null)
  );

  const [selectsMode, setSelectesMode] = useState(!roleFound);

  const initialValues = useMemo(() => {
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
        billable: props.activity.billable ? "yes" : "no",
        description: props.activity.description
      };
    }

    return {
      startTime: props.initialStartTime ?? "09:00",
      endTime: "13:00",
      organization: roleFound?.organization,
      project: roleFound?.project,
      role: roleFound?.role,
      billable: "no",
      description: ""
    };
  }, [props.activity, props.initialStartTime, roleFound]);

  // Si el rol id existe en recientes se marca en recientes.
  // const roleExistsInRecents = frequentProjects.some(role => role.id == activity.role.id)

  // Si el proyecto no existe en recientes se muestra la lista de selects con las entidades seleccionadas.
  // se renderizan los selects.

  // Los selects siempre muestran la organization, project y rol previamente seleccionados.

  // Al entrar por primera vez no mostrara ninguno.

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: ActivityFormSchema,
    onSubmit: async values => {
      // TODO CHECK ERROR
      if (props.activity) {
        const startDate = parse(
          formik.values.startTime,
          "HH:mm",
          props.activity.startDate
        );
        const endTime = parse(
          formik.values.endTime,
          "HH:mm",
          props.activity.startDate
        );
        const duration = differenceInMinutes(startDate, endTime);

        await updateActivity({
          startDate: startDate,
          billable: values.billable === "yes",
          description: values.description,
          duration: duration,
          organization: values.organization!,
          project: values.project!,
          projectRole: values.role!,
          userId: props.activity.userId,
          id: props.activity.id
        });
      } else {
        const currentDate = new Date();
        const startDate = parse(formik.values.startTime, "HH:mm", currentDate);
        const endTime = parse(formik.values.endTime, "HH:mm", currentDate);
        const duration = differenceInMinutes(endTime, startDate);

        // TODO CHECK ENTITIES EXISTS
        await createActivity({
          billable: values.billable === "yes",
          description: values.description,
          duration: duration,
          organization: values.organization!,
          project: values.project!,
          projectRole: values.role!,
          startDate: startDate,
          userId: 0 // get current user Id
        });
      }

      console.log("Is Working", JSON.stringify(values, null, 2));
      // alert(JSON.stringify(values, null, 2))
    }
  });

  const endTimeHasError = formik.errors.endTime && formik.touched.endTime;

  console.log("formikErrors", formik.errors);

  return (
    <React.Fragment>
      <form className={styles.base} onSubmit={formik.handleSubmit}>
        <FloatingLabelInput
          name="startTime"
          label={t("activity_form.start_time")}
          type="time"
          step="900"
          min="00:00"
          max="23:59"
          value={formik.values.startTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={styles.startTime}
        >
          {formik.errors.startTime && formik.touched.startTime ? (
            <div>{formik.errors.startTime}</div>
          ) : null}
        </FloatingLabelInput>
        <FloatingLabelInput
          name="endTime"
          label={t("activity_form.end_time")}
          type="time"
          step="900"
          min="00:00"
          max="23:59"
          value={formik.values.endTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={styles.endTime}
        >
          {endTimeHasError ? <div>{formik.errors.endTime}</div> : null}
        </FloatingLabelInput>
        <div className={styles.duration}>
          <span>{t("activity_form.duration")}</span>
          <span>
            {endTimeHasError
              ? "-"
              : getHumanizedDuration(
                  parse(formik.values.startTime, "HH:mm", new Date()),
                  parse(formik.values.endTime, "HH:mm", new Date())
                )}
          </span>
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
              >
                {selectsMode
                  ? t("activity_form.back_to_frequent_roles")
                  : t("activity_form.add_role")}
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
        <div className={styles.billable}>
          <label>
            <input
              type="radio"
              name="billable"
              value="yes"
              data-testid={"billable_yes"}
              checked={formik.values.billable === "yes"}
              onChange={formik.handleChange}
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="billable"
              value="no"
              data-testid={"billable_no"}
              checked={formik.values.billable === "no"}
              onChange={formik.handleChange}
            />
            No
          </label>
        </div>
        <FloatingLabelInput
          name="description"
          label={t("activity_form.description")}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={styles.description}
          isTextArea={true}
        >
          {formik.errors.description && formik.touched.description ? (
            <div>{formik.errors.description}</div>
          ) : null}
        </FloatingLabelInput>
        <button data-testid="save_activity">Save activity</button>
      </form>
      <pre
        style={{
          background: "#f6f8fa",
          fontSize: ".65rem",
          padding: ".5rem"
        }}
      >
        <strong>props</strong> = {JSON.stringify(formik.values, null, 2)}
      </pre>
    </React.Fragment>
  );
};

export default ActivityForm;

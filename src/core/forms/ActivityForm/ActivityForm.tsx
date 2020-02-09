import React, {useContext, useMemo, useState} from "react"
import {Field, Formik} from "formik"
import TextField from "core/components/TextField/TextField"
import {addMinutes, differenceInMinutes, format, isAfter, parse} from "date-fns"
import * as Yup from "yup"
import styles from "core/forms/ActivityForm/ActivityForm.module.css"
import {getHumanizedDuration} from "core/forms/ActivityForm/TimeUtils"
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
  lastEndTime?: string;
  /** Last activity role or activity edit */
  // Cuando exista el rol significa que existen roles frequentes.
  initialSelectedRole?: IProjectRole;
  onAfterSubmit: () => void;
}

interface Values {
  startTime: string,
  endTime: string,
  organization?: IOrganization
  project?: IProject
  role?: IProjectRole
  billable: "yes" | "no"
  description: string
}

const ActivityForm: React.FC<IActivityForm> = props => {
  const { t } = useTranslation();
  const { dispatch } = useContext(BinnacleDataContext);
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
        billable: props.activity.billable ? "yes" : "no",
        description: props.activity.description
      };
    }

    return {
      startTime: props.lastEndTime ?? "09:00",
      endTime: "13:00",
      organization: roleFound?.organization,
      project: roleFound?.project,
      role: roleFound?.role,
      billable: "no",
      description: ""
    };
  }, [props.activity, props.lastEndTime, roleFound]);

  const handleSubmit = async (values: Values, formikHelpers: FormikHelpers<Values>) => {
    // TODO CHECK ERROR
    if (props.activity) {
      const startDate = parse(
        values.startTime,
        "HH:mm",
        props.activity.startDate
      );
      const endTime = parse(values.endTime, "HH:mm", props.activity.startDate);
      const duration = differenceInMinutes(endTime, startDate);

      await updateActivity({
        startDate: startDate,
        billable: values.billable === "yes",
        description: values.description,
        duration: duration,
        projectRoleId: values.role!.id,
        id: props.activity.id
      });

      props.onAfterSubmit();
    } else {
      const currentDate = new Date();
      const startDate = parse(values.startTime, "HH:mm", currentDate);
      const endTime = parse(values.endTime, "HH:mm", currentDate);
      const duration = differenceInMinutes(endTime, startDate);

      console.log(values, "role", values.role)

      // TODO CHECK ENTITIES EXISTS
      const response = await createActivity({
        billable: values.billable === "yes",
        description: values.description,
        duration: duration,
        startDate: startDate,
        projectRoleId: values.role!.id
      });

      dispatch(BinnacleActions.createActivity(response));

      props.onAfterSubmit();
    }

    console.log("Is Working", JSON.stringify(values, null, 2));
    // alert(JSON.stringify(values, null, 2))
  };

  // console.log("formikErrors", formik.errors);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ActivityFormSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
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
              <span>{t("activity_form.duration")}</span>
              <span>
                {formik.errors.endTime && formik.touched.endTime
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
            <div className={styles.billable}>
              <label>
                <input
                  type="radio"
                  name="billable"
                  value="yes"
                  data-testid="billable_yes"
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
                  data-testid="billable_no"
                  checked={formik.values.billable === "no"}
                  onChange={formik.handleChange}
                />
                No
              </label>
            </div>
            <Field
              name="description"
              label={t("activity_form.description")}
              as={TextField}
              className={styles.description}
              isTextArea={true}
            >
              <FieldMessage
                isError={formik.errors.description && formik.touched.description}
                errorText={formik.errors.description}
              />
            </Field>
          </div>
          <ActivityFormFooter
            id={props.activity?.id}
            onSave={() => console.log('onSave called')}
            onRemove={props.onAfterSubmit}
          />
        </form>
      )}
    </Formik>
  );
};

export default ActivityForm;
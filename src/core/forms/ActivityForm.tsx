import React, {useEffect, useState} from "react"
import {useFormik} from "formik"
import FloatingLabelInput from "core/components/FloatingLabelInput"
import {differenceInMinutes, getMinutes, isAfter, parse, setMinutes} from "date-fns"
import * as Yup from "yup"
import Combobox from "core/components/Combobox"
import styles from "./ActivityForm.module.css"

const calculateDifferenceInMinutes = (endDate: Date, startDate: Date) => {
  const duration = differenceInMinutes(endDate, startDate);
  return duration / 60;
};

const optionsDefault = new Array(10).fill(null).map((value, index, array) => ({
  id: index,
  name: `Test ${index}`,
}));

export const getNearestMinutes = (date: Date, interval: number): Date => {
  const roundMinutes = Math.round(getMinutes(date) / interval) * interval;
  return setMinutes(date, roundMinutes);
};

const organizationOptionsMock = [
  {
    id: 1,
    name: "Autentia"
  },
  {
    id: 2,
    name: "Adidas"
  },
  {
    id: 3,
    name: "Nike"
  },
  {
    id: 4,
    name: "Puma"
  }
];

const projectOptionsMock = [
  {
    id: 1,
    name: "Maquetador"
  },
  {
    id: 2,
    name: "Diseñador"
  },
  {
    id: 3,
    name: "User Experience"
  }
];

export const getHumanizedDuration = (
  dateLeft: Date,
  dateRight: Date
): string => {
  const durationInMinutes = differenceInMinutes(dateLeft, dateRight);
  const hours = Math.trunc(durationInMinutes / 60);
  const hoursMsg = "h";
  const minutes = durationInMinutes % 60;
  const minutesMsg = "m";

  return `${Math.abs(hours)}${hoursMsg} ${Math.abs(
    minutes
  )}${minutesMsg}`.replace(/^0h | 0m$/, "");
};

export const getHumanizedDurationWithoutMsg = (
  durationInMinutes: number
): string => {
  const hours = Math.trunc(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const minutesPrefix = Math.abs(minutes) < 10 ? "0" : "";

  return `${Math.abs(hours)}:${minutesPrefix}${Math.abs(minutes)}`;
};

// @ts-ignore
const getOrganizationsMock = (t: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(organizationOptionsMock), t)
  })
}


// @ts-ignore
const projectsByOrganizationMock = (t: number, organizationId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (organizationId === 1) {
        return resolve(projectOptionsMock)
      } else {
        return resolve(projectOptionsMock.slice(2))
      }
    }, t)
  })
}


const ActivityFormSchema = Yup.object().shape({
  startTime: Yup.string().required("Required"),
  /*    .test("is-greater", "end time should be greater", function (value) {
        const {endTime} = this.parent
        return moment(value, "HH:mm").isSameOrAfter(moment(start, "HH:mm"))
      }),*/
  endTime: Yup.string()
    .required("Required")
    .test("is-greater", "End time should be greater", function(value) {
      const { startTime } = this.parent;
      const startDate = parse(startTime, "HH:mm", new Date());
      const endDate = parse(value, "HH:mm", new Date());

      // console.log(startDate, endDate);

      return isAfter(endDate, startDate);
    }),
  organization: Yup.string().required("Required")
});

const ActivityForm = () => {
  const formik = useFormik({
    initialValues: {
      startTime: "09:00",
      endTime: "13:00",
      organization: organizationOptionsMock[0],
      project: projectOptionsMock[0],
      role: "Nada",
      billable: "no",
      description: "Hi from venezuela"
    },
    validationSchema: ActivityFormSchema,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  const [organizationOptions, setOrganizationOptions] = useState<any>([]);
  const [projectOptions, setProjectOptions] = useState<any>([])

  useEffect(() => {
    getOrganizationsMock(200).then(organizations => setOrganizationOptions(organizations))
  }, [])

  const handleOrganizationChange = async (a: any) => {
    formik.setFieldValue("organization", a.selectedItem);

    await projectsByOrganizationMock(200, a.selectedItem.id).then(projects => setProjectOptions(projects))
  };

  const handleProjectChange = (a: any) => {
    formik.setFieldValue("project", a.selectedItem);
  }

  return (
    <React.Fragment>
      <form className={styles.base} onSubmit={formik.handleSubmit}>
        <FloatingLabelInput
          name="startTime"
          label="Hora inicio"
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
          label="Hora fin"
          type="time"
          step="900"
          min="00:00"
          max="23:59"
          value={formik.values.endTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={styles.endTime}
        >
          {formik.errors.endTime && formik.touched.endTime ? (
            <div>{formik.errors.endTime}</div>
          ) : null}
        </FloatingLabelInput>
        <p className={styles.duration}>
          Duración:{" "}
          {getHumanizedDuration(
            parse(formik.values.startTime, "HH:mm", new Date()),
            parse(formik.values.endTime, "HH:mm", new Date())
          )}
        </p>
        <Combobox
          label="Organización"
          name="organization"
          options={organizationOptions}
          initialSelectedItem={formik.values.organization}
          onChange={handleOrganizationChange}
          wrapperClassname={styles.organization}
          isLoading={true}
        />
        {formik.errors.organization && formik.touched.organization ? (
          <div>{formik.errors.organization}</div>
        ) : null}
        <Combobox
          label="Proyecto"
          name="project"
          options={projectOptions}
          initialSelectedItem={formik.values.project}
          onChange={handleProjectChange}
          wrapperClassname={styles.project}
          isLoading={true}
        />
        {formik.errors.project && formik.touched.project ? (
          <div>{formik.errors.project}</div>
        ) : null}
        <FloatingLabelInput
          name="role"
          label="Rol"
          type="text"
          value={formik.values.role}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={styles.role}
        />
        {formik.errors.role && formik.touched.role ? (
          <div>{formik.errors.role}</div>
        ) : null}
        <div className={styles.billable}>
          <label>
            <input
              type="radio"
              name="billable"
              value="yes"
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
              checked={formik.values.billable === "no"}
              onChange={formik.handleChange}
            />
            No
          </label>
        </div>
        <FloatingLabelInput
          name="description"
          label="Descripción"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={styles.description}
          isTextArea={true}
        />
        {formik.errors.description && formik.touched.description ? (
          <div>{formik.errors.description}</div>
        ) : null}
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

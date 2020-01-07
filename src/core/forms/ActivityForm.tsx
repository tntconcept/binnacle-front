import React from "react"
import {useFormik} from "formik"
import FloatingLabelInput from "core/components/FloatingLabelInput"
import {differenceInMinutes, getMinutes, isAfter, parse, setMinutes} from "date-fns"
import * as Yup from "yup"
import Combobox from "core/components/Combobox"

const calculateDifferenceInMinutes = (endDate: Date, startDate: Date) => {
  const duration = differenceInMinutes(endDate, startDate);
  return duration / 60;
};

export const getNearestMinutes = (date: Date, interval: number): Date => {
  const roundMinutes = Math.round(getMinutes(date) / interval) * interval;
  return setMinutes(date, roundMinutes);
};

const items = [
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

      console.log(startDate, endDate);

      return isAfter(endDate, startDate);
    }),
  organization: Yup.string().required("Required")
});

const ActivityForm = () => {
  const formik = useFormik({
    initialValues: {
      startTime: "09:00",
      endTime: "13:00",
      organization: "Autentia",
      project: "Loco",
      role: "Nada",
      billable: "no",
      description: "Hi from venezuela"
    },
    validationSchema: ActivityFormSchema,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
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
      />
      {formik.errors.startTime && formik.touched.startTime ? (
        <div>{formik.errors.startTime}</div>
      ) : null}
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
      />
      {formik.errors.endTime && formik.touched.endTime ? (
        <div>{formik.errors.endTime}</div>
      ) : null}
      <p>
        Duración:{" "}
        {getHumanizedDuration(
          parse(formik.values.startTime, "HH:mm", new Date()),
          parse(formik.values.endTime, "HH:mm", new Date())
        )}
      </p>
      <FloatingLabelInput
        name="organization"
        label="Organización"
        type="text"
        value={formik.values.organization}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.errors.organization && formik.touched.organization ? (
        <div>{formik.errors.organization}</div>
      ) : null}
      <FloatingLabelInput
        name="project"
        label="Proyecto"
        type="text"
        value={formik.values.project}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
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
      />
      {formik.errors.role && formik.touched.role ? (
        <div>{formik.errors.role}</div>
      ) : null}
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
      <FloatingLabelInput
        name="description"
        label="Descripción"
        type="textarea"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.errors.description && formik.touched.description ? (
        <div>{formik.errors.description}</div>
      ) : null}
      <Combobox
        label="Organización"
        name="organization"
        items={items}
      />
      <pre
        style={{
          background: "#f6f8fa",
          fontSize: ".65rem",
          padding: ".5rem"
        }}
      >
        <strong>props</strong> = {JSON.stringify(formik.values, null, 2)}
      </pre>
    </form>
  );
};

export default ActivityForm;

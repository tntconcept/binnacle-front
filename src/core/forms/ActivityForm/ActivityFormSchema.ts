import * as Yup from "yup"
import i18n from "i18n"
import {isAfter, parse} from "date-fns"

export const ActivityFormSchema = Yup.object().shape({
  startTime: Yup.string().required(i18n.t("form_errors.field_required")),
  endTime: Yup.string()
    .required(i18n.t("form_errors.field_required"))
    .test("is-greater", i18n.t("form_errors.end_time_greater"), function(
      value
    ) {
      const { startTime } = this.parent;
      const startDate = parse(startTime, "HH:mm", new Date());
      const endDate = parse(value, "HH:mm", new Date());
      return isAfter(endDate, startDate);
    }),
  recentRole: Yup.object().required(i18n.t("form_errors.field_required")),
  billable: Yup.string().required(i18n.t("form_errors.field_required")),
  description: Yup.string()
    .required(i18n.t("form_errors.field_required"))
    .max(1024, i18n.t("form_errors.max_length"))
});

export const ActivityFormSchemaWithSelectRole = Yup.object().shape({
  startTime: Yup.string().required(i18n.t("form_errors.field_required")),
  endTime: Yup.string()
    .required(i18n.t("form_errors.field_required"))
    .test("is-greater", i18n.t("form_errors.end_time_greater"), function(
      value
    ) {
      const { startTime } = this.parent;
      const startDate = parse(startTime, "HH:mm", new Date());
      const endDate = parse(value, "HH:mm", new Date());
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

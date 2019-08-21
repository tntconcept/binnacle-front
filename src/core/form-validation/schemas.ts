import * as Yup from "yup";
import i18n from "i18n";

export const LoginSchema = Yup.object().shape({
  username: Yup.string().required(i18n.t("form_errors.field_required")),
  password: Yup.string().required(i18n.t("form_errors.field_required"))
});

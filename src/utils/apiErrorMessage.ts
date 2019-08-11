import axios, { AxiosError } from "axios";
import i18n from "../i18n";

interface ICustomStatusMessages {
  [key: number]: string;
}

const statusCodeMap: ICustomStatusMessages = {
  401: i18n.t("api_errors.unauthorized"),
  403: i18n.t("api_errors.forbidden"),
  404: i18n.t("api_errors.not_found"),
  408: i18n.t("api_errors.timeout"),
  500: i18n.t("api_errors.server_error"),
  503: i18n.t("api_errors.server_down"),
  600: i18n.t("api_errors.unknown")
};

const getTimeoutOrUnknownStatusCode = (error: AxiosError) => {
  // Axios timeouts the request because was longer than the seconds established.
  if (error.code === "ECONNABORTED") {
    return 408;
  } else if (!error.response) {
    // Network error -> Server is down
    return 503;
  } else {
    // Unknown error, CORS maybe
    return 600;
  }
};

const getMessageByStatusCode = (
  error: AxiosError,
  customStatusCodeMessages: ICustomStatusMessages = {}
) => {
  const statusCode =
    error.response === undefined
      ? getTimeoutOrUnknownStatusCode(error)
      : error.response.status;

  const text = { ...statusCodeMap, ...customStatusCodeMessages };

  return text[statusCode] || text[600];
};

const getErrorMessage = (
  error: AxiosError,
  overrideStatusCodeMessages: ICustomStatusMessages = {}
) => {
  if (!axios.isCancel(error)) {
    return getMessageByStatusCode(error, overrideStatusCodeMessages);
  } else {
    if (process.env.NODE_ENV !== "production") {
      let messageLog: string;

      if (error.message) {
        messageLog = `, message:: ${error.message}`;
      } else {
        messageLog = "without any message";
      }

      // eslint-disable-next-line
      console.log(`The request was cancelled ${messageLog}`);
    }
  }
};

export default getErrorMessage;

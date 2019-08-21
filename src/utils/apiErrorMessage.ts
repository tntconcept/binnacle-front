import axios, { AxiosError } from "axios";
import i18n from "../i18n";

interface ICustomStatusMessages {
  [key: number]: {
    title: string;
    description: string;
  };
}

const statusCodeMap: ICustomStatusMessages = {
  401: {
    title: i18n.t("api_errors.unauthorized"),
    description: i18n.t("api_errors.unauthorized_description")
  },
  403: {
    title: i18n.t("api_errors.forbidden"),
    description: i18n.t("api_errors.forbidden_description")
  },
  404: {
    title: i18n.t("api_errors.not_found"),
    description: i18n.t("api_errors.general_description")
  },
  408: {
    title: i18n.t("api_errors.timeout"),
    description: i18n.t("api_errors.general_description")
  },
  500: {
    title: i18n.t("api_errors.server_error"),
    description: i18n.t("api_errors.general_description")
  },
  503: {
    title: i18n.t("api_errors.server_down"),
    description: i18n.t("api_errors.general_description")
  },
  600: {
    title: i18n.t("api_errors.unknown"),
    description: i18n.t("api_errors.general_description")
  }
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

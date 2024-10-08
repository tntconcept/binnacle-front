import { i18n } from '../../i18n/i18n'

export interface CustomStatusMessages {
  [key: string]: {
    title: string
    description: string
  }
}

export const statusCodeMap: CustomStatusMessages = {
  '401': {
    title: i18n.t('api_errors.session_expired'),
    description: i18n.t('api_errors.session_expired_description')
  },
  '403': {
    title: i18n.t('api_errors.forbidden'),
    description: i18n.t('api_errors.forbidden_description')
  },
  '404': {
    title: i18n.t('api_errors.not_found'),
    description: i18n.t('api_errors.general_description')
  },
  '408': {
    title: i18n.t('api_errors.timeout'),
    description: i18n.t('api_errors.general_description')
  },
  '500': {
    title: i18n.t('api_errors.server_error'),
    description: i18n.t('api_errors.general_description')
  },
  '503': {
    title: i18n.t('api_errors.server_down'),
    description: i18n.t('api_errors.general_description')
  },
  offline: {
    title: i18n.t('api_errors.offline'),
    description: i18n.t('api_errors.offline_description')
  },
  unknown: {
    title: i18n.t('api_errors.unknown'),
    description: i18n.t('api_errors.general_description')
  }
}

const getTimeoutOrUnknownStatusCode = (error: any) => {
  if (!navigator.onLine) {
    return 'offline'
  } else if (error.name === 'TimeoutError') {
    return 408
  } else if (!error.response) {
    // Network error -> Server is down
    return 503
  } else if (error.response.status !== null) {
    return error.response.status
  } else {
    // Unknown error, CORS maybe
    return 'unknown'
  }
}

const getMessageByStatusCode = (
  error: any,
  customStatusCodeMessages: CustomStatusMessages = {}
) => {
  const statusCode = getTimeoutOrUnknownStatusCode(error)
  const text = { ...statusCodeMap, ...customStatusCodeMessages }

  return text[statusCode] || text['unknown']
}

export const getMessageByHttpStatusCode = (
  error: any,
  overrideStatusCodeMessages: CustomStatusMessages = {}
) => {
  return getMessageByStatusCode(error, overrideStatusCodeMessages)
}

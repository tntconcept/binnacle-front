import i18n from 'shared/i18n/i18n'

export interface ICustomStatusMessages {
  [key: string]: {
    title: string
    description: string
  }
}

export const statusCodeMap: ICustomStatusMessages = {
  '401': {
    title: i18n.t('api_errors.unauthorized'),
    description: i18n.t('api_errors.unauthorized_description')
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
  },
  sessionExpired: {
    title: i18n.t('api_errors.session_expired'),
    description: i18n.t('api_errors.session_expired_description')
  }
}

const getTimeoutOrUnknownStatusCode = (error: any) => {
  const isRefreshTokenError =
    error.response?.status === 401 && error.config.params['grant_type'] === 'refresh_token'
  if (!navigator.onLine) {
    return 'offline'
  } else if (error.name === 'TimeoutError') {
    return 408
  } else if (!error.response) {
    // Network error -> Server is down
    return 503
  } else if (isRefreshTokenError) {
    return 'sessionExpired'
  } else if (error.response.status !== null) {
    return error.response.status
  } else {
    // Unknown error, CORS maybe
    return 'unknown'
  }
}

const getMessageByStatusCode = (
  error: any,
  customStatusCodeMessages: ICustomStatusMessages = {}
) => {
  const statusCode = getTimeoutOrUnknownStatusCode(error)
  const text = { ...statusCodeMap, ...customStatusCodeMessages }

  return text[statusCode] || text['unknown']
}

const getMessageByHttpStatusCode = (
  error: any,
  overrideStatusCodeMessages: ICustomStatusMessages = {}
) => {
  return getMessageByStatusCode(error, overrideStatusCodeMessages)
}

export default getMessageByHttpStatusCode

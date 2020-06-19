import i18n from 'i18n'

interface ICustomStatusMessages {
  [key: string]: {
    title: string
    description: string
  }
}

const statusCodeMap: ICustomStatusMessages = {
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
  }
}

const getTimeoutOrUnknownStatusCode = (error: any) => {
  if (!navigator.onLine) {
    return 'offline'
  }

  if (error.name === 'TimeoutError') {
    return 408
  } else if (!error.response) {
    // Network error -> Server is down
    return 503
  } else {
    // Unknown error, CORS maybe
    return 'unknown'
  }
}

const getMessageByStatusCode = (
  error: any,
  customStatusCodeMessages: ICustomStatusMessages = {}
) => {
  const statusCode =
    error.response === undefined
      ? getTimeoutOrUnknownStatusCode(error)
      : error.response.status

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

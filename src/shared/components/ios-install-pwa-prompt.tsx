import { useTranslation } from 'react-i18next'
import PWAPrompt from 'react-ios-pwa-prompt'

const isHttps = window.location.protocol === 'https:'
const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent)

export const IosInstallPwaPrompt = () => {
  const { t } = useTranslation()

  const canShowIOSPrompt = isHttps && isSafari

  return canShowIOSPrompt ? (
    <PWAPrompt
      timesToShow={3}
      permanentlyHideOnDismiss={false}
      copyTitle={t('ios_install_pwa.title')}
      copyBody={t('ios_install_pwa.body')}
      copyShareButtonLabel={t('ios_install_pwa.share_button')}
      copyAddHomeButtonLabel={t('ios_install_pwa.add_home_button')}
      copyClosePrompt={t('close')}
      debug={false}
    />
  ) : null
}

import { Button } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { googleLoginUrl } from '../../../../../shared/api/url'
import { GoogleIcon } from './google-icon'
import { FC } from 'react'

export const SignInWithGoogleButton: FC = () => {
  const { t } = useTranslation()

  const onClick = () => {
    window.location.assign(googleLoginUrl)
  }

  return (
    <Button
      type="button"
      colorScheme="brand"
      variant="solid"
      onClick={onClick}
      leftIcon={<GoogleIcon fill="white" boxSize={4} mr={4} />}
    >
      {t('login_page.sign_in_with_google')}
    </Button>
  )
}

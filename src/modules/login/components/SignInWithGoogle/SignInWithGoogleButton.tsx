import { Button } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import endpoints from 'shared/api/endpoints'
import { GoogleIcon } from './GoogleIcon'

export const SignInWithGoogleButton: React.FC = () => {
  const { t } = useTranslation()

  const onClick = () => {
    window.location.assign(endpoints.googleLogin)
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

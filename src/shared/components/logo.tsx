import { Button, useColorModeValue } from '@chakra-ui/react'
import { ReactComponent as LogoImage } from '../../assets/logo.svg'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  size: 'sm' | 'lg'
  onClick?: () => void
}

export const Logo: FC<Props> = (props) => {
  const borderHoverColor = useColorModeValue('brand.600', 'white')
  const { t } = useTranslation()

  const getLogo = () => {
    if (props.size === 'sm') {
      return (
        <LogoImage
          style={{
            height: '24px',
            marginTop: '5px'
          }}
        />
      )
    }

    return (
      <LogoImage
        style={{
          margin: '0 0 32px 0',
          display: 'block',
          width: '150px'
        }}
      />
    )
  }

  return (
    <Button
      variant="unstyled"
      display="flex"
      aria-label={props.onClick ? t('navbar.goHome') : t('navbar.logo')}
      _hover={{
        color: borderHoverColor
      }}
      onClick={props.onClick}
      justifyContent="center"
    >
      {getLogo()}
    </Button>
  )
}

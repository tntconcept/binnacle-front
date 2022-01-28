import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { InputGroup, InputRightElement, Spinner } from '@chakra-ui/react'
import { FloatingLabelInput } from 'shared/components/FloatingLabelInput'

export const ComboboxInput = forwardRef<any, any>(({ isLoading, ...props }, ref) => {
  const { t } = useTranslation()

  return (
    <InputGroup size="md">
      <FloatingLabelInput
        pr="2rem"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        {...props}
        ref={ref}
      />
      <InputRightElement w="unset" h="full">
        {isLoading && <Spinner size="sm" p="8px" label={t('accessibility.loading')} />}
      </InputRightElement>
    </InputGroup>
  )
})

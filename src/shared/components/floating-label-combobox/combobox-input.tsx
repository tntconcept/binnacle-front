import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { InputGroup, InputRightElement, Spinner } from '@chakra-ui/react'
import { FloatingLabelInput } from 'shared/components/floating-label-input'
import { TimeIcon } from '@chakra-ui/icons'

export const ComboboxInput = forwardRef<any, any>(({ isLoading, inputStyle, ...props }, ref) => {
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
        {!isLoading && inputStyle === 'time' && <TimeIcon marginRight={5} />}
      </InputRightElement>
    </InputGroup>
  )
})

ComboboxInput.displayName = 'ComboboxInput'

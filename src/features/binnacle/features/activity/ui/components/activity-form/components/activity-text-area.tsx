import type { TextareaProps } from '@chakra-ui/react'
import { FormControl, FormErrorMessage, FormHelperText } from '@chakra-ui/react'
import type { FC, PropsWithRef, Ref } from 'react'
import { forwardRef } from 'react'
import type { Control } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FloatingLabelTextarea } from '../../../../../../../../shared/components/floating-label-textarea'

interface Props extends TextareaProps {
  control: Control<any>
  error?: string
}

export const ActivityTextArea: FC<PropsWithRef<Props>> = forwardRef(
  ({ control, error, ...props }: Props, ref: Ref<HTMLTextAreaElement>) => {
    const { t } = useTranslation()

    const value = useWatch({ control: control, name: 'description' })

    return (
      <FormControl gridArea="description" id="description" isInvalid={error !== undefined}>
        <FloatingLabelTextarea label={t('activity_form.description')} ref={ref} {...props} />
        <FormHelperText float="right">{`${value?.length ?? 0} / 2048`}</FormHelperText>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    )
  }
)

ActivityTextArea.displayName = 'ActivityTextArea'

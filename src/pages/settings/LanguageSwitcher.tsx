import React, { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Stack } from '@chakra-ui/core'
import { Field, FieldProps } from 'formik'
import { MyLabel } from 'core/components/MyLabel'

interface Props {
  changeLanguage: (lng: string) => void
}

export const LanguageSwitcher: React.FC<Props> = (props) => {
  const { t } = useTranslation()

  const handleChange = (event: ChangeEvent<HTMLInputElement>, inputChangeCb: any) => {
    props.changeLanguage(event.target.value)
    inputChangeCb(event)
  }

  return (
    <Box as="fieldset" border="none" p="0">
      <Box as="legend" p="0">
        {t('settings.language')}
      </Box>
      <Stack direction="row">
        <Field name="language">
          {({ field }: FieldProps) => (
            <MyLabel htmlFor="language-es">
              <input
                type="radio"
                id="language-es"
                {...field}
                value="es"
                onChange={(e) => handleChange(e, field.onChange)}
                defaultChecked={field.value === 'es'}
              />{' '}
              Español
            </MyLabel>
          )}
        </Field>
        <Field name="language">
          {({ field }: FieldProps) => (
            <MyLabel htmlFor="language-en">
              <input
                type="radio"
                id="language-en"
                {...field}
                value="en"
                onChange={(e) => handleChange(e, field.onChange)}
                defaultChecked={field.value === 'en'}
              />{' '}
              English
            </MyLabel>
          )}
        </Field>
      </Stack>
    </Box>
  )
}

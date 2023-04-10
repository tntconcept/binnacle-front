import { Box, Checkbox, Flex, Grid } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TimeField } from 'shared/components/FormFields/TimeField'
import { useIsMobile } from 'shared/hooks'
import DateField from 'shared/components/FormFields/DateField'
import { ActivityFormSchema } from './activity-form.schema'
import DurationText from './components/duration-text'
import { SelectRoleSection } from './components/select-role-section'

export const ACTIVITY_FORM_ID = 'activity-form-id'

export const ActivityForm: FC = () => {
  const { t } = useTranslation()
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useFormContext<ActivityFormSchema>()
  const isMobile = useIsMobile()
  const [isInDayRole] = useState<boolean>()
  const [isBillable] = useState<boolean>()

  return (
    <Grid
      templateColumns="repeat(6, [col] 1fr)"
      templateRows="repeat(2, [row] auto)"
      templateAreas={templateAreas}
      gap="16px"
      p="16px"
      as="form"
      noValidate={true}
      // @ts-ignore
      onSubmit={handleSubmit}
      data-testid="activity_form"
      id={ACTIVITY_FORM_ID}
    >
      <SelectRoleSection
        gridArea="role"
        control={control}
        onSelect={(projectRole) => {
          setValue('projectRole', projectRole)
        }}
      />

      {!isInDayRole && (
        <>
          <Box gridArea="start">
            <TimeField
              label={t('activity_form.start_time')}
              {...register('start')}
              error={errors.start?.message}
            />
          </Box>
          <Box gridArea="end">
            <TimeField
              label={t('activity_form.end_time')}
              {...register('end')}
              error={errors.end?.message}
            />
          </Box>
        </>
      )}
      {isInDayRole && (
        <>
          <Box gridArea="start">
            <DateField
              label={t('activity_form.start_date')}
              error={errors.start?.message}
              {...register('start')}
            />
          </Box>
          <Box gridArea="end">
            <DateField
              label={t('activity_form.end_date')}
              error={errors.end?.message}
              {...register('end')}
            />
          </Box>
        </>
      )}
      <Flex gridArea="duration" justify="space-between" align="center">
        <DurationText control={control} useDecimalTimeFormat={false} />
      </Flex>

      <Box gridArea="billable">
        <Controller
          control={control}
          name="billable"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Checkbox
              defaultChecked={value}
              isChecked={value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              colorScheme="brand"
              disabled={!isBillable}
            >
              {t('activity_form.billable')}
            </Checkbox>
          )}
        />
      </Box>
      {/* <ActivityTextArea */}
      {/*   {...register('description')} */}
      {/*   control={control} */}
      {/*   error={errors.description?.message} */}
      {/*   labelBgColorDarkTheme={isMobile ? 'gray.800' : 'gray.700'} */}
      {/* /> */}
      {/* TODO */}
      {/* <ImageField */}
      {/*   control={control} */}
      {/*   gridArea="image" */}
      {/*   setImageValue={setImageValue} */}
      {/*   {...register('imageBase64')} */}
      {/* /> */}
    </Grid>
  )
}

const mobileAreas = `
  "role role role role role role"
  "start start start end end end"
  "duration duration duration duration duration duration"
  "billable billable billable billable billable billable"
  "description description description description description description"
  "image image image image image image"
`

const desktopAreas = `
  "role role role role role role"
  "start start end end duration duration"
  "billable billable billable billable billable billable"
  "description description description description description description"
  "image image image image image image"
`

const templateAreas = [mobileAreas, desktopAreas]

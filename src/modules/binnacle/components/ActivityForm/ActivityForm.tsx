import { Box, Checkbox, Flex, Grid } from '@chakra-ui/react'
import type { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import ActivityTextArea from 'modules/binnacle/components/ActivityForm/components/ActivityTextArea'
import SelectRoleSection from 'modules/binnacle/components/ActivityForm/components/SelectRoleSection'
import ImageField from 'modules/binnacle/components/ActivityForm/components/ImageFieldV2'
import type { RecentRole } from 'modules/binnacle/data-access/interfaces/recent-role'
import { FC, useMemo, useState } from 'react'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TimeField } from 'shared/components/FormFields/TimeField'
import chrono from 'shared/utils/chrono'
import DurationText from './components/DurationText'
import { useIsMobile } from 'shared/hooks'
import { useGlobalState } from '../../../../shared/arch/hooks/use-global-state'
import { ActivityFormState } from '../../data-access/state/activity-form-state'
import { GetActivityImageAction } from '../../data-access/actions/get-activity-image-action'
import { useActionLoadable } from '../../../../shared/arch/hooks/use-action-loadable'
import { useAction } from 'shared/arch/hooks/use-action'
import { AddRecentRoleAction } from 'modules/binnacle/data-access/actions/add-recentRole-action'
import { TimeUnits } from 'shared/types/time-unit'
import DateField from 'shared/components/FormFields/DateField'

export const ACTIVITY_FORM_ID = 'activity-form-id'

export const ActivityForm: FC = () => {
  const { t } = useTranslation()
  const {
    control,
    register,
    setValue,
    formState: { errors },
    getValues,
    handleSubmit
  } = useFormContext<ActivityFormSchema>()
  const isMobile = useIsMobile()
  const { activity, initialImageFile } = useGlobalState(ActivityFormState)
  const [loadInitialImage] = useActionLoadable(GetActivityImageAction)
  const [isInDayRole, setIsInDayRole] = useState<boolean>()
  const [isBillable, setIsBillable] = useState<boolean>()

  const addRoleAction = useAction(AddRecentRoleAction)

  useEffect(() => {
    if (activity?.hasEvidence) {
      loadInitialImage(activity?.id).then(() => setValue('imageBase64', initialImageFile))
    }
  }, [setValue, initialImageFile, loadInitialImage, activity?.id, activity?.hasEvidence])

  const setImageValue = (value: string | null) => {
    setValue('imageBase64', value)
  }

  const handleToggleRecentRoles = () => {
    const [showRecentRole, recentRole] = getValues(['showRecentRole', 'recentRole'])

    if (!showRecentRole) {
      setValue('billable', recentRole!.projectBillable)
      setIsInDayRole(recentRole?.timeUnit === TimeUnits.DAY)
      setIsBillable(recentRole?.projectBillable)
    } else {
      setValue('organization', undefined)
      setValue('project', undefined)
      setValue('role', undefined)
    }

    setValue('showRecentRole', !showRecentRole)
  }

  const handleRoleChange = (role: RecentRole) => {
    setValue('recentRole', {
      id: role.id,
      name: role.name,
      projectName: role.projectName,
      projectBillable: role.projectBillable,
      organizationName: role.organizationName,
      requireEvidence: role.requireEvidence,
      // Date will be overridden in activity form
      date: chrono.now().toString(),
      timeUnit: role.timeUnit
    })

    setIsInDayRole(role.timeUnit === TimeUnits.DAY)
    setValue('billable', role.projectBillable)
    setIsBillable(role?.projectBillable)
  }

  useEffect(() => {
    if (!activity) return

    const roleFromActivity: RecentRole = {
      id: activity.projectRole.id,
      name: activity.projectRole.name,
      organizationName: activity.organization.name,
      projectBillable: activity.billable,
      projectName: activity.project.name,
      requireEvidence: activity.hasEvidence,
      // Show in format: 2020-01-30T00:00:00Z
      date: activity.interval.start.toString(),
      timeUnit: activity.interval.timeUnit
    }

    addRoleAction(roleFromActivity)
    handleRoleChange(roleFromActivity)
  }, [activity, addRoleAction])

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
        onToggleRecentRoles={handleToggleRecentRoles}
        onSelectRoleCard={handleRoleChange}
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
        <DurationText control={control} />
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
      <ActivityTextArea
        {...register('description')}
        control={control}
        error={errors.description?.message}
        labelBgColorDarkTheme={isMobile ? 'gray.800' : 'gray.700'}
      />
      <ImageField
        control={control}
        gridArea="image"
        setImageValue={setImageValue}
        {...register('imageBase64')}
      />
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

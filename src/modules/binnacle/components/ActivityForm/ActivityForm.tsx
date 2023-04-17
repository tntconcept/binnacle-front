import { Box, Checkbox, Flex, Grid } from '@chakra-ui/react'
import type { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import ActivityTextArea from 'modules/binnacle/components/ActivityForm/components/ActivityTextArea'
import SelectRoleSection from 'modules/binnacle/components/ActivityForm/components/SelectRoleSection'
import ImageField from 'modules/binnacle/components/ActivityForm/components/ImageFieldV2'
import type { RecentRole } from 'modules/binnacle/data-access/interfaces/recent-role'
import type { FC } from 'react'
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

  const addRoleAction = useAction(AddRecentRoleAction)

  useEffect(() => {
    if (activity?.hasImage) {
      loadInitialImage(activity?.id).then(() => setValue('imageBase64', initialImageFile))
    }
  }, [setValue, initialImageFile, loadInitialImage, activity?.id, activity?.hasImage])

  const setImageValue = (value: string | null) => {
    setValue('imageBase64', value)
  }

  const handleToggleRecentRoles = () => {
    const [showRecentRole, recentRole] = getValues(['showRecentRole', 'recentRole'])

    if (!showRecentRole) {
      setValue('billable', recentRole!.projectBillable)
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
      date: chrono.now().toString()
    })

    setValue('billable', role.projectBillable)
  }

  useEffect(() => {
    if (!activity) return

    const roleFromActivity: RecentRole = {
      id: activity.projectRole.id,
      name: activity.projectRole.name,
      organizationName: activity.organization.name,
      projectBillable: activity.billable,
      projectName: activity.project.name,
      requireEvidence: activity.projectRole.requireEvidence,
      // Show in format: 2020-01-30T00:00:00Z
      date: activity.startDate.toString()
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
      <Box gridArea="start">
        <TimeField
          label={t('activity_form.start_time')}
          {...register('startTime')}
          error={errors.startTime?.message}
        />
      </Box>
      <Box gridArea="end">
        <TimeField
          label={t('activity_form.end_time')}
          {...register('endTime')}
          error={errors.endTime?.message}
        />
      </Box>
      <Flex gridArea="duration" justify="space-between" align="center">
        <DurationText control={control} />
      </Flex>
      <SelectRoleSection
        gridArea="role"
        control={control}
        onToggleRecentRoles={handleToggleRecentRoles}
        onSelectRoleCard={handleRoleChange}
      />
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
  "start start start end end end"
  "duration duration duration duration duration duration"
  "role role role role role role"
  "billable billable billable billable billable billable"
  "description description description description description description"
  "image image image image image image"
`

const desktopAreas = `
  "start start end end duration duration"
  "role role role role role role"
  "billable billable billable billable billable billable"
  "description description description description description description"
  "image image image image image image"
`

const templateAreas = [mobileAreas, desktopAreas]

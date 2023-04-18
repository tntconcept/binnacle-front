import { Box, Checkbox, Flex, Grid } from '@chakra-ui/react'
import { FC, useEffect, useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from 'shared/hooks'
import DateField from 'shared/components/FormFields/DateField'
import { ActivityFormSchema, ActivityFormValidationSchema } from './activity-form.schema'
import DurationText from './components/duration-text'
import { SelectRoleSection } from './components/select-role-section'
import ActivityTextArea from './components/activity-text-area'
import { TimeUnits } from 'shared/types/time-unit'
import { TimeFieldWithSelector } from 'shared/components/FormFields/TimeFieldWithSelector'
import { Activity } from '../../../domain/activity'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { CreateActivityCmd } from '../../../application/create-activity-cmd'
import { UpdateActivityCmd } from '../../../application/update-activity-cmd'
import { GetRecentProjectRolesQry } from 'features/binnacle/features/project-role/application/get-recent-project-roles-qry'
import { yupResolver } from '@hookform/resolvers/yup'
import { GetInitialActivityFormValues } from './utils/get-initial-activity-form-values'
import { GetAutofillHours } from './utils/get-autofill-hours'
import { UserSettings } from 'features/user/features/settings/domain/user-settings'
import { NewActivity } from '../../../domain/new-activity'
import chrono, { parse } from 'shared/utils/chrono'
import { DateInterval } from 'shared/types/date-interval'
import { UpdateActivity } from '../../../domain/update-activity'
import FileField from 'shared/components/FileField'

export const ACTIVITY_FORM_ID = 'activity-form-id'

type ActivityFormProps = {
  date: Date
  activity?: Activity
  lastEndTime?: Date
  onAfterSubmit: () => void
  settings: UserSettings
}

export const ActivityForm: FC<ActivityFormProps> = (props) => {
  const { date, activity, lastEndTime, onAfterSubmit, settings } = props
  const { t } = useTranslation()
  const { useCase: createActivityCmd } = useGetUseCase(CreateActivityCmd)
  const { useCase: updateActivityCmd } = useGetUseCase(UpdateActivityCmd)
  const { result: recentRoles } = useExecuteUseCaseOnMount(GetRecentProjectRolesQry)
  const isMobile = useIsMobile()

  const initialFormValues = useMemo(() => {
    if (!settings) return

    const { getInitialFormValues } = new GetInitialActivityFormValues(
      activity,
      recentRoles || [],
      new GetAutofillHours(settings.autofillHours, settings.hoursInterval, lastEndTime),
      date
    )

    return getInitialFormValues()
  }, [activity, date, lastEndTime, recentRoles, settings])

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<ActivityFormSchema>({
    defaultValues: initialFormValues,
    resolver: yupResolver(ActivityFormValidationSchema),
    mode: 'onSubmit'
  })

  const onSubmit = async (data: ActivityFormSchema) => {
    try {
      const isNewActivity = activity?.id === undefined
      if (isNewActivity) {
        const newActivity: NewActivity = {
          description: data.description,
          billable: data.billable,
          interval,
          projectRoleId: data.projectRole!.id,
          imageFile: data.file
        }

        await createActivityCmd.execute(newActivity)
        onAfterSubmit()
      }

      const updateActivity: UpdateActivity = {
        id: activity!.id,
        description: data.description,
        billable: data.billable,
        interval,
        projectRoleId: data.projectRole!.id,
        imageFile: data.file
      }
      updateActivityCmd.execute(updateActivity)

      onAfterSubmit()
    } catch (e) {}
  }

  const [projectRole, project, startTime, endTime, startDate, endDate] = useWatch({
    control: control,
    name: ['projectRole', 'project', 'startTime', 'endTime', 'startDate', 'endDate']
  })

  const isInDayRole = useMemo(() => projectRole?.timeUnit === TimeUnits.DAYS, [projectRole])
  const isBillableProject = useMemo(() => project?.billable, [project])
  const interval: DateInterval = useMemo(
    () =>
      isInDayRole
        ? {
            start: chrono(startDate).getDate(),
            end: chrono(endDate).getDate()
          }
        : {
            start: chrono(parse(startTime, chrono.TIME_FORMAT, date)).getDate(),
            end: parse(endTime, chrono.TIME_FORMAT, date)
          },
    [startTime, endTime, startDate, endDate]
  )

  useEffect(() => {
    function setBillableProjectOnChange() {
      if (project?.billable) {
        setValue('billable', project.billable)
      }
    }

    setBillableProjectOnChange()
  }, [project, setValue])

  const onFileChanged = (files: File[]) => {
    if (!files || files.length === 0) {
      return setValue('file', undefined)
    }

    const file = files.at(0)
    const reader = new FileReader()
    reader.onloadend = () => {
      setValue('file', reader.result as string)
    }

    reader.readAsDataURL(file!)
  }

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
      onSubmit={handleSubmit(onSubmit)}
      data-testid="activity_form"
      id={ACTIVITY_FORM_ID}
    >
      <SelectRoleSection gridArea="role" control={control} />

      {!isInDayRole && (
        <>
          <Box gridArea="start">
            <TimeFieldWithSelector
              name={'startTime'}
              label={t('activity_form.start_time')}
              control={control}
              max={endTime}
            />
          </Box>
          <Box gridArea="end">
            <TimeFieldWithSelector
              name={'endTime'}
              label={t('activity_form.end_time')}
              control={control}
              min={startTime}
            />
          </Box>
        </>
      )}

      {isInDayRole && (
        <>
          <Box gridArea="start">
            <DateField
              label={t('activity_form.start_date')}
              error={errors.startDate?.message}
              {...register('startDate')}
            />
          </Box>
          <Box gridArea="end">
            <DateField
              label={t('activity_form.end_date')}
              error={errors.endDate?.message}
              {...register('endDate')}
            />
          </Box>
        </>
      )}

      <Flex gridArea="duration" justify="space-between" align="center">
        <DurationText
          useDecimalTimeFormat={settings.useDecimalTimeFormat}
          start={interval.start}
          end={interval.end}
          timeUnit={isInDayRole ? 'DAYS' : 'MINUTES'}
        />
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
              disabled={!isBillableProject}
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
      <FileField label={t('activity_form.evidences')} gridArea="image" onChange={onFileChanged} />
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

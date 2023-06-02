import { Box, Checkbox, Flex, Grid } from '@chakra-ui/react'
import { FC, useEffect, useMemo, useState } from 'react'
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
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { CreateActivityCmd } from '../../../application/create-activity-cmd'
import { UpdateActivityCmd } from '../../../application/update-activity-cmd'
import { yupResolver } from '@hookform/resolvers/yup'
import { GetInitialActivityFormValues } from './utils/get-initial-activity-form-values'
import { GetAutofillHours } from './utils/get-autofill-hours'
import { UserSettings } from 'features/user/features/settings/domain/user-settings'
import { NewActivity } from '../../../domain/new-activity'
import chrono, { parse } from 'shared/utils/chrono'
import { DateInterval } from 'shared/types/date-interval'
import { UpdateActivity } from '../../../domain/update-activity'
import FileField from 'shared/components/file-field'
import { ActivityErrorMessage } from '../../../domain/services/activity-error-message'
import { useResolve } from 'shared/di/use-resolve'
import { GetActivityImageQry } from '../../../application/get-activity-image-qry'
import { ProjectRole } from 'features/binnacle/features/project-role/domain/project-role'
import { TextField } from '../../../../../../../shared/components/FormFields/TextField'
import styles from './activity-form.module.css'

export const ACTIVITY_FORM_ID = 'activity-form-id'

type ActivityFormProps = {
  date: Date
  activity?: Activity
  lastEndTime?: Date
  recentRoles: ProjectRole[]
  onAfterSubmit: () => void
  onSubmit: () => void
  onSubmitError: () => void
  settings: UserSettings
  isReadOnly?: boolean
}

export const ActivityForm: FC<ActivityFormProps> = (props) => {
  const {
    date,
    activity,
    lastEndTime,
    onSubmit: onActivityFormSubmit,
    onAfterSubmit,
    onSubmitError,
    settings,
    recentRoles,
    isReadOnly
  } = props
  const { t } = useTranslation()
  const activityErrorMessage = useResolve(ActivityErrorMessage)
  const [isLoadingEvidences, setIsLoadingEvidences] = useState(true)
  const { useCase: getActivityImageQry } = useGetUseCase(GetActivityImageQry)
  const { useCase: createActivityCmd } = useGetUseCase(CreateActivityCmd)
  const { useCase: updateActivityCmd } = useGetUseCase(UpdateActivityCmd)
  const isMobile = useIsMobile()

  const initialFormValues = useMemo(() => {
    if (!settings) return

    const { getInitialFormValues } = new GetInitialActivityFormValues(
      activity,
      recentRoles,
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
    reset,
    formState: { errors }
  } = useForm<ActivityFormSchema>({
    defaultValues: initialFormValues,
    resolver: yupResolver(ActivityFormValidationSchema),
    mode: 'onSubmit'
  })

  useEffect(() => {
    reset({ ...initialFormValues, file })
  }, [initialFormValues])

  useEffect(() => {
    if (activity?.hasEvidences) {
      getActivityImageQry.execute(activity.id).then((imageFile) => {
        setValue('file', imageFile)
        setIsLoadingEvidences(false)
      })
      return
    }

    setIsLoadingEvidences(false)
  }, [activity])

  const onSubmit = async (data: ActivityFormSchema) => {
    const projectRoleId = data.showRecentRole ? data.recentProjectRole!.id : data.projectRole!.id
    const isNewActivity = activity?.id === undefined
    onActivityFormSubmit()

    if (isNewActivity) {
      const newActivity: NewActivity = {
        description: data.description,
        billable: data.billable,
        interval,
        projectRoleId: projectRoleId,
        imageFile: data.file,
        hasEvidences: Boolean(data.file)
      }

      await createActivityCmd
        .execute(newActivity, {
          successMessage: t('activity_form.create_activity_notification'),
          showToastError: true,
          errorMessage: activityErrorMessage.get
        })
        .catch(onSubmitError)

      return onAfterSubmit()
    }

    const updateActivity: UpdateActivity = {
      id: activity!.id,
      description: data.description,
      billable: data.billable,
      interval,
      projectRoleId: projectRoleId,
      imageFile: data.file,
      hasEvidences: Boolean(data.file)
    }
    updateActivityCmd
      .execute(updateActivity, {
        successMessage: t('activity_form.update_activity_notification')
      })
      .catch(onSubmitError)

    onAfterSubmit()
  }

  const [
    projectRole,
    project,
    startTime,
    endTime,
    startDate,
    endDate,
    recentProjectRole,
    showRecentRole,
    file
  ] = useWatch({
    control: control,
    name: [
      'projectRole',
      'project',
      'startTime',
      'endTime',
      'startDate',
      'endDate',
      'recentProjectRole',
      'showRecentRole',
      'file'
    ]
  })

  const isInDaysProjectRole = useMemo(() => {
    if (showRecentRole) {
      return recentProjectRole?.timeUnit === TimeUnits.DAYS
    }

    return projectRole?.timeUnit === TimeUnits.DAYS
  }, [projectRole, showRecentRole, recentProjectRole])

  const isBillableProject = useMemo(() => {
    if (showRecentRole) {
      return recentProjectRole?.project.billable
    }

    return project?.billable
  }, [project, showRecentRole, recentProjectRole])

  const files = useMemo(() => {
    if (!file) return

    return [file]
  }, [file])

  const interval: DateInterval = useMemo(
    () =>
      isInDaysProjectRole
        ? {
            start: chrono(startDate).getDate(),
            end: chrono(endDate).getDate()
          }
        : {
            start: chrono(parse(startTime, chrono.TIME_FORMAT, date)).getDate(),
            end: chrono(parse(endTime, chrono.TIME_FORMAT, date)).getDate()
          },
    [startTime, endTime, startDate, endDate, isInDaysProjectRole, date]
  )

  useEffect(() => {
    function setBillableProjectOnChange() {
      if (showRecentRole) {
        if (activity && activity?.project.id === recentProjectRole?.project.id) {
          setValue('billable', activity?.billable || false)
          return
        }

        setValue('billable', recentProjectRole?.project?.billable || false)
        return
      }

      if (activity && activity?.project.id === project?.id) {
        setValue('billable', activity?.billable || false)
        return
      }

      setValue('billable', project?.billable || false)
    }

    setBillableProjectOnChange()
  }, [activity, showRecentRole, project, setValue, recentProjectRole])

  const onFileChanged = async (files: File[]) => {
    if (!files || files.length === 0) {
      return setValue('file', undefined)
    }

    setValue('file', files[0])
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
      className={isReadOnly ? styles.readOnly : ''}
    >
      <SelectRoleSection gridArea="role" control={control} isReadOnly={isReadOnly} />

      {activity?.userName && (
        <Flex
          gridArea="employee"
          justify="flex-start"
          align="flex-start"
          wrap="wrap"
          position="relative"
          maxWidth={'265px'}
          marginBottom={4}
        >
          <TextField
            label={t('activity_form.employee')}
            name={'employee'}
            value={activity?.userName}
            isDisabled={true}
            onChange={() => {}}
          />
        </Flex>
      )}

      {!isInDaysProjectRole && (
        <>
          <Box gridArea="start">
            <TimeFieldWithSelector
              name={'startTime'}
              label={t('activity_form.start_time')}
              control={control}
              max={endTime}
              isReadOnly={isReadOnly}
            />
          </Box>
          <Box gridArea="end">
            <TimeFieldWithSelector
              name={'endTime'}
              label={t('activity_form.end_time')}
              control={control}
              min={startTime}
              isReadOnly={isReadOnly}
            />
          </Box>
        </>
      )}

      {isInDaysProjectRole && (
        <>
          <Box gridArea="start">
            <DateField
              label={t('activity_form.start_date')}
              error={errors.startDate?.message}
              {...register('startDate')}
              isReadOnly={isReadOnly}
            />
          </Box>
          <Box gridArea="end">
            <DateField
              label={t('activity_form.end_date')}
              error={errors.endDate?.message}
              {...register('endDate')}
              isReadOnly={isReadOnly}
            />
          </Box>
        </>
      )}

      <Flex
        gridArea="duration"
        justify="space-between"
        align="center"
        wrap="wrap"
        position="relative"
      >
        <DurationText
          useDecimalTimeFormat={settings?.useDecimalTimeFormat}
          start={interval.start}
          end={interval.end}
          timeUnit={isInDaysProjectRole ? 'DAYS' : 'MINUTES'}
          maxAllowed={showRecentRole ? recentProjectRole?.maxAllowed : projectRole?.maxAllowed}
          remaining={showRecentRole ? recentProjectRole?.remaining : projectRole?.remaining}
        />
      </Flex>

      {!isReadOnly && (
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
                disabled={!isBillableProject || isReadOnly}
              >
                {t('activity_form.billable')}
              </Checkbox>
            )}
          />
        </Box>
      )}

      <ActivityTextArea
        {...register('description')}
        control={control}
        error={errors.description?.message}
        labelBgColorDarkTheme={isMobile ? 'gray.800' : 'gray.700'}
        isDisabled={isReadOnly}
      />

      <FileField
        label={t('activity_form.evidences')}
        gridArea="image"
        onChange={onFileChanged}
        files={files}
        isLoading={isLoadingEvidences}
        isReadOnly={isReadOnly}
      />
    </Grid>
  )
}

const mobileAreas = `
  "employee employee employee employee employee employee"
  "role role role role role role"
  "start start start end end end"
  "duration duration duration duration duration duration"
  "billable billable billable billable billable billable"
  "description description description description description description"
  "image image image image image image"
`

const desktopAreas = `
  "employee employee employee employee employee employee"
  "role role role role role role"
  "start start end end duration duration"
  "billable billable billable billable billable billable"
  "description description description description description description"
  "image image image image image image"
`

const templateAreas = [mobileAreas, desktopAreas]

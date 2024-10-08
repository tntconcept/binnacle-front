import { Box, Checkbox, Flex, Grid } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { ProjectRole } from '../../../../project-role/domain/project-role'
import { UserSettings } from '../../../../../../shared/user/features/settings/domain/user-settings'
import { FC, useEffect, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from '../../../../../../../shared/arch/hooks/use-get-use-case'
import { FileField } from '../../../../../../../shared/components/file-field'
import { DateField } from '../../../../../../../shared/components/form-fields/date-field'
import { TimeFieldWithSelector } from '../../../../../../../shared/components/form-fields/time-field-with-selector'
import { useResolve } from '../../../../../../../shared/di/use-resolve'
import { DateInterval } from '../../../../../../../shared/types/date-interval'
import { chrono, parse } from '../../../../../../../shared/utils/chrono'
import { TextField } from '../../../../../../../shared/components/form-fields/text-field'
import { CreateActivityCmd } from '../../../application/create-activity-cmd'
import { GetActivityEvidenceQry } from '../../../application/get-activity-image-qry'
import { UpdateActivityCmd } from '../../../application/update-activity-cmd'
import { Activity } from '../../../domain/activity'
import { NewActivity } from '../../../domain/new-activity'
import { ActivityErrorMessage } from '../../../domain/services/activity-error-message'
import { UpdateActivity } from '../../../domain/update-activity'
import styles from './activity-form.module.css'
import { ActivityFormSchema, ActivityFormValidationSchema } from './activity-form.schema'
import { ActivityTextArea } from './components/activity-text-area'
import { DurationText } from './components/duration-text'
import { SelectRoleSection } from './components/select-role-section'
import { GetAutofillHours } from './utils/get-autofill-hours'
import { GetInitialActivityFormValues } from './utils/get-initial-activity-form-values'
import { TimeUnits } from '../../../../../../../shared/types/time-unit'
import { NonHydratedProjectRole } from '../../../../project-role/domain/non-hydrated-project-role'
import { ProjectBillableType } from '../../../../../../shared/project/domain/project-billable-type'

export const ACTIVITY_FORM_ID = 'activity-form-id'

interface ActivityFormProps {
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

const mobileAreas = `
  "employee employee employee employee employee employee"
  "role role role role role role"
  "start start start end end end"
  "duration duration duration duration duration duration"
  "billable billable billable billable billable billable"
  "description description description description description description"
  "evidence evidence evidence evidence evidence evidence"
`

const desktopAreas = `
  "employee employee employee empty empty empty"
  "role role role role role role"
  "start start end end duration duration"
  "billable billable billable billable billable billable"
  "description description description description description description"
  "evidence evidence evidence evidence evidence evidence"
`

const templateAreas = [mobileAreas, desktopAreas]

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
  const { useCase: getActivityEvidenceQry } = useGetUseCase(GetActivityEvidenceQry)
  const { useCase: createActivityCmd } = useGetUseCase(CreateActivityCmd)
  const { useCase: updateActivityCmd } = useGetUseCase(UpdateActivityCmd)

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
    formState: { errors }
  } = useForm<ActivityFormSchema>({
    defaultValues: initialFormValues,
    resolver: yupResolver(ActivityFormValidationSchema),
    mode: 'onSubmit'
  })

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
    control,
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

  useEffect(() => {
    if (activity?.hasEvidences) {
      getActivityEvidenceQry.execute(activity.id).then((evidence) => {
        setValue('file', evidence)
        setIsLoadingEvidences(false)
      })
      return
    }

    setIsLoadingEvidences(false)
  }, [activity, getActivityEvidenceQry, setValue])

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
        evidence: data.file,
        hasEvidences: Boolean(data.file)
      }

      await createActivityCmd
        .execute(newActivity, {
          successMessage: t('activity_form.create_activity_notification'),
          showToastError: true,
          errorMessage: activityErrorMessage.get
        })
        .then(onAfterSubmit)
        .catch(onSubmitError)
    } else {
      const updateActivity: UpdateActivity = {
        id: activity!.id,
        description: data.description,
        billable: data.billable,
        interval,
        projectRoleId: projectRoleId,
        evidence: data.file,
        hasEvidences: Boolean(data.file)
      }

      await updateActivityCmd
        .execute(updateActivity, {
          successMessage: t('activity_form.update_activity_notification'),
          showToastError: true,
          errorMessage: activityErrorMessage.get
        })
        .then(onAfterSubmit)
        .catch(onSubmitError)
    }
  }

  const role: ProjectRole | NonHydratedProjectRole | undefined = useMemo(() => {
    return showRecentRole ? recentProjectRole : projectRole
  }, [projectRole, showRecentRole, recentProjectRole])

  const isHourlyProject = role?.timeInfo.timeUnit === TimeUnits.MINUTES

  const files = useMemo(() => {
    if (!file) return

    return [file]
  }, [file])

  const interval: DateInterval = useMemo(
    () =>
      isHourlyProject
        ? {
            start: chrono(parse(startTime, chrono.TIME_FORMAT, date)).getDate(),
            end: chrono(parse(endTime, chrono.TIME_FORMAT, date)).getDate()
          }
        : {
            start: chrono(startDate).getDate(),
            end: chrono(endDate).getDate()
          },
    [isHourlyProject, startTime, date, endTime, startDate, endDate]
  )

  const billableType: ProjectBillableType =
    (showRecentRole
      ? recentProjectRole?.project.projectBillingType.type
      : project?.projectBillingType.type) ?? 'OPTIONAL'

  useEffect(() => {
    function setBillableProjectOnChange() {
      if (showRecentRole) {
        if (activity && activity?.project.id === recentProjectRole?.project.id) {
          setValue('billable', activity?.billable || false)
          return
        }

        setValue(
          'billable',
          recentProjectRole?.project?.projectBillingType.billableByDefault || false
        )
        return
      }

      if (activity && activity?.project.id === project?.id) {
        setValue('billable', activity?.billable || false)
        return
      }

      setValue('billable', project?.projectBillingType.billableByDefault || false)
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
      as="form"
      noValidate={true}
      onSubmit={handleSubmit(onSubmit)}
      data-testid="activity_form"
      id={ACTIVITY_FORM_ID}
      className={isReadOnly ? styles['read-only'] : ''}
    >
      <SelectRoleSection
        gridArea="role"
        userId={activity?.userId}
        control={control}
        isReadOnly={isReadOnly}
      />

      {activity?.userName && (
        <Flex
          gridArea="employee"
          justify="flex-start"
          align="flex-start"
          wrap="wrap"
          position="relative"
          marginBottom={4}
        >
          <TextField
            label={t('activity_form.employee')}
            name={'employee'}
            value={activity?.userName}
            isDisabled={true}
          />
        </Flex>
      )}

      {isHourlyProject && (
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

      {!isHourlyProject && (
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
        {role !== undefined && (
          <DurationText
            // TODO: Remove once there is a dedicated TimeInfo API
            isRecentRole={showRecentRole}
            timeInfo={role.timeInfo}
            roleId={role.id}
            userId={activity?.userId}
            useDecimalTimeFormat={settings?.useDecimalTimeFormat}
            start={interval.start}
            end={interval.end}
          />
        )}
      </Flex>

      {!isReadOnly && billableType === 'OPTIONAL' && (
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
                isDisabled={isReadOnly}
              >
                {t('activity_form.billable')}
              </Checkbox>
            )}
          />
        </Box>
      )}

      {!isReadOnly && billableType === 'NEVER' && (
        <Box gridArea="billable">
          <span>{t('projects.NO_BILLABLE')}</span>
        </Box>
      )}

      {!isReadOnly && billableType === 'ALWAYS' && (
        <Box gridArea="billable">
          <span>{t('projects.CLOSED_PRICE')}</span>
        </Box>
      )}

      <ActivityTextArea
        {...register('description')}
        control={control}
        error={errors.description?.message}
        isDisabled={isReadOnly}
      />

      <FileField
        label={t('activity_form.evidences')}
        gridArea="evidence"
        onChange={onFileChanged}
        files={files}
        isLoading={isLoadingEvidences}
        isReadOnly={isReadOnly}
      />
    </Grid>
  )
}

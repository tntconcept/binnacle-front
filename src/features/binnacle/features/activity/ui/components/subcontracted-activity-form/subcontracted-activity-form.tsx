import { Box, Checkbox, Flex, Grid } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { ProjectRole } from '../../../../project-role/domain/project-role'
import { UserSettings } from '../../../../../../shared/user/features/settings/domain/user-settings'
import { FC, useEffect, useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from '../../../../../../../shared/arch/hooks/use-get-use-case'
import { DateField } from '../../../../../../../shared/components/form-fields/date-field'
import { chrono, parse } from '../../../../../../../shared/utils/chrono'
import { TimeFieldWithSelector } from '../../../../../../../shared/components/form-fields/time-field-with-selector'
import { useResolve } from '../../../../../../../shared/di/use-resolve'
import { TextField } from '../../../../../../../shared/components/form-fields/text-field'
import { DateInterval } from '../../../../../../../shared/types/date-interval'
import { CreateSubcontractedActivityCmd } from '../../../application/create-subcontracted-activity-cmd'
import { UpdateSubcontractedActivityCmd } from '../../../application/update-subcontracted-activity-cmd'
import { NewSubcontractedActivity } from '../../../domain/new-subcontracted-activity'
import { ActivityErrorMessage } from '../../../domain/services/activity-error-message'
import { UpdateSubcontractedActivity } from '../../../domain/update-subcontracted-activity'
import styles from './activity-form.module.css'
import {
  ActivityFormSchema,
  ActivityFormValidationSchema
} from '../activity-form/activity-form.schema'
import { ActivityTextArea } from '../activity-form/components/activity-text-area'
import { SelectRoleSection } from '../activity-form/components/select-role-section'
import { GetInitialSubcontractedActivityFormValues } from './utils/get-initial-subcontracted-activity-form-values'
import { TimeUnits } from '../../../../../../../shared/types/time-unit'
import { NonHydratedProjectRole } from '../../../../project-role/domain/non-hydrated-project-role'
import { SubcontractedActivity } from '../../../domain/subcontracted-activity'

export const ACTIVITY_FORM_ID = 'activity-form-id'

type SubcontractedActivityFormProps = {
  date: Date
  subcontractedActivity?: SubcontractedActivity
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

export const SubcontractedActivityForm: FC<SubcontractedActivityFormProps> = (props) => {
  const {
    date,
    subcontractedActivity,
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
  //const [isLoadingEvidences, setIsLoadingEvidences] = useState(true)
  //const { useCase: getActivityEvidenceQry } = useGetUseCase(GetActivityEvidenceQry)
  const { useCase: createSubcontractedActivityCmd } = useGetUseCase(CreateSubcontractedActivityCmd)
  const { useCase: updateSubcontractedActivityCmd } = useGetUseCase(UpdateSubcontractedActivityCmd)

  const initialFormValues = useMemo(() => {
    if (!settings) return

    const { getInitialFormValues } = new GetInitialSubcontractedActivityFormValues(
      subcontractedActivity,
      recentRoles,
      //new GetAutofillHours(settings.autofillHours, settings.hoursInterval, lastEndTime),
      date
    )

    return getInitialFormValues()
  }, [subcontractedActivity, date, lastEndTime, recentRoles, settings])

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<ActivityFormSchema>({
    //no seria subcontracted?
    defaultValues: initialFormValues,
    resolver: yupResolver(ActivityFormValidationSchema),
    mode: 'onSubmit'
  })

  const [
    projectRole,
    project,
    /*startTime, endTime,*/ startDate,
    endDate,
    recentProjectRole,
    showRecentRole
  ] = useWatch({
    control,
    name: [
      'projectRole',
      'project',
      /*'startTime',
      'endTime',*/
      'startDate',
      'endDate',
      'recentProjectRole',
      'showRecentRole',
      'file'
    ]
  })

  /* useEffect(() => {
    if (subcontractedActivity?.hasEvidences) {
      getActivityEvidenceQry.execute(subcontractedActivity.id).then((evidence) => {
        setValue('file', evidence)
        setIsLoadingEvidences(false)
      })
      return
    }

    setIsLoadingEvidences(false)
  }, [subcontractedActivity, getActivityEvidenceQry, setValue]) */

  const onSubmit = async (data: ActivityFormSchema) => {
    const projectRoleId = data.showRecentRole ? data.recentProjectRole!.id : data.projectRole!.id
    const isNewActivity = subcontractedActivity?.id === undefined
    onActivityFormSubmit()

    if (isNewActivity) {
      const newSubcontractedActivity: NewSubcontractedActivity = {
        description: data.description,
        billable: data.billable,
        projectRoleId: projectRoleId,
        interval
        //evidence: data.file,
        //hasEvidences: Boolean(data.file)
      }

      await createSubcontractedActivityCmd
        .execute(newSubcontractedActivity, {
          successMessage: t('activity_form.create_activity_notification'),
          showToastError: true,
          errorMessage: activityErrorMessage.get
        })
        .then(onAfterSubmit)
        .catch(onSubmitError)
    } else {
      const updateSubcontractedActivity: UpdateSubcontractedActivity = {
        id: subcontractedActivity!.id,
        description: data.description,
        billable: data.billable,
        projectRoleId: projectRoleId,
        interval
        //evidence: data.file,
        //hasEvidences: Boolean(data.file)
      }

      await updateSubcontractedActivityCmd
        .execute(updateSubcontractedActivity, {
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

  /*const files = useMemo(() => {
    if (!file) return

    return [file]
  }, [file])*/

  const interval: DateInterval = useMemo(
    () =>
      isHourlyProject
        ? {
            start: chrono(parse(/*startTime, */ '9', chrono.TIME_FORMAT, date)).getDate(),
            end: chrono(parse(/*endTime,*/ '10', chrono.TIME_FORMAT, date)).getDate()
          }
        : {
            start: chrono(startDate).getDate(),
            end: chrono(endDate).getDate()
          },
    [isHourlyProject, /*startTime, */ '9', date, /*endTime,*/ '10', startDate, endDate]
  )

  useEffect(() => {
    function setBillableProjectOnChange() {
      if (showRecentRole) {
        if (
          subcontractedActivity &&
          subcontractedActivity?.project.id === recentProjectRole?.project.id
        ) {
          setValue('billable', subcontractedActivity?.billable || false)
          return
        }

        setValue('billable', recentProjectRole?.project?.billable || false)
        return
      }

      if (subcontractedActivity && subcontractedActivity?.project.id === project?.id) {
        setValue('billable', subcontractedActivity?.billable || false)
        return
      }

      setValue('billable', project?.billable || false)
    }

    setBillableProjectOnChange()
  }, [subcontractedActivity, showRecentRole, project, setValue, recentProjectRole])

  /*const onFileChanged = async (files: File[]) => {
    if (!files || files.length === 0) {
      return setValue('file', undefined)
    }

    setValue('file', files[0])
  }
*/
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
        userId={subcontractedActivity?.userId}
        control={control}
        isReadOnly={isReadOnly}
      />

      {subcontractedActivity?.userName && (
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
            value={subcontractedActivity?.userName}
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
              isReadOnly={isReadOnly}
            />
          </Box>
          <Box gridArea="end">
            <TimeFieldWithSelector
              name={'endTime'}
              label={t('activity_form.end_time')}
              control={control}
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
        {/* {role !== undefined && (
          <DurationText
            // TODO: Remove once there is a dedicated TimeInfo API
            isRecentRole={showRecentRole}
            timeInfo={role.timeInfo}
            roleId={role.id}
            userId={subcontractedActivity?.userId}
            useDecimalTimeFormat={settings?.useDecimalTimeFormat}

          />
        )} */}
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
                isDisabled={isReadOnly}
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
        isDisabled={isReadOnly}
      />

      {/* <FileField
        label={t('activity_form.evidences')}
        gridArea="evidence"
        onChange={onFileChanged}
        files={files}
        isLoading={isLoadingEvidences}
        isReadOnly={isReadOnly}
      /> */}
    </Grid>
  )
}

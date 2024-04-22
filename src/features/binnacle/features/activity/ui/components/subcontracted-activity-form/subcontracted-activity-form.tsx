import { Box, Flex, Grid } from '@chakra-ui/react'
import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { UserSettings } from '../../../../../../shared/user/features/settings/domain/user-settings'
import { FC, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from '../../../../../../../shared/arch/hooks/use-get-use-case'
import { useResolve } from '../../../../../../../shared/di/use-resolve'
import { TextField } from '../../../../../../../shared/components/form-fields/text-field'
import { CreateSubcontractedActivityCmd } from '../../../application/create-subcontracted-activity-cmd'
import { UpdateSubcontractedActivityCmd } from '../../../application/update-subcontracted-activity-cmd'
import { NewSubcontractedActivity } from '../../../domain/new-subcontracted-activity'
import { ActivityErrorMessage } from '../../../domain/services/activity-error-message'
import { UpdateSubcontractedActivity } from '../../../domain/update-subcontracted-activity'
import styles from '../activity-form/activity-form.module.css'
import {
  SubcontractedActivityFormSchema,
  SubcontractedActivityFormValidationSchema
} from '../subcontracted-activity-form/subcontracted-activity-form.schema'
import { ActivityTextArea } from '../activity-form/components/activity-text-area'
import { GetInitialSubcontractedActivityFormValues } from './utils/get-initial-subcontracted-activity-form-values'
import { SubcontractedActivity } from '../../../domain/subcontracted-activity'
import { MonthField } from '../../../../../../../shared/components/form-fields/month-field'
import { NumberField } from '../../../../../../../shared/components/form-fields/number-field'
import { SelectRoleSectionWithoutRecentRole } from '../activity-form/components/role-selection-without-recent-roles'

export const SUBCONTRACTED_ACTIVITY_FORM_ID = 'activity-form-id'

type SubcontractedActivityFormProps = {
  date: string
  subcontractedActivity?: SubcontractedActivity
  lastEndTime?: Date
  onAfterSubmit: () => void
  onSubmit: () => void
  onSubmitError: () => void
  settings: UserSettings
  isReadOnly?: boolean
}

const mobileAreas = `
  "employee employee employee employee employee employee"
  "role role role role role role"
  "month month month end end end"
  "duration duration duration duration duration duration"
  "billable billable billable billable billable billable"
  "description description description description description description"
`

const desktopAreas = `
  "employee employee employee empty empty empty"
  "role role role role role role"
  "month month duration duration end end"
  "billable billable billable billable billable billable"
  "description description description description description description"
`

const templateAreas = [mobileAreas, desktopAreas]

export const SubcontractedActivityForm: FC<SubcontractedActivityFormProps> = (props) => {
  const {
    date,
    subcontractedActivity,
    onSubmit: onActivityFormSubmit,
    onAfterSubmit,
    onSubmitError,
    settings,
    isReadOnly
  } = props
  const { t } = useTranslation()
  const activityErrorMessage = useResolve(ActivityErrorMessage)
  const { useCase: createSubcontractedActivityCmd } = useGetUseCase(CreateSubcontractedActivityCmd)
  const { useCase: updateSubcontractedActivityCmd } = useGetUseCase(UpdateSubcontractedActivityCmd)

  const initialFormValues = useMemo(() => {
    if (!settings) return

    const { getInitialFormValues } = new GetInitialSubcontractedActivityFormValues(
      subcontractedActivity,
      // recentRoles,
      date
    )

    return getInitialFormValues()
    // }, [subcontractedActivity, lastEndTime, date, recentRoles, settings])
  }, [subcontractedActivity, date, settings])

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<SubcontractedActivityFormSchema>({
    defaultValues: initialFormValues,
    resolver: yupResolver(SubcontractedActivityFormValidationSchema),
    mode: 'onSubmit'
  })

  const [
    // showRecentRole,
    // startDate,
    // billable,
    // description,
    // organization,
    project,
    // projectRole,
    recentProjectRole
    // duration
  ] = useWatch({
    control,
    name: [
      // 'showRecentRole',
      // 'startDate',
      // 'billable',
      // 'description',
      // 'organization',
      'project',
      // 'projectRole',
      'recentProjectRole'
      // 'duration'
    ]
  })

  const onSubmit = async (data: SubcontractedActivityFormSchema) => {
    console.log('on submit')
    // const projectRoleId = data.showRecentRole ? data.recentProjectRole!.id : data.projectRole!.id
    const projectRoleId = data.projectRole!.id
    const isNewActivity = subcontractedActivity?.id === undefined
    onActivityFormSubmit()
    if (isNewActivity && data.duration != null) {
      const newSubcontractedActivity: NewSubcontractedActivity = {
        description: data.description,
        projectRoleId: projectRoleId,
        duration: data.duration,
        month: data.month
      }

      await createSubcontractedActivityCmd
        .execute(newSubcontractedActivity, {
          successMessage: t('activity_form.create_activity_notification'),
          showToastError: true,
          errorMessage: activityErrorMessage.get
        })
        .then(onAfterSubmit)
        .catch(onSubmitError)
    } else if (data.duration != null) {
      const updateSubcontractedActivity: UpdateSubcontractedActivity = {
        id: subcontractedActivity!.id,
        description: data.description,
        projectRoleId: projectRoleId,
        duration: data.duration,
        month: data.month
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

  /* const role: ProjectRole | NonHydratedProjectRole | undefined = useMemo(() => {
    return showRecentRole ? recentProjectRole : projectRole
  }, [projectRole, showRecentRole, recentProjectRole])

  const isHourlyProject = role?.timeInfo.timeUnit === TimeUnits.MINUTES
  isHourlyProject //REMOVE */
  /*const files = useMemo(() => {
    if (!file) return

    return [file]
  }, [file])*/
  /*
  const interval: DateInterval = useMemo(
    () =>
      isHourlyProject
        ? {
            start: chrono(parse( '9', chrono.TIME_FORMAT, date)).getDate(),
            end: chrono(parse( '10', chrono.TIME_FORMAT, date)).getDate()
          }
        : {
            start: chrono(startDate).getDate(),
            end: chrono(endDate).getDate()
          },
    [isHourlyProject,  '9', date, '10', startDate, endDate]
  )*/

  useEffect(() => {
    function setBillableProjectOnChange() {
      // if (showRecentRole) {
      //   if (
      //     subcontractedActivity &&
      //     subcontractedActivity?.project.id === recentProjectRole?.project.id
      //   ) {
      //     setValue('billable', subcontractedActivity?.billable || false)
      //     return
      //   }
      //   setValue('billable', recentProjectRole?.project?.billable || false)
      //   return
      // }
    }

    setBillableProjectOnChange()
  }, [subcontractedActivity, project, setValue, recentProjectRole])

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
      id={SUBCONTRACTED_ACTIVITY_FORM_ID}
      className={isReadOnly ? styles['read-only'] : ''}
    >
      <SelectRoleSectionWithoutRecentRole
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
            label={t('subcontracted_activity_form.employee')}
            name={'employee'}
            value={subcontractedActivity?.userName}
            isDisabled={true}
          />
        </Flex>
      )}

      <Box gridArea="month">
        <MonthField
          label={t('subcontracted_activity_form.month')}
          error={errors.month?.message}
          {...register('month')}
          isReadOnly={isReadOnly}
        />
      </Box>

      <Box gridArea="duration">
        <NumberField
          label={t('subcontracted_activity_form.duration')}
          error={errors.duration?.message}
          {...register('duration')}
          isReadOnly={isReadOnly}
        />
      </Box>

      {/*!isReadOnly && (
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
            )*/}

      <ActivityTextArea
        {...register('description')}
        control={control}
        error={errors.description?.message}
        isDisabled={isReadOnly}
      />
    </Grid>
  )
}

import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityFormValues, ActivityFormData } from './ActivityFormLogic'
import styles from 'pages/binnacle/ActivityForm/ActivityForm.module.css'
import { Field, FieldProps, FormikProps } from 'formik'
import { TextField, Checkbox } from 'core/components'
import ChooseRole from './ChooseRole'
import UploadImage from './UploadImage'
import DurationInput from './DurationInput'
import DurationText from './DurationText'
import { Flex, Grid } from '@chakra-ui/core'

interface IActivityForm {
  formik: FormikProps<ActivityFormValues>
  utils: ActivityFormData
}

export const ActivityForm: React.FC<IActivityForm> = ({ formik, utils }) => {
  const { t } = useTranslation()

  return (
    <Grid
      as="form"
      templateColumns="repeat(6, [col] 1fr)"
      templateRows="repeat(2, [row] auto)"
      gap="16px"
      p="16px"
      onSubmit={formik.handleSubmit as any}
      noValidate={true}
    >
      <Field name="startTime">
        {({ field, meta }: FieldProps) => (
          <TextField
            {...field}
            label={t('activity_form.start_time')}
            className={styles.startTime}
            type="time"
            step="900"
            min="00:00"
            max="23:59"
            error={meta.error !== undefined && meta.touched}
            errorText={meta.error}
          />
        )}
      </Field>
      <Field name="endTime">
        {({ field, meta }: FieldProps) => (
          <TextField
            {...field}
            label={t('activity_form.end_time')}
            className={styles.endTime}
            type="time"
            step="900"
            min="00:00"
            max="23:59"
            error={meta.error !== undefined && meta.touched}
            errorText={meta.error}
          />
        )}
      </Field>
      <Flex gridColumn={['col / span 6', 'col 5 / span 2']} align="center" justify="space-between">
        {utils.showDurationInput ? <DurationInput /> : <DurationText />}
      </Flex>
      <ChooseRole
        showRecentRoles={utils.showRecentRoles}
        toggleRecentRoles={utils.setShowRecentRoles}
        recentRoleExists={utils.recentRoleExists}
      />
      <Field name="billable">
        {({ field }: FieldProps) => (
          <Checkbox
            {...field}
            label={t('activity_form.billable')}
            wrapperClassName={styles.billable}
          />
        )}
      </Field>
      <Field name="description">
        {({ field, meta }: FieldProps) => (
          <TextField
            {...field}
            label={t('activity_form.description')}
            className={styles.description}
            isTextArea={true}
            error={meta.error !== undefined && meta.touched}
            errorText={meta.error}
            hintText={`${formik.values.description.length} / 2048`}
            alignRightHelperText={true}
          />
        )}
      </Field>
      <UploadImage
        activityId={utils.activity?.id}
        imgBase64={utils.imageBase64}
        handleChange={utils.setImageBase64}
        activityHasImg={utils.activity?.hasImage ?? false}
      />
    </Grid>
  )
}

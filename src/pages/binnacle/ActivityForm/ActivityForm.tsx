import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityFormValues, ActivityFormData } from './ActivityFormLogic'
import styles from 'pages/binnacle/ActivityForm/ActivityForm.module.css'
import { Field, FieldProps, FormikProps } from 'formik'
import ChooseRole from './ChooseRole'
import UploadImage from './UploadImage'
import DurationInput from './DurationInput'
import DurationText from './DurationText'
import {
  Flex,
  Grid,
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  useColorModeValue
} from '@chakra-ui/core'
import { FloatingLabelInput } from 'core/components/FloatingLabelInput'
import { FloatingLabelTextarea } from 'core/components/FloatingLabelTextarea'

interface IActivityForm {
  formik: FormikProps<ActivityFormValues>
  utils: ActivityFormData
}

export const ActivityForm: React.FC<IActivityForm> = ({ formik, utils }) => {
  const { t } = useTranslation()
  const labelBgColor = useColorModeValue('white', ['gray.800', 'gray.700'])

  return (
    <Grid
      as="form"
      data-testid="activity_form"
      templateColumns="repeat(6, [col] 1fr)"
      templateRows="repeat(2, [row] auto)"
      gap="16px"
      p="16px"
      onSubmit={formik.handleSubmit as any}
      noValidate={true}
    >
      <Field name="startTime">
        {({ field, meta }: FieldProps) => (
          <FormControl
            id="startTime"
            isInvalid={meta.error !== undefined && meta.touched}
            className={styles.startTime}
          >
            <FloatingLabelInput
              {...field}
              label={t('activity_form.start_time')}
              labelBgColor={labelBgColor}
              type="time"
              step="900"
              min="00:00"
              max="23:59"
            />
            <FormErrorMessage>{meta.error}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
      <Field name="endTime">
        {({ field, meta }: FieldProps) => (
          <FormControl
            id="endTime"
            isInvalid={meta.error !== undefined && meta.touched}
            className={styles.endTime}
          >
            <FloatingLabelInput
              {...field}
              label={t('activity_form.end_time')}
              labelBgColor={labelBgColor}
              className={styles.endTime}
              type="time"
              step="900"
              min="00:00"
              max="23:59"
            />
            <FormErrorMessage>{meta.error}</FormErrorMessage>
          </FormControl>
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
          <Box as="label" htmlFor="billable" gridColumn="col / span 6">
            <input type="checkbox" id="billable" {...field} checked={field.value} />
            {' ' + t('activity_form.billable')}
          </Box>
        )}
      </Field>
      <Field name="description">
        {({ field, meta }: FieldProps) => (
          <FormControl
            id="description"
            isInvalid={meta.error !== undefined && meta.touched}
            className={styles.description}
          >
            <FloatingLabelTextarea {...field} label={t('activity_form.description')} />
            <FormHelperText float="right">{`${formik.values.description.length} / 2048`}</FormHelperText>
            <FormErrorMessage>{meta.error}</FormErrorMessage>
          </FormControl>
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

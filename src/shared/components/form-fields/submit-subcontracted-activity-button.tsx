import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { FC } from 'react'
import { SubcontractedActivityFormSchema } from '../../../features/binnacle/features/activity/ui/components/subcontracted-activity-form/subcontracted-activity-form.schema'
interface Props extends ButtonProps {
  formId?: string
}

export const SubmitSubcontractedActivityButton: FC<Props> = ({ formId, ...props }) => {
  const form = useFormContext<SubcontractedActivityFormSchema>()
  const isSubmitting = form?.formState?.isSubmitting ?? props.isLoading

  return (
    <Button
      type="submit"
      colorScheme="brand"
      variant="solid"
      isLoading={isSubmitting}
      isDisabled={props.isDisabled || isSubmitting}
      onClick={props.onClick}
      {...props}
      form={formId}
    >
      {props.children}
    </Button>
  )
}

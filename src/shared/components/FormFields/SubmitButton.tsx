import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { ActivityFormSchema } from '../../../features/binnacle/features/activity/ui/components/activity-form/activity-form.schema'

interface Props extends ButtonProps {
  formId?: string
}

function SubmitButton({ formId, ...props }: Props) {
  const form = useFormContext<ActivityFormSchema>()
  const isSubmitting = form?.formState?.isSubmitting ?? props.isLoading

  return (
    <Button
      type="submit"
      colorScheme="brand"
      variant="solid"
      isLoading={isSubmitting}
      disabled={props.isDisabled || isSubmitting}
      onClick={props.onClick}
      {...props}
      form={formId}
    >
      {props.children}
    </Button>
  )
}

export default SubmitButton

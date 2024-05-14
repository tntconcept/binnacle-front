import type { ButtonProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { ActivityFormSchema } from '../../../features/binnacle/features/activity/ui/components/activity-form/activity-form.schema'
import { FC } from 'react'
interface Props extends ButtonProps {
  formId?: string
}

export const SubmitButton: FC<Props> = ({ formId, ...props }) => {
  const form = useFormContext<ActivityFormSchema>()
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

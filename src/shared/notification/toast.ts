import { createStandaloneToast } from '@chakra-ui/react'

export const { toast, ToastContainer } = createStandaloneToast()
export type ToastType = typeof toast

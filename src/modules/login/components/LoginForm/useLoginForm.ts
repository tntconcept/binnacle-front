import { LoginAction } from 'modules/login/data-access/actions/login-action'
import { useForm } from 'react-hook-form'
import { useAction } from 'shared/arch/hooks/use-action'

type LoginForm = {
  username: string
  password: string
}

export function useLoginForm() {
  const login = useAction(LoginAction)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setFocus,
    clearErrors
  } = useForm<LoginForm>({
    mode: 'onSubmit'
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login({ username: data.username, password: data.password })
    } catch (e) {
      // @ts-ignore
      if (e.response && e.response.status === 401) {
        clearErrors()
        reset({ username: '', password: '' })
        setFocus('username')
      }
    }
  })

  return {
    register,
    errors,
    onSubmit,
    isLoading: isSubmitting
  }
}

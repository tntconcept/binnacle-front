import { FormControl } from '@chakra-ui/react'
import { PasswordInput } from 'modules/login/components/PasswordField/PasswordInput'
import { render, screen, userEvent, waitFor } from 'test-utils/app-test-utils'

it('should show and hide password', async () => {
  setup()

  userEvent.type(screen.getByTestId('password'), 's3cr3t')

  userEvent.click(screen.getByLabelText('actions.show'))
  expect(screen.getByTestId('password')).toHaveAttribute('type', 'text')

  userEvent.click(screen.getByLabelText('actions.hide'))
  expect(screen.getByTestId('password')).toHaveAttribute('type', 'password')

  await waitFor(() => {
    expect(screen.getByTestId('password')).toHaveValue('s3cr3t')
  })
})

function setup() {
  render(
    <FormControl>
      <PasswordInput label="password" data-testid="password" />
    </FormControl>
  )
}

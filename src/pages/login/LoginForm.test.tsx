import React from 'react'
import { LoginForm } from 'pages/login/LoginForm'
import { render, userEvent, screen, waitFor } from 'test-utils/app-test-utils'

describe('LoginForm', () => {
  it('should validate fields', async () => {
    render(<LoginForm />)

    userEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findAllByText('form_errors.field_required')).toHaveLength(2)
  })

  it('should show and hide password', async () => {
    render(<LoginForm />)

    userEvent.type(screen.getByLabelText('login_page.password_field'), 's3cr3t')

    userEvent.click(screen.getByText('actions.show'))
    expect(screen.getByLabelText('login_page.password_field')).toHaveAttribute('type', 'text')

    userEvent.click(screen.getByText('actions.hide'))
    expect(screen.getByLabelText('login_page.password_field')).toHaveAttribute('type', 'password')

    await waitFor(() => {
      expect(screen.getByLabelText('login_page.password_field')).toHaveValue('s3cr3t')
    })
  })
})

import React from 'react'
import { render, screen, userEvent, waitFor, fireEvent } from 'test-utils/app-test-utils'
import { SettingsForm } from 'pages/settings/SettingsForm'
import { Context as ResponsiveContext } from 'react-responsive'
import { STORAGE_KEY } from 'pages/settings/Settings.utils'

describe('SettingsForm', () => {
  const renderSettingsForm = (changeLanguage = jest.fn()) => {
    render(<SettingsForm changeLanguage={changeLanguage} />)

    return { changeLanguage }
  }

  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'setItem')
  })

  it('should change the language', async () => {
    const { changeLanguage } = renderSettingsForm()

    // initial state
    expect(screen.getByLabelText('Español')).not.toBeChecked()

    userEvent.click(screen.getByLabelText('Español'))
    expect(screen.getByLabelText('Español')).toBeChecked()

    expect(changeLanguage).toHaveBeenCalledWith('es')

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        STORAGE_KEY,
        expect.stringMatching(/"language":"es"/)
      )
    })
  })

  it('should enable dark mode', async () => {
    renderSettingsForm()

    // initial state
    expect(screen.getByLabelText('settings.dark_mode')).not.toBeChecked()

    userEvent.click(screen.getByLabelText('settings.dark_mode'))
    expect(screen.getByLabelText('settings.dark_mode')).toBeChecked()

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        STORAGE_KEY,
        expect.stringMatching(/"darkMode":true/)
      )
    })
  })

  it('should disable autofill hours option', async () => {
    renderSettingsForm()

    // initial state
    expect(screen.getByLabelText('settings.autofill_hours')).toBeChecked()

    userEvent.click(screen.getByLabelText('settings.autofill_hours'))
    expect(screen.getByLabelText('settings.autofill_hours')).not.toBeChecked()

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        STORAGE_KEY,
        expect.stringMatching(/"autofillHours":false/)
      )
    })
  })

  it('should change the autofill hours', async () => {
    renderSettingsForm()

    // initial state
    expect(screen.getByLabelText('settings.start')).toHaveValue('09:00')
    expect(screen.getByLabelText('settings.end')).toHaveValue('18:00')
    expect(screen.getByLabelText('settings.from')).toHaveValue('13:00')
    expect(screen.getByLabelText('settings.to')).toHaveValue('14:00')

    fireEvent.change(screen.getByLabelText('settings.start'), {
      target: { value: '10:00' }
    })
    fireEvent.change(screen.getByLabelText('settings.end'), {
      target: { value: '19:00' }
    })
    fireEvent.change(screen.getByLabelText('settings.from'), {
      target: { value: '14:00' }
    })
    fireEvent.change(screen.getByLabelText('settings.to'), {
      target: { value: '15:00' }
    })

    expect(screen.getByLabelText('settings.start')).toHaveValue('10:00')
    expect(screen.getByLabelText('settings.end')).toHaveValue('19:00')
    expect(screen.getByLabelText('settings.from')).toHaveValue('14:00')
    expect(screen.getByLabelText('settings.to')).toHaveValue('15:00')

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        STORAGE_KEY,
        expect.stringMatching(/"hoursInterval":\["10:00","14:00","15:00","19:00"]/)
      )
    })
  })

  it('should validate the autofill hours introduced by the user', async () => {
    renderSettingsForm()

    // start time is after the end time
    fireEvent.change(screen.getByLabelText('settings.start'), {
      target: { value: '22:00' }
    })

    expect(await screen.findByText('settings.intervals_overlap')).toBeInTheDocument()
  })

  it('should hide description preview on mobile', async () => {
    render(
      <ResponsiveContext.Provider value={{ width: 300 }}>
        <SettingsForm changeLanguage={jest.fn()} />
      </ResponsiveContext.Provider>
    )

    await waitFor(() => {
      expect(screen.queryByText('settings.description_preview')).not.toBeInTheDocument()
    })
  })

  it('should enable description preview', async () => {
    renderSettingsForm()

    // initial state
    expect(screen.getByLabelText('settings.description_preview')).not.toBeChecked()

    userEvent.click(screen.getByLabelText('settings.description_preview'))
    expect(screen.getByLabelText('settings.description_preview')).toBeChecked()

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        STORAGE_KEY,
        expect.stringMatching(/"showDescription":true/)
      )
    })
  })

  it('should enable duration input', async () => {
    renderSettingsForm()

    // initial state
    expect(screen.getByLabelText('settings.show_duration_input')).not.toBeChecked()

    userEvent.click(screen.getByLabelText('settings.show_duration_input'))
    expect(screen.getByLabelText('settings.show_duration_input')).toBeChecked()

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        STORAGE_KEY,
        expect.stringMatching(/"showDurationInput":true/)
      )
    })
  })

  it('should enable decimal format', async () => {
    renderSettingsForm()

    // initial state
    expect(screen.getByLabelText('settings.use_decimal_time_format')).not.toBeChecked()

    userEvent.click(screen.getByLabelText('settings.use_decimal_time_format'))
    expect(screen.getByLabelText('settings.use_decimal_time_format')).toBeChecked()

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        STORAGE_KEY,
        expect.stringMatching(/"useDecimalTimeFormat":true/)
      )
    })
  })
})

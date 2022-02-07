import { SettingsForm } from 'modules/settings/components/SettingsForm/SettingsForm'
import { Context as ResponsiveContext } from 'react-responsive'
import { initialSettings } from 'shared/data-access/state/settings-state'
import type { SettingsValues } from 'shared/data-access/state/SettingsValues.interface'
import { render, screen, userEvent } from 'test-utils/app-test-utils'

describe('SettingsForm', () => {
  it('should change the language', () => {
    const { changeLanguage } = setup({ language: 'es' })

    const select = document.querySelector('#language') as HTMLSelectElement

    expect((screen.getByText('settings.es') as HTMLOptionElement).selected).toBe(true)

    userEvent.selectOptions(select, [screen.getByText('settings.en')])

    expect((screen.getByText('settings.en') as HTMLOptionElement).selected).toBe(true)
    expect(changeLanguage).toHaveBeenCalledWith('en')
  })

  it('should prioritize system theme if is enabled', () => {
    const { changeTheme, changeSettings } = setup({
      theme: 'light',
      settings: { ...initialSettings, isSystemTheme: true }
    })

    const select = document.querySelector('#theme') as HTMLSelectElement

    expect((screen.getByText('settings.system_theme') as HTMLOptionElement).selected).toBe(true)

    userEvent.selectOptions(select, [screen.getByText('settings.light_theme')])

    expect((screen.getByText('settings.light_theme') as HTMLOptionElement).selected).toBe(true)
    expect(changeTheme).toHaveBeenCalledWith('light')
    expect(changeSettings).toHaveBeenCalledWith({ ...initialSettings, isSystemTheme: false })
  })

  it('should select system theme and change immediately change the app theme based on system preference', () => {
    const { changeTheme, changeSettings } = setup({
      theme: 'light',
      settings: { ...initialSettings, isSystemTheme: false }
    })

    const select = document.querySelector('#theme') as HTMLSelectElement

    expect((screen.getByText('settings.light_theme') as HTMLOptionElement).selected).toBe(true)

    const matchMediaMock = jest.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))

    // matchMedia is not supported in JSDOM
    // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock
    })
    userEvent.selectOptions(select, [screen.getByText('settings.system_theme')])

    expect((screen.getByText('settings.system_theme') as HTMLOptionElement).selected).toBe(true)

    expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    expect(changeTheme).toHaveBeenCalledWith('dark')
    expect(changeSettings).toHaveBeenCalledWith({ ...initialSettings, isSystemTheme: true })
  })

  it('should enable time decimal format', function() {
    const { changeSettings } = setup({
      settings: { ...initialSettings, useDecimalTimeFormat: false }
    })

    expect(screen.getByLabelText('settings.use_decimal_time_format')).not.toBeChecked()

    userEvent.click(screen.getByLabelText('settings.use_decimal_time_format'))

    expect(screen.getByLabelText('settings.use_decimal_time_format')).toBeChecked()

    expect(changeSettings).toHaveBeenCalledWith({ ...initialSettings, useDecimalTimeFormat: true })
  })

  it('should enable autofill hours option and show hours form', async () => {
    const { changeSettings } = setup({
      settings: { ...initialSettings, autofillHours: false }
    })

    expect(screen.getByLabelText('settings.autofill_hours')).not.toBeChecked()
    expect(screen.queryByText('settings.working_time')).not.toBeInTheDocument()

    userEvent.click(screen.getByLabelText('settings.autofill_hours'))

    expect(screen.getByLabelText('settings.autofill_hours')).toBeChecked()
    expect(screen.queryByText('settings.working_time')).toBeInTheDocument()

    expect(changeSettings).toHaveBeenCalledWith({ ...initialSettings, autofillHours: true })
  })

  it('should change the autofill hours', async () => {
    const { changeSettings } = setup({
      settings: { ...initialSettings }
    })

    expect(screen.getByLabelText('settings.start')).toHaveValue('09:00')
    expect(screen.getByLabelText('settings.end')).toHaveValue('18:00')
    expect(screen.getByLabelText('settings.from')).toHaveValue('13:00')
    expect(screen.getByLabelText('settings.to')).toHaveValue('14:00')

    userEvent.type(screen.getByLabelText('settings.start'), '10:00')
    userEvent.type(screen.getByLabelText('settings.end'), '19:00')
    userEvent.type(screen.getByLabelText('settings.from'), '14:00')
    userEvent.type(screen.getByLabelText('settings.to'), '15:00')

    expect(screen.getByLabelText('settings.start')).toHaveValue('10:00')
    expect(screen.getByLabelText('settings.end')).toHaveValue('19:00')
    expect(screen.getByLabelText('settings.from')).toHaveValue('14:00')
    expect(screen.getByLabelText('settings.to')).toHaveValue('15:00')

    expect(changeSettings).toHaveBeenCalledWith({
      ...initialSettings,
      hoursInterval: { startWorkingTime: '10:00', endWorkingTime: "19:00", startLunchBreak: "14:00", endLunchBreak: "15:00" }
    })
  })

  it('should validate the autofill hours introduced by the user', async () => {
    setup({
      settings: { ...initialSettings }
    })

    expect(screen.queryByText('settings.intervals_overlap')).not.toBeInTheDocument()

    // start time is after the end time
    userEvent.type(screen.getByLabelText('settings.start'), '22:00')

    expect(screen.getByText('settings.intervals_overlap')).toBeInTheDocument()
  })

  it('should enable description preview', async () => {
    const { changeSettings } = setup({
      settings: { ...initialSettings, showDescription: false }
    })

    expect(screen.getByLabelText('settings.description_preview')).not.toBeChecked()

    userEvent.click(screen.getByLabelText('settings.description_preview'))
    expect(screen.getByLabelText('settings.description_preview')).toBeChecked()

    expect(changeSettings).toHaveBeenCalledWith({ ...initialSettings, showDescription: true })
  })

  it('should hide description preview on mobile', async () => {
    setup({ isMobile: true })

    expect(screen.queryByText('settings.description_preview')).not.toBeInTheDocument()
  })
})

function setup(
  values: Partial<{ language: string; theme: string; settings: SettingsValues; isMobile: boolean }>
) {
  const width = values.isMobile ? 300 : 900

  const changeLanguage = jest.fn()
  const changeTheme = jest.fn()
  const changeSettings = jest.fn()

  render(
    <ResponsiveContext.Provider value={{ width }}>
      <SettingsForm
        language={values.language ?? 'en'}
        changeLanguage={changeLanguage}
        // @ts-expect-error
        theme={values.theme ?? ('dark' as const)}
        changeTheme={changeTheme}
        settings={values.settings ?? initialSettings}
        changeSettings={changeSettings}
      />
    </ResponsiveContext.Provider>
  )

  return {
    changeLanguage,
    changeTheme,
    changeSettings
  }
}

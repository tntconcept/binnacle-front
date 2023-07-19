import { GetUserSettingsQry } from '../../../../../shared/user/features/settings/application/get-user-settings-qry'
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import { useExecuteUseCaseOnMount } from '../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { chrono } from '../../../../../../shared/utils/chrono'

type CalendarState = {
  selectedDate: Date
  setSelectedDate?: Dispatch<SetStateAction<Date>>
  shouldShowDescription: boolean
  setShouldShowDescription?: Dispatch<SetStateAction<boolean>>
  shouldUseDecimalTimeFormat: boolean
  setShouldUseDecimalTimeFormat?: Dispatch<SetStateAction<boolean>>
}

const CalendarStateContext = createContext<CalendarState>({
  selectedDate: chrono().getDate(),
  shouldShowDescription: false,
  shouldUseDecimalTimeFormat: false
})
CalendarStateContext.displayName = 'CalendarStateContext'

export const CalendarProvider: FC<PropsWithChildren<Partial<CalendarState>>> = (props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(props.selectedDate || chrono().getDate())
  const [shouldShowDescription, setShouldShowDescription] = useState<boolean>(
    props.shouldShowDescription || false
  )
  const [shouldUseDecimalTimeFormat, setShouldUseDecimalTimeFormat] = useState<boolean>(
    props.shouldUseDecimalTimeFormat || false
  )
  const { isLoading, result: settings } = useExecuteUseCaseOnMount(GetUserSettingsQry)

  useEffect(() => {
    if (!isLoading && settings) {
      setShouldShowDescription(settings.showDescription)
      setShouldUseDecimalTimeFormat(settings.useDecimalTimeFormat)
    }
  }, [isLoading, settings])

  return (
    <CalendarStateContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        shouldShowDescription,
        setShouldShowDescription,
        shouldUseDecimalTimeFormat,
        setShouldUseDecimalTimeFormat
      }}
    >
      {!isLoading && props.children}
    </CalendarStateContext.Provider>
  )
}

export const useCalendarContext = (): CalendarState => useContext(CalendarStateContext)

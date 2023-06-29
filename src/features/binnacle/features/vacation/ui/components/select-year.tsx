import {
  Flex,
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Stack,
  useColorModeValue
} from '@chakra-ui/react'
import { GetUserLoggedQry } from 'features/shared/user/application/get-user-logged-qry'
import { ChangeEvent, FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import chrono, { eachYearOfInterval } from 'shared/utils/chrono'

type SelectYearProps = {
  year: number
  onChargeYearChanged(chargeYear: number): void
}

export const SelectYear: FC<SelectYearProps> = (props) => {
  const { year, onChargeYearChanged = () => {} } = props
  const { t } = useTranslation()
  const { isLoading: isLoadingUser, result: loggedUser } =
    useExecuteUseCaseOnMount(GetUserLoggedQry)

  const handleYearChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    onChargeYearChanged(parseInt(event.target.value))
  }

  const years = useMemo(() => {
    if (!loggedUser) return []

    return eachYearOfInterval({
      start: chrono(loggedUser!.hiringDate).getDate(),
      end: chrono().plus(1, 'year').getDate()
    })
  }, [loggedUser])

  const isLoading = useMemo(() => {
    return isLoadingUser && years.length === 0
  }, [isLoadingUser, years])

  const selectBgColor = useColorModeValue('white', undefined)

  return (
    <Flex flexBasis={['150px', 'unset']}>
      <FormControl id="year">
        <FormLabel>{t('vacation.select_year')}</FormLabel>
        <Stack direction="row" spacing={2} alignItems="center">
          <Select value={year} onChange={handleYearChange} w={100} bgColor={selectBgColor}>
            {years.map((year, index) => (
              <option key={index} value={chrono(year).get('year')}>
                {chrono(year).get('year')}
              </option>
            ))}
          </Select>
          {isLoading && <Spinner size="sm" />}
        </Stack>
      </FormControl>
    </Flex>
  )
}

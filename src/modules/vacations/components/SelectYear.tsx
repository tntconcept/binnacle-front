import { Flex, FormControl, FormLabel, Select, Spinner, Stack, useColorModeValue } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { GetVacationsByYearAction } from 'modules/vacations/data-access/actions/get-vacations-by-year-action'
import { VacationsState } from 'modules/vacations/data-access/state/vacations-state'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useActionLoadable } from 'shared/arch/hooks/use-action-loadable'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { AppState } from 'shared/data-access/state/app-state'
import chrono, { eachYearOfInterval } from 'shared/utils/chrono'

function SelectYear() {
  const { t } = useTranslation()
  const { loggedUser } = useGlobalState(AppState)
  const { selectedYear } = useGlobalState(VacationsState)

  const [getVacationsByYear, pending] = useActionLoadable(GetVacationsByYearAction)

  const handleYearChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    await getVacationsByYear(parseInt(event.target.value))
  }

  const years = eachYearOfInterval({
    start: chrono(loggedUser!.hiringDate).getDate(),
    end: chrono()
      .plus(1, 'year')
      .getDate()
  })

  const selectBgColor = useColorModeValue('white', undefined)

  return (
    <Flex flexBasis={['150px', 'unset']}>
      <FormControl id="year">
        <FormLabel>{t('vacation.select_year')}</FormLabel>
        <Stack direction="row" spacing={2} alignItems="center">
          <Select value={selectedYear} onChange={handleYearChange} w={100} bgColor={selectBgColor}>
            {years.map((year, index) => (
              <option key={index} value={chrono(year).get('year')}>
                {chrono(year).get('year')}
              </option>
            ))}
          </Select>
          {pending && <Spinner size="sm" />}
        </Stack>
      </FormControl>
    </Flex>
  )
}

export default observer(SelectYear)

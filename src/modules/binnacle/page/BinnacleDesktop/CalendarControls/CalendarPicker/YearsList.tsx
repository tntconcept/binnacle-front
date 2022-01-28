import { SimpleGrid, Button } from '@chakra-ui/react'
import { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import chrono, { eachYearOfInterval } from 'shared/utils/chrono'

interface Props {
  hiringDate: Date
  onSelect: (year: Date) => void
}

export const YearsList = forwardRef((props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
  const years = eachYearOfInterval({
    start: chrono(props.hiringDate).getDate(),
    end: chrono().getDate()
  })

  return (
    <SimpleGrid columns={4} maxWidth="275px" spacing={2}>
      {years.map((year, index) => (
        <Button
          key={index}
          variant={chrono(year).isThisYear() ? 'solid' : 'ghost'}
          onClick={() => props.onSelect(year)}
          size="sm"
        >
          {year.getFullYear()}
        </Button>
      ))}
    </SimpleGrid>
  )
})

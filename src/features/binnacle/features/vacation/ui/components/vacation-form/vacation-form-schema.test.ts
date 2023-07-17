import { getAllYupErrors } from '../../../../../../../test-utils/app-test-utils'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { vacationFormSchema } from './vacation-form-schema'

describe('RequestVacationFormSchema', () => {
  it('should be valid', async () => {
    const values = {
      startDate: '2020-01-01',
      endDate: '2020-01-03',
      description: 'Lorem ipsum dolor...'
    }

    const result = await getAllYupErrors(vacationFormSchema, values)

    expect(result).toEqual({})
  })

  it('should require start date field', async () => {
    const values = {
      startDate: undefined
    }

    const result = await getAllYupErrors(vacationFormSchema, values)

    expect(result).toEqual({
      startDate: 'form_errors.field_required'
    })
  })

  it('should require end date field', async () => {
    const values = {
      endDate: undefined
    }

    const result = await getAllYupErrors(vacationFormSchema, values)

    expect(result).toEqual({
      endDate: 'form_errors.field_required'
    })
  })

  it('should validate max date of start date field', async () => {
    const values = {
      startDate: '2100-01-01'
    }

    const result = await getAllYupErrors(vacationFormSchema, values)
    const maxYear = chrono().plus(2, 'year').get('year')

    expect(result).toEqual({
      startDate: `form_errors.year_max ${maxYear}`
    })
  })

  it('should validate max date of end date field', async () => {
    const values = {
      endDate: '2100-01-01'
    }

    const result = await getAllYupErrors(vacationFormSchema, values)

    const maxYear = chrono().plus(2, 'year').get('year')
    expect(result).toEqual({
      endDate: `form_errors.year_max ${maxYear}`
    })
  })

  it('should validate that end date is equal or after start date', async () => {
    const values = {
      startDate: '2020-01-10',
      endDate: '2020-01-08'
    }

    const result = await getAllYupErrors(vacationFormSchema, values)

    expect(result).toEqual({
      endDate: 'form_errors.end_date_greater'
    })
  })

  it('should validate max length of description field', async () => {
    const values = {
      description: new Array(1050).fill('A').join('')
    }

    const result = await getAllYupErrors(vacationFormSchema, values)

    expect(result).toEqual({
      description: 'form_errors.max_length 1050 / 1024'
    })
  })
})

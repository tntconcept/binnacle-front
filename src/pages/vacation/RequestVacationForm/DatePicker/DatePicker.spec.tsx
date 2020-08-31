import React from 'react'
import { DatePicker } from 'pages/vacation/RequestVacationForm/DatePicker/DatePicker'
import { FormControl, FormLabel, Input } from '@chakra-ui/core'
import { render } from 'test-utils/app-test-utils'
import parseISO from 'date-fns/parseISO'

describe('Datepicker', () => {
  beforeEach(() => {
    cy.clock().invoke('restore')
  })

  function renderDatepicker({
    onChange = cy.stub(),
    currentDate,
    initialSelectedDate
  }: any) {
    render(
      <DatePicker
        onChange={onChange}
        currentDate={currentDate}
        initialSelectedDate={initialSelectedDate}
      >
        {(value) => (
          <FormControl id="comments" isReadOnly onClick={value.onOpenDatePicker}>
            <FormLabel htmlFor="period">Periodo de vacaciones</FormLabel>
            <Input id="period" />
          </FormControl>
        )}
      </DatePicker>
    )

    // open date picker
    cy.findByLabelText('Periodo de vacaciones').click()

    return { onChange }
  }

  it('should show selected the initial values', function() {
    renderDatepicker({
      currentDate: parseISO('2020-08-03'),
      initialSelectedDate: {
        startDate: parseISO('2020-08-04'),
        endDate: parseISO('2020-08-10')
      }
    })

    cy.findAllByTestId('is-selected').each((element, index) => {
      expect(element.text()).toMatch(new RegExp(`${index + 4}`))
    })
  })

  it('go to previous month is disabled if the current month is shown', function() {
    renderDatepicker({
      currentDate: parseISO('2020-08-03')
    })

    cy.findByLabelText('Prev month').should('be.disabled')

    cy.findByLabelText('Next month').click()

    cy.findByLabelText('Prev month').should('not.be.disabled')
  })

  it('by default the calendar has no selected date', () => {
    renderDatepicker({
      currentDate: parseISO('2020-08-03')
    })

    cy.findByTestId('is-selected').should('not.exist')
  })

  it('if already the period is selected, when the user selects other date it starts again from zero', () => {
    const { onChange } = renderDatepicker({
      currentDate: parseISO('2020-08-03')
    })

    cy.findByRole('button', { name: '12' }).click()
    cy.findByRole('button', { name: '14' })
      .click()
      .then(() => {
        expect(onChange).toHaveBeenCalledWith('12/08/2020 - 14/08/2020')
      })

    cy.findByLabelText('Periodo de vacaciones').click()
    cy.findAllByTestId('is-selected').should('have.length', 3)

    cy.findByRole('button', { name: '19' }).click()
    cy.findAllByTestId('is-selected').should('have.length', 1)

    cy.findByRole('button', { name: '20' })
      .click()
      .then(() => {
        expect(onChange).toHaveBeenCalledWith('19/08/2020 - 20/08/2020')
      })
  })

  it('select date range period between two months', () => {
    const { onChange } = renderDatepicker({
      currentDate: parseISO('2020-08-03')
    })

    cy.findByRole('button', { name: '12' }).click()

    cy.findByLabelText('Next month').click()

    cy.findByRole('button', { name: '14' })
      .click()
      .then(() => {
        expect(onChange).toHaveBeenCalledWith('12/08/2020 - 14/09/2020')
      })
  })

  it('the past days are disabled', () => {
    renderDatepicker({
      currentDate: parseISO('2020-08-03')
    })

    cy.findByText('01').should('be.disabled')
    cy.findByText('02').should('be.disabled')
    cy.findByText('03').should('not.be.disabled')
  })
})

import React from 'react'
import { render } from 'test-utils/app-test-utils'
import { RequestVacationForm } from 'pages/vacation/RequestVacationForm/RequestVacationForm'

describe('RequestVacationForm', () => {
  function renderRequestVacationForm({
    initialValues = {
      id: undefined,
      period: '',
      description: '',
      chargeYear: 'option3'
    },
    isOpen = true,
    onClose = cy.stub(),
    onRefreshHolidays = cy.stub(),
    createVacationPeriod = cy.stub(),
    updateVacationPeriod = cy.stub()
  }: any) {
    render(
      <RequestVacationForm
        initialValues={initialValues}
        isOpen={isOpen}
        onClose={onClose}
        onRefreshHolidays={onRefreshHolidays}
        createVacationPeriod={createVacationPeriod}
        updateVacationPeriod={updateVacationPeriod}
      />
    )

    return {
      initialValues,
      onClose,
      onRefreshHolidays,
      createVacationPeriod,
      updateVacationPeriod
    }
  }

  it('should be hidden', function() {
    renderRequestVacationForm({ isOpen: false })

    cy.contains('New vacation period').should('not.exist')
  })

  it('should fill the fields and send create request', function() {
    const {
      createVacationPeriod,
      onRefreshHolidays,
      onClose
    } = renderRequestVacationForm({})

    cy.findByLabelText('Vacation period').click()
    cy.findByRole('button', { name: '24' }).click()
    cy.findByRole('button', { name: '28' }).click()

    cy.findByLabelText('Description').type('Lorem ipsum ...')
    cy.findByLabelText('Charge year')
      .select('2020')
      .should('have.value', '2020')

    cy.findByRole('button', { name: 'Save' })
      .click()
      .then(() => {
        expect(createVacationPeriod).toHaveBeenCalledWith({
          beginDate: '24/04/2020',
          chargeYear: '2020',
          finalDate: '28/04/2020',
          id: undefined,
          userComment: 'Lorem ipsum ...'
        })
        expect(onRefreshHolidays).toHaveBeenCalled()
        expect(onClose).toHaveBeenCalled()
      })
  })

  it('should open the modal with the fields filled and send update request', function() {
    const initialValues = {
      id: 1,
      period: '12/08/2020 - 14/08/2020',
      description: 'Lorem ipsum dolorum...',
      chargeYear: '2020'
    }

    const {
      updateVacationPeriod,
      onClose,
      onRefreshHolidays
    } = renderRequestVacationForm({
      initialValues: initialValues
    })

    cy.findByLabelText('Vacation period').should('have.value', initialValues.period)
    cy.findByLabelText('Description').should('have.value', initialValues.description)
    cy.findByLabelText('Charge year').should('have.value', initialValues.chargeYear)

    cy.findByRole('button', { name: 'Save' })
      .click()
      .then(() => {
        expect(updateVacationPeriod).toHaveBeenCalledWith({
          beginDate: '12/08/2020',
          chargeYear: '2020',
          finalDate: '14/08/2020',
          id: 1,
          userComment: 'Lorem ipsum dolorum...'
        })
        expect(onRefreshHolidays).toHaveBeenCalled()
        expect(onClose).toHaveBeenCalled()
      })
  })

  it('should close the modal clicking away', function() {
    const { onClose } = renderRequestVacationForm({})

    // simulate that the user clicks outside of the modal
    cy.get('body')
      .click()
      .then(() => expect(onClose).toHaveBeenCalled())
  })

  it('should close the modal clicking on the close button', function() {
    const { onClose } = renderRequestVacationForm({})

    cy.findByLabelText('Close')
      .should('have.focus')
      .click()
      .then(() => {
        expect(onClose).toHaveBeenCalled()
      })
  })
})

import React from 'react'
import { render } from 'test-utils/app-test-utils'
import { RequestVacationForm } from 'pages/vacation/RequestVacationForm'
import 'cypress-jest-adapter'

describe('RequestVacationForm', () => {
  beforeEach(() => {
    cy.clock().invoke('restore')
  })

  function renderRequestVacationForm({
    isOpen = true,
    onSubmit = cy.stub(),
    onClose = cy.stub(),
    onOpen = cy.stub(),
    initialValues = {
      id: undefined,
      period: '',
      description: '',
      chargeYear: 'option3'
    }
  }: any) {
    render(
      <RequestVacationForm
        isOpen={isOpen}
        onSubmit={onSubmit}
        onClose={onClose}
        onOpen={onOpen}
        initialValues={initialValues}
      />
    )

    return { onSubmit, onClose, onOpen, initialValues }
  }

  it('should be hidden', function() {
    renderRequestVacationForm({ isOpen: false })

    cy.contains('Nuevo periodo de vacaciones').should('not.exist')
  })

  it('should fill the fields and submit', function() {
    const { onSubmit, onClose } = renderRequestVacationForm({})

    cy.findByLabelText('Periodo de vacaciones').click()
    cy.findByRole('button', { name: '24' }).click()
    cy.findByRole('button', { name: '28' }).click()

    cy.findByLabelText('Description').type('Lorem ipsum ...')
    cy.findByLabelText('Charge year').select('Option 2')

    cy.findByRole('button', { name: 'Send' })
      .click()
      .then(() => {
        expect(onSubmit).toHaveBeenCalled()
        expect(onClose).toHaveBeenCalled()
      })
  })

  it('should open the modal with the fields filled and submit', function() {
    const initialValues = {
      id: 1,
      period: '12/08/2020 - 14/08/2020',
      description: 'Lorem ipsum dolorum...',
      chargeYear: 'option2'
    }

    const { onSubmit, onClose } = renderRequestVacationForm({
      initialValues: initialValues
    })

    cy.findByLabelText('Periodo de vacaciones').should(
      'have.value',
      initialValues.period
    )
    cy.findByLabelText('Description').should('have.value', initialValues.description)
    cy.findByLabelText('Charge year').should('have.value', initialValues.chargeYear)

    cy.findByRole('button', { name: 'Send' })
      .click()
      .then(() => {
        expect(onSubmit).toHaveBeenCalled()
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

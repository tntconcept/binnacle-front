import React from 'react'
import { render } from '../../src/test-utils/app-test-utils'
import { RequestVacationForm } from '../../src/pages/vacation/RequestVacationForm'
import lightFormat from 'date-fns/lightFormat'
import { addDays } from 'date-fns/esm'

describe('RequestVacationForm', () => {
  function renderRequestVacationForm({
    initialValues = {
      id: undefined,
      startDate: '',
      endDate: '',
      description: '',
      chargeYear: '2020-01-01'
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

  it('should validate fields', function() {
    const largeDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget aliquet nibh praesent tristique magna sit amet. Lacinia quis vel eros donec ac. Ut sem viverra aliquet eget sit amet tellus cras. In tellus integer feugiat scelerisque varius morbi enim nunc. Blandit aliquam etiam erat velit. Urna id volutpat lacus laoreet non curabitur gravida arcu ac. Lorem mollis aliquam ut porttitor leo a diam. Vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Facilisi morbi tempus iaculis urna id volutpat lacus.

    Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula. Enim sed faucibus turpis in eu mi bibendum neque egestas. Egestas integer eget aliquet nibh. Ut diam quam nulla porttitor massa id neque aliquam vestibulum. Aliquam malesuada bibendum arcu vitae elementum. Lacus viverra vitae congue eu consequat ac felis. Adipiscing commodo elit at imperdiet dui accumsan. Consectetur purus ut faucibus pulvinar elementum integer.`

    const {
      createVacationPeriod,
      onRefreshHolidays,
      onClose
    } = renderRequestVacationForm({
      initialValues: {
        id: undefined,
        startDate: '',
        endDate: '',
        description: largeDescription,
        chargeYear: '2020-01-01'
      }
    })

    const today = lightFormat(new Date(), 'yyyy-MM-dd')
    const maxYear = new Date().getFullYear() + 1

    cy.log('Check that the min and max attributes are correct')
    cy.findByLabelText('Start date').should('have.attr', 'min', today)
    cy.findByLabelText('Start date').should('have.attr', 'max', `${maxYear}-12-31`)

    cy.findByLabelText('End date').should('have.attr', 'min', today)
    cy.findByLabelText('End date').should('have.attr', 'max', `${maxYear}-12-31`)

    cy.log('Validation runs on submit')
    cy.wait(100)
      .findByRole('button', { name: 'Save' })
      .click()
      .then(() => {
        expect(createVacationPeriod).not.toHaveBeenCalled()
        expect(onRefreshHolidays).not.toHaveBeenCalled()
        expect(onClose).not.toHaveBeenCalled()
      })

    cy.findAllByText(/field is required/i)
      .should('be.visible')
      .and('have.length', 2)
    cy.findByText('The text has to be shorter 1087 / 1024').should('be.visible')

    cy.log('Check validation of min date')
    cy.findByLabelText('Start date').type('1990-08-15')
    cy.findByLabelText('End date').type('1990-08-15')
    cy.findAllByText('The date must be greater than or equal to today')
      .should('be.visible')
      .and('have.length', 2)

    cy.log('Check validation of max date')
    cy.findByLabelText('Start date').type('2100-01-02')
    cy.findByLabelText('End date').type('2100-01-02')
    cy.findAllByText('The date must be before ' + (maxYear + 1))
      .should('be.visible')
      .and('have.length', 2)

    cy.log('Check that allows to enter a date of next year')
    cy.findByLabelText('Start date').type(`${maxYear}-11-10`)
    cy.findByLabelText('End date').type(`${maxYear}-11-10`)

    cy.log('Check that allows to enter TODAY date')
    cy.findByLabelText('Start date').type(today)
    cy.findByLabelText('End date').type(today)

    cy.findByText('The date must be greater than or equal to today').should(
      'not.exist'
    )

    cy.log('Check validation of end date after the start date')
    cy.findByLabelText('Start date').type(
      lightFormat(addDays(new Date(), 10), 'yyyy-MM-dd')
    )
    cy.findByLabelText('End date').type(today)

    cy.findByText('Must be greater than the start date').should('be.visible')
  })

  it('should fill the fields and send create request', function() {
    const {
      createVacationPeriod,
      onRefreshHolidays,
      onClose
    } = renderRequestVacationForm({})

    const startDate = '2020-08-10'
    const endDate = '2020-08-20'

    cy.findByLabelText('Start date').type(startDate)
    cy.findByLabelText('End date').type(endDate)

    cy.findByLabelText('Description').type('Lorem ipsum ...')
    cy.findByLabelText('Charge year')
      .select('2020')
      .should('have.value', '2020-01-01')

    cy.findByRole('button', { name: 'Save' })
      .click()
      .then(() => {
        expect(createVacationPeriod).toHaveBeenCalledWith({
          id: undefined,
          beginDate: startDate + 'T00:00:00.000Z',
          finalDate: endDate + 'T00:00:00.000Z',
          userComment: 'Lorem ipsum ...',
          chargeYear: '2020-01-01T00:00:00.000Z'
        })
        expect(onRefreshHolidays).toHaveBeenCalledWith(2020)
        expect(onClose).toHaveBeenCalled()
      })
  })

  it('should open the modal with the fields filled and send update request', function() {
    const initialValues = {
      id: 1,
      startDate: '2020-08-05',
      endDate: '2020-08-06',
      description: 'Lorem ipsum dolorum...',
      chargeYear: '2020-01-01'
    }

    const {
      updateVacationPeriod,
      onClose,
      onRefreshHolidays
    } = renderRequestVacationForm({
      initialValues: initialValues
    })

    cy.findByLabelText('Start date').should('have.value', initialValues.startDate)
    cy.findByLabelText('End date').should('have.value', initialValues.endDate)
    cy.findByLabelText('Description').should('have.value', initialValues.description)
    cy.findByLabelText('Charge year').should('have.value', initialValues.chargeYear)

    cy.findByRole('button', { name: 'Save' })
      .click()
      .then(() => {
        expect(updateVacationPeriod).toHaveBeenCalledWith({
          id: initialValues.id,
          userComment: initialValues.description,
          beginDate: initialValues.startDate + 'T00:00:00.000Z',
          finalDate: initialValues.endDate + 'T00:00:00.000Z',
          chargeYear: initialValues.chargeYear + 'T00:00:00.000Z'
        })
        expect(onRefreshHolidays).toHaveBeenCalledWith(2020)
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

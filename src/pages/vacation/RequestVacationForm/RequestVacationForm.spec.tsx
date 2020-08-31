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

  it('should validate fields', function () {
    const largeDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget aliquet nibh praesent tristique magna sit amet. Lacinia quis vel eros donec ac. Ut sem viverra aliquet eget sit amet tellus cras. In tellus integer feugiat scelerisque varius morbi enim nunc. Blandit aliquam etiam erat velit. Urna id volutpat lacus laoreet non curabitur gravida arcu ac. Lorem mollis aliquam ut porttitor leo a diam. Vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Facilisi morbi tempus iaculis urna id volutpat lacus.

    Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula. Enim sed faucibus turpis in eu mi bibendum neque egestas. Egestas integer eget aliquet nibh. Ut diam quam nulla porttitor massa id neque aliquam vestibulum. Aliquam malesuada bibendum arcu vitae elementum. Lacus viverra vitae congue eu consequat ac felis. Adipiscing commodo elit at imperdiet dui accumsan. Consectetur purus ut faucibus pulvinar elementum integer.`

    const {
      createVacationPeriod,
      onRefreshHolidays,
      onClose,
    } = renderRequestVacationForm({
      initialValues: {
        id: undefined,
        period: '',
        description: largeDescription,
        chargeYear: '2019'
      }
    })

    cy.findByRole('button', { name: 'Save' })
      .click()
      .then(() => {
        expect(createVacationPeriod).not.toHaveBeenCalled()
        expect(onRefreshHolidays).not.toHaveBeenCalled()
        expect(onClose).not.toHaveBeenCalled()
      })

    cy.findByText(/field is required/i).should('be.visible')
    cy.findByText(/the text has to be shorter/i).should('be.visible')
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

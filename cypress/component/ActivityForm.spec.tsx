import { BinnacleResourcesContext } from 'core/features/BinnacleResourcesProvider'
import React, { Suspense } from 'react'
import { render } from 'test-utils/app-test-utils'
import { ActivityForm } from '../../src/pages/binnacle/ActivityForm/ActivityForm'
import '@testing-library/cypress/add-commands'
import 'cypress-jest-adapter'
import { SettingsContextProvider } from 'core/components/SettingsContext'

context('ActivityForm', () => {
  beforeEach(() => {
    // Does NOT work, maybe because I'm using fetch
    // https://github.com/bahmutov/cypress-react-unit-test/tree/main/cypress/component/basic/network
    // The experimental polyfill does NOT work with fetch calls made from WebWorkers or ServiceWorker for example,
    // and we are using Mock Service Worker to mock some requests...
    // https://www.cypress.io/blog/2020/06/29/experimental-fetch-polyfill/
    cy.server()
    cy.route(/timeBalance/, {})
    cy.route(/holidays/, {
      publicHolidays: [],
      privateHolidays: []
    })
    cy.route(/activities/, [])
    cy.route(/recentRoles/, [])
    cy.route(/organizations/, [])
  })

  function renderActivityForm({
    date = new Date(),
    activity = undefined,
    lastEndTime = undefined,
    onAfterSubmit = cy.stub()
  }: any) {
    render(
      <Suspense fallback={<p>Loading</p>}>
        <SettingsContextProvider>
          <BinnacleResourcesContext.Provider
            // @ts-ignore
            value={{
              // @ts-ignore
              activitiesReader: cy.stub(() => ({
                activities: [],
                recentRoles: []
              })),
              // @ts-ignore
              holidayReader: cy.stub(() => ({
                publicHolidays: [],
                privateHolidays: []
              })),
              changeMonth: cy.stub(),
              selectedMonth: date,
              updateCalendarResources: cy.stub(),
              fetchTimeResource: cy.stub()
            }}
          >
            <ActivityForm
              date={date}
              activity={activity}
              lastEndTime={lastEndTime}
              onAfterSubmit={onAfterSubmit}
            />
          </BinnacleResourcesContext.Provider>
        </SettingsContextProvider>
      </Suspense>
    )

    return {
      date,
      activity,
      lastEndTime,
      onAfterSubmit
    }
  }

  it.only('allows paste image blob on description field', function() {
    renderActivityForm({})

    // TODO
  })

  it('updates the image saved with the new image', function() {
    renderActivityForm({})

    // TODO
  })
})

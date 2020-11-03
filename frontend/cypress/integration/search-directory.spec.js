describe('Create Booking', () => {

  beforeEach(() => {
    cy.kcLogout()
    cy.kcLogin('michel').as('tokens')
  })

  it('Loads the directory page', () => {
    cy.visit('/directory')
    cy.location('href').should('include', 'directory')
    cy.contains('Search Interpreters')
    cy.get(`button[type='submit']`).contains('Search').should('not.be.empty')
  })

  it('Searches by language, case insensitive', () => {
    cy.visit('/directory')
    cy.get('input#language').type('French')
    cy.get(`button[type='submit']`).click()
    cy.get('tr').find('td span').contains('French').should('not.be.empty')

    cy.get('input#language').clear().type('french')
    cy.get(`button[type='submit']`).click()
    cy.get('tr').find('td span').contains('French').should('not.be.empty')
  })

  it('Selects dates', () => {
    cy.visit('/directory')
    cy.get('#rangeCalButton').click()
    cy.get('span.nice-dates-day_date').contains('4').click()
    cy.get('span.nice-dates-day_date').contains('6').click()
    cy.get('span.nice-dates-day_date').contains('10').click()
    cy.get('button').contains('Add').click()
    cy.get('.searchDate').should('have.length', 3)
  })

  it('Authenticates to the API', () => {
    cy.get('@tokens').then(tokens => {
      cy.request({
        url: Cypress.env('API_URL') + '/interpreter',
        auth: {
          bearer: tokens.access_token
        }
      }).its('status').should('eq', 200)
    })
  })

})

describe('Search Bookings', () => {

  beforeEach(() => {
    cy.kcLogout()
    cy.kcLogin('michel').as('tokens')
  })

  it('Loads the bookings page', () => {
    cy.visit('/booking')
    cy.location('href').should('include', 'booking')
    cy.get(`button[type='submit']`).contains('Search').should('not.be.empty')
  })

  it('Searches by name, case insensitive', () => {
    cy.visit('/booking')
    cy.get('input#interpreter').type('Mona')
    cy.get(`button[type='submit']`).click()
    cy.get('tr').find('td span').contains('Mona').should('not.be.empty')

    cy.get('input#interpreter').clear().type('mona')
    cy.get(`button[type='submit']`).click()
    cy.get('tr').find('td span').contains('Mona').should('not.be.empty')

  })

  it('Authenticates to the API', () => {
    cy.get('@tokens').then(tokens => {
      cy.request({
        url: Cypress.env('API_URL') + '/booking',
        auth: {
          bearer: tokens.access_token
        }
      }).its('status').should('eq', 200)
    })
  })

})

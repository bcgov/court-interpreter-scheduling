describe('Search Bookings', {
  retries: 2
}, () => {

  before(() => {

    cy.clearDb()

    cy.kcLogout()
    cy.kcLogin('cypress-admin').as('tokens')
    cy.fixture('interpreters/interpreters.json').then((interpreters) => {
      cy.get('@tokens').then(tokens => {
        cy.request({
          method: 'POST',
          url: Cypress.env('API_URL') + '/interpreter/upload',
          auth: {
            bearer: tokens.access_token
          },
          body: interpreters
        })
        .then((response) => {
          cy.fixture('bookings/booking.json').then((booking) => {
            cy.request({
              method: 'POST',
              url: Cypress.env('API_URL') + '/booking',
              auth: { bearer: tokens.access_token },
              body: { ...booking, interpreterId: response.body[0].id }
            })
          })
        })
      })
    })
  })

  beforeEach(() => {
    cy.kcLogout()
    cy.kcLogin('cypress-admin').as('tokens')
  })

  it('Loads the bookings page', () => {
    cy.visit('/bookings')
    cy.location('href').should('include', 'booking')
    cy.get(`button[type='submit']`).contains('Search').should('not.be.empty')
  })

  it('Searches by name, case insensitive', () => {
    cy.visit('/bookings')
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

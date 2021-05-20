describe('Directory', {
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
      })
    })
  })

  beforeEach(() => {
    cy.kcLogout()
    cy.kcLogin('cypress-admin').as('tokens')
  })

  it('Loads the directory page', () => {
    cy.visit('/directory')
    cy.location('href').should('include', 'directory')
    cy.contains('Search Interpreters')
    cy.get(`button[type='submit']`).contains('Search').should('not.be.empty')
  })

  it('Searches by language, case insensitive', () => {
    cy.visit('/directory')
    cy.get(`input[name='language']`).type('French')
    cy.get(`button[type='submit']`).click()
    cy.get('tr').find('td span').contains('French').should('not.be.empty')

    cy.get(`input[name='language']`).clear().type('french')
    cy.get(`button[type='submit']`).click()
    cy.get('tr').find('td span').contains('French').should('not.be.empty')
  })

  it('Filters by level', () => {
    cy.visit('/directory')
    cy.get(`input[name='language']`).clear().type('Russian')
    cy.get(`input[name='level'][value='1']`).click()
    cy.get(`input[name='level'][value='2']`).click()
    cy.get(`button[type='submit']`).click()
    cy.get('tr').contains('Russian').should('have.length', 1)
  })
  
  it('Filters by name', () => {
    cy.visit('/directory')
    cy.get(`input[name='name']`).clear().type('Alex')
    cy.get(`button[type='submit']`).click()
    cy.get('tr').not('.MuiTableRow-head').not('.MuiTableRow-footer').not(':empty').should('have.length', 1)
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

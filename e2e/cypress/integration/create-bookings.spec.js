describe('Create Booking', {
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

  it('Loads the create booking page', () => {
    cy.visit('/create')
    cy.location('href').should('include', 'create')
    cy.contains('Search Interpreters')
    cy.get(`button[type='submit']`).contains('Search').should('not.be.empty')
  })

  it('Searches by language, case insensitive', () => {
    cy.visit('/create')
    cy.get(`input[name='language']`).type('French')
    cy.get(`button[type='submit']`).click()
    cy.get('tr').find('td span').contains('French').should('not.be.empty')
    cy.get(`input[name='language']`).clear().type('french')
    cy.get(`button[type='submit']`).click()
    cy.get('tr').find('td span').contains('French').should('not.be.empty')
  })

  it('Selects dates', () => {
    cy.visit('/create')
    cy.get('#rangeCalButton').click()
    cy.get('span.nice-dates-day:not(.-disabled) span.nice-dates-day_date').eq(1).click()
    cy.get('span.nice-dates-day:not(.-disabled) span.nice-dates-day_date').eq(2).click()
    cy.get('span.nice-dates-day:not(.-disabled) span.nice-dates-day_date').eq(3).click()
    cy.get('button').contains('Add').click()
    cy.get('.searchDate').should('have.length', 3)
  })

  it('Creates a new booking', () => {
    cy.visit('/create')
    // type french, select days and search
    cy.get(`input[name='language']`).type('French')
    cy.get('#rangeCalButton').click()
    cy.get('span.nice-dates-day:not(.-disabled) span.nice-dates-day_date').eq(1).click()
    cy.get('span.nice-dates-day:not(.-disabled) span.nice-dates-day_date').eq(2).click()
    cy.get('span.nice-dates-day:not(.-disabled) span.nice-dates-day_date').eq(3).click()
    cy.get('button').contains('Add').click()
    cy.get(`button[type='submit']`).click()
    
    // open booking modal, fill in fields
    cy.get(`.intSearchButton button[type='button']`).contains('Book').click()
    cy.get(`input[name='room']`).type('101b')
    cy.get(`input[name='file']`).type('121')
    cy.get(`input[name='locationId']`).type('Vancouver')
    cy.get('li').contains('Vancouver Law Courts').click()
    cy.get(`input[name='caseName']`).type('Test vs Try')
    cy.get(`input[name='federal'][value='no']`).click()
    cy.get(`input[name='reason']`).type('FA')
    cy.get(`input[name='prosecutor']`).type('Harry')
    cy.get(`textarea[name='comment']`).type('No comment')
    cy.get(`button[type='button']`).contains('Create Booking').click()
    // check redirect and presence of new booking
    cy.location('href').should('include', 'bookings')
    cy.contains('Test vs Try')
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

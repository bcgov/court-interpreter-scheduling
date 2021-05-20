describe('Update Booking', {
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
  
  it('Updates a booking status to booked', () => {
    cy.visit('/bookings')
    cy.get('input#interpreter').type('Mona')
    cy.get(`button[type='submit']`).click()
    cy.get(`[title='Edit Booking']`).click()
    cy.wait(500)
    cy.get('select#status').select('Booked')
    cy.get('button').contains('Update Booking').click()
    cy.contains('Booked')
  })

  it('Updates a booking to pending', () => {
    cy.visit('/bookings')
    cy.get('input#interpreter').type('Mona')
    cy.get(`button[type='submit']`).click()
    cy.get(`[title='Edit Booking']`).click()
    cy.wait(500)
    cy.get('select#status').select('Pending')
    cy.get('button').contains('Update Booking').click()
    cy.contains('Pending')
  })
  
  it('Updates a booking status to cancelled', () => {
    cy.visit('/bookings')
    cy.get('input#interpreter').type('Mona')
    cy.get(`button[type='submit']`).click()
    cy.get(`[title='Edit Booking']`).click()
    cy.wait(500)
    cy.get('select#status').select('Cancelled')
    cy.get('button').contains('Update Booking').click()
    cy.contains('Cancelled')
  })

  it('Updates a booking location', () => {
    cy.server()
    cy.route({
      method: 'PATCH',
      url: '/api/v1/booking/*',
    }).as('updateBookingRequest')

    cy.visit('/bookings')
    cy.get('input#interpreter').type('Mona')
    cy.get(`button[type='submit']`).click()
    cy.get(`[title='Edit Booking']`).click()
    cy.wait(500)
    cy.get(`.MuiDialogContent-root input[name='locationId']`).type('Victoria')
    cy.get('li').contains('Victoria').click()
    cy.get('button').contains('Update Booking').click()
    
    cy.wait('@updateBookingRequest').then(({ requestBody, responseBody, status }) => {
      expect(status).to.eq(200)
    })
  })

})

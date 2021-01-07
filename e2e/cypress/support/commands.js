// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('clearDb', () => {
  cy.kcLogout()
  cy.kcLogin('cypress-admin').as('tokens')
  cy.get('@tokens').then(tokens => {
    cy.request({
      method: 'POST',
      url: Cypress.env('API_URL') + '/booking/search',
      auth: { bearer: tokens.access_token },
      body: JSON.stringify({ startFromToday: false })
    })
      .then(async response => {
        cy.log(response)
        await Promise.all(response.body.data.map(booking => {
          cy.request({
            method: 'DELETE',
            url: Cypress.env('API_URL') + '/booking/' + booking.id,
            auth: { bearer: tokens.access_token }
          })
        }))
      })

    cy.request({ url: Cypress.env('API_URL') + '/interpreter', auth: { bearer: tokens.access_token } })
      .then(async int_response => {
        cy.log(int_response)
        await Promise.all(int_response.body.data.map(interpreter => {
          cy.request({
            method: 'DELETE',
            url: Cypress.env('API_URL') + '/interpreter/' + interpreter.id,
            auth: { bearer: tokens.access_token }
          })
        }))
      })
    })
})
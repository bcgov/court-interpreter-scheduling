describe('Login', () => {

  it('Visits the scheduler and is shown the login page', () => {
    cy.visit('/')
    cy.contains('Login')
  })

  it('Handles input and logs in', () => {
    cy.visit('/')
    cy.get(`input[name='email']`)
      .type('any@email.com')
      .should('have.value', 'any@email.com')
    cy.get(`input[name='password']`)
      .type('password')
      .should('have.value', 'password')
    cy.get(`button#loginButton`).click()
    cy.url().should('include', '/booking')
  })
})

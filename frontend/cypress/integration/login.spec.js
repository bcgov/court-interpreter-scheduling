describe('Login', () => {

  beforeEach(() => {
    cy.kcLogout()
  })

  it('Logs in via keycloak', () => {
    cy.visit('/')
    cy.contains('Log In')
    cy.contains('Need Help?')
    cy.get('button').click()
    cy.url().should('include', 'auth/realms/court')
    cy.url().should('include', 'keycloak')

    cy.fixture('users/michel.json').then(michel => {
      cy.get(`input[name='username']`)
        .type(michel.username)
        .should('have.value', michel.username)
      cy.get(`input[name='password']`)
        .type(michel.password)
        .should('have.value', michel.password)
      cy.get(`input[name='login']`).click()
      cy.url().should('include', 'booking')
    })
  })

  it('Logs out via UI', () => {
    cy.kcLogin('michel')
    cy.visit('/')
    cy.get('p').contains('Logout').click()
    cy.url().should('include', 'login')
  })

})

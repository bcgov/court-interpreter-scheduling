describe('Login', {
  retries: 2
}, () => {

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

    cy.fixture('users/cypress-admin.json').then(admin => {
      cy.get(`input[name='username']`)
        .type(admin.username)
        .should('have.value', admin.username)
      cy.get(`input[name='password']`)
        .type(admin.password)
        .should('have.value', admin.password)
      cy.get(`input[name='login']`).click()
      cy.url().should('include', 'booking')
    })
  })

  it('Logs out via UI', () => {
    cy.kcLogin('cypress-admin')
    cy.visit('/')
    cy.get('p').contains('Logout').click()
    cy.url().should('include', 'login')
  })

})

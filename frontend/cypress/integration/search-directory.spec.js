describe('Search Directory', () => {

  beforeEach(() => {
    localStorage.setItem('TOKEN', 'someauthtoken')
  })

  it('Loads the directory', () => {
    cy.visit('/directory')
    cy.contains('Search Interpreters')
  })

})

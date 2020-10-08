describe('Search Bookings', () => {

  beforeEach(() => {
    localStorage.setItem('TOKEN', 'someauthtoken')
  })

  it('Loads the bookings page', () => {
    cy.visit('/booking')
    cy.contains('Upcoming Bookings')
  })

})

describe('CurrencyPage', () => {
  it('Should load the page', () => {
    cy.visit('https://paix.centrino.co.ke')

    cy.origin('https://paix.centrino.co.ke:44310', () => {
      
      cy.get('input#Username').type('schebet')
      cy.get('input#Password').type('Passw0rd!')

      cy.get('button').contains('Login').click()
    })

    cy.get('.outer-menu[title="SYSTEM ADMINISTRATION"]').click()
    cy.get('[title="1003"]').click()
    cy.get('.submenu2 > :nth-child(1) > .tooltip-container > .shadow').click()
    
      cy.get('.nav-tab-list > :nth-child(1)').click()
      cy.get('[title="CREDIT MANAGEMENT"]').click()
      cy.get(':nth-child(4) > .submenu-list > :nth-child(1)').click()
    cy.get('[title="5504"]').click()
    cy.get(':nth-child(2) > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(1) > .form-control > .btn > .uil').click()
    cy.get('.mb-2 > :nth-child(2) > .checkbox-wrapper-19 > .check-box').click()
    
    
/*cy.contains('td', 'LN12345') // find the table cell with loan number
  .parent('tr')              // go up to the row
  .find('[data-cy="btn-view-loan"]') // find the action button in that row
  .click()

    cy.get('.no-filter')*/
    
    
   
  
  })
})


//
/**
 * 
 */

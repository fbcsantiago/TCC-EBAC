Cypress.Commands.add('login', (usuario, senha) => {
    cy.fixture('perfil').then((user) => {
        cy.visit('minha-conta')
        cy.get('#username').type(usuario || user.usuario)
        cy.get('#password').type(senha || user.senha, { log: false })
        cy.get('.woocommerce-form > .button').click()
        cy.get('.page-title').should('contain', 'Minha conta')
        cy.url().should('include', 'minha-conta')
    })
 })

Cypress.Commands.add('preCadastro', (email, senha, nome, sobrenome) => {
    cy.get('#reg_email').type(email)
    cy.get('#reg_password').type(senha)
    cy.get(':nth-child(4) > .button').click()
    cy.get('.woocommerce-MyAccount-navigation-link--edit-account > a').click()
    cy.get('#account_first_name').type(nome)
    cy.get('#account_last_name').type(sobrenome)
    cy.get('.woocommerce-Button').click()

})

Cypress.Commands.add('detalhesConta' , (nome, sobrenome, usuario) => {
    cy.visit('minha-conta/edit-account/')
    cy.get('#account_first_name').clear().type(nome)
    cy.get('#account_last_name').clear().type(sobrenome)
    cy.get('#account_display_name').clear().type(usuario)
    cy.get('.woocommerce-Button[name="save_account_details"]').click()
    cy.get('.woocommerce-message').should('contain', 'Detalhes da conta modificados com sucesso.')

});

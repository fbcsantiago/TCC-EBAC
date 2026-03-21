Cypress.Commands.add('login', (usuario, senha, options = {}) => {
    cy.fixture('perfil').then((user) => {
        const { validarSucesso = true, visitarPagina = true } = options;

        if (visitarPagina) {
            cy.visit('minha-conta')
        }

        cy.get('body').then(($body) => {
            if (!$body.find('#username').length) {
                if ($body.find('.woocommerce-MyAccount-navigation-link--customer-logout a').length) {
                    cy.get('.woocommerce-MyAccount-navigation-link--customer-logout a').click()
                } else {
                    cy.clearCookies()
                    cy.clearLocalStorage()
                    cy.visit('minha-conta')
                }
            }
        })

        cy.get('#username', { timeout: 10000 }).clear().type(usuario || user.usuario)
        cy.get('#password', { timeout: 10000 }).clear().type(senha || user.senha, { log: false })
        cy.get('.woocommerce-form > .button').click()

        if (validarSucesso) {
            cy.get('.page-title').should('contain', 'Minha conta')
            cy.url().should('include', 'minha-conta')
        }
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

 })

Cypress.Commands.add('limparCarrinho', () => {
    cy.visit('/carrinho')

    function removerCupons() {
        cy.get('body').then($body => {
            if ($body.find('a.woocommerce-remove-coupon').length) {
                cy.get('a.woocommerce-remove-coupon').first().click({ force: true })
                cy.wait(800)
                removerCupons()
            }
        })
    }

    function removerPrimeiroItem() {
        cy.get('body').then($body => {
            if ($body.find('.remove').length) {
                cy.get('.remove').first().click({force: true})
                cy.wait(800)
                removerPrimeiroItem()
            }
        })
    }

    removerCupons()
    removerPrimeiroItem()
})

Cypress.Commands.add('criarCupomApiUnico', (baseCode, amount, discount_type, description) => {
    const code = `${baseCode}_${Date.now()}`;
    cy.request({
        method: 'POST',
        url: '/wp-json/wc/v3/coupons',
        headers: {
            Authorization: 'Basic YWRtaW5fZWJhYzpAYWRtaW4hJmJAYyEyMDIy',
            'Content-Type': 'application/json'
        },
        body: {
            code,
            amount,
            discount_type,
            description
        },
        failOnStatusCode: false
    }).then((response) => {
        if (response.status === 201) {
            Cypress.env('cupom_gerado', code);
            return code;
        } else {
            throw new Error('Erro ao criar cupom único: ' + JSON.stringify(response.body));
        }
    });
});

/// <reference types="cypress" />
let dadosLogin

context('Funcionalidade: Login', () => {
    const seletorErro = '.woocommerce-error, .woocommerce-error li, .alert-error, .error';

    before(() => {
        cy.fixture('perfil').then(perfil => {
            dadosLogin = perfil
        })
    });

    beforeEach(() => {
        cy.visit('minha-conta')   
    });

    afterEach(() => {
        cy.screenshot()
    });

    it('Somente usuários ativos podem fazer login', () => {
        cy.login(dadosLogin.usuario, dadosLogin.senha)
        cy.get('.page-title').should('contain', 'Minha conta')

        cy.visit('minha-conta')
        const usuarioInativo = Cypress.env('usuarioInativo') || `inativo_${Date.now()}@ebac.com.br`;
        const senhaInativo = Cypress.env('senhaInativo') || dadosLogin.senha;

        cy.login(usuarioInativo, senhaInativo, { validarSucesso: false, visitarPagina: false })
        cy.get(seletorErro)
            .should('be.visible')
            .invoke('text')
            .then((msg) => {
                const texto = msg.toLowerCase();
                expect(texto).to.match(/erro|inv[aá]lido|inativo|incorreta|desconhecido/);
            })
    });

    it('Deve exibir mensagem de erro para login ou senha inválidos', () => {
        cy.login(dadosLogin.usuario, `${dadosLogin.senha}_invalida`, { validarSucesso: false, visitarPagina: false })
        cy.get(seletorErro)
            .should('be.visible')
            .invoke('text')
            .then((msg) => {
                const texto = msg.toLowerCase();
                expect(texto).to.match(/erro|inv[aá]lido|incorreta|desconhecido/);
            })
    });

    it('Login deve permitir e-mail, nome de usuário ou cpf', function () {
        const email = dadosLogin.usuario;
        const nomeUsuario = dadosLogin.nomeUsuario || Cypress.env('nomeUsuarioLogin');
        const cpf = dadosLogin.cpf || Cypress.env('cpfLogin');

        cy.login(email, dadosLogin.senha, { visitarPagina: false })
        cy.get('.page-title').should('contain', 'Minha conta')

        if (!nomeUsuario || !cpf) {
            this.skip();
        }

        cy.visit('minha-conta')
        cy.login(nomeUsuario, dadosLogin.senha, { visitarPagina: false })
        cy.get('.page-title').should('contain', 'Minha conta')

        cy.visit('minha-conta')
        cy.login(cpf, dadosLogin.senha, { visitarPagina: false })
        cy.get('.page-title').should('contain', 'Minha conta')
    })

    it('Após 3 erros de senha deve bloquear login por 15 minutos', () => {
        const senhaInvalida = `${dadosLogin.senha}_invalida`;

        Cypress._.times(3, () => {
            cy.login(dadosLogin.usuario, senhaInvalida, { validarSucesso: false, visitarPagina: false })
            cy.get(seletorErro).should('be.visible')
        })

        cy.login(dadosLogin.usuario, dadosLogin.senha, { validarSucesso: false, visitarPagina: false })

        cy.get(seletorErro)
            .should('be.visible')
            .invoke('text')
            .then((msg) => {
                const texto = msg.toLowerCase();
                expect(texto).to.match(/15|minuto|bloquead|tente novamente|aguarde/);
            })
    })

    it('Login usando fixture', () => {
        cy.fixture('perfil').then((dados) => {
            cy.login(dados.usuario, dados.senha)
        })
        cy.get('.page-title').should('contain', 'Minha conta')
    });

     it('Deve fazer login com sucesso - sem otimização', () => {
        cy.get('#username').type(dadosLogin.usuario)
        cy.get('#password').type(dadosLogin.senha, { log: false })
        cy.get('.woocommerce-form > .button').click()
        cy.get('.page-title').should('contain', 'Minha conta')
    })
})
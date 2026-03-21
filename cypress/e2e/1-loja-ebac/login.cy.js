/// <reference types="cypress" />
let dadosLogin

context('Funcionalidade: Login', () => {
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

    it('Login com sucesso usando Comando customizado', () => {
        cy.login(dadosLogin.usuario, dadosLogin.senha)
        cy.get('.page-title').should('contain', 'Minha conta')
    });

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

    it('Deve bloquear o usuário se errar a senha 3 vezes, travando o login por 15 minutos', () => {
        const senhaInvalida = `${dadosLogin.senha}_invalida`;
        const seletorErro = '.woocommerce-error, .woocommerce-error li, .alert-error, .error';

        Cypress._.times(3, () => {
            cy.login(dadosLogin.usuario, senhaInvalida, { validarSucesso: false, visitarPagina: false })
            cy.get(seletorErro).should('be.visible')
        })

        cy.login(dadosLogin.usuario, dadosLogin.senha, { validarSucesso: false, visitarPagina: false })
        cy.get('body').then(($body) => {
            const mensagemErro = $body.find(seletorErro).text().trim().toLowerCase();
            if (mensagemErro) {
                expect(mensagemErro).to.match(/15|minuto|bloquead|tente novamente|aguarde/);
                return;
            }

            if ($body.find('.page-title').text().includes('Minha conta')) {
                throw new Error('Regra não aplicada: usuário conseguiu logar após 3 tentativas inválidas.');
            }

            throw new Error('Não foi possível validar bloqueio: nenhuma mensagem de erro encontrada após tentativa de login.');
        })
    })
})
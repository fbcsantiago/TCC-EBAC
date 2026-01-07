/// <reference types="cypress"/>
import produtosPage from "../../support/page_objects/produtos.page"


describe('funcionalidade: Produtos', () => {

    beforeEach(() => {
        cy.login();
        produtosPage.visitarUrl();     

    });

    it('Deve selecionar um produto da lista', () => {
        produtosPage.buscarProdutoLista('Ajax Full-Zip Sweatshirt')
        cy.get('#tab-title-description > a').should('contain', 'Descrição')
    });

    it('Deve buscar um produto com sucesso', () => {
        let produto = 'Apollo Running Short'
        produtosPage.buscarProduto(produto)
        cy.get('.product_title').should('contain', produto)
    });

    it('Deve visitar a página do produto', () => {
        produtosPage.visitarProduto('Apollo Running Short')
        cy.get('.product_title').should('contain', 'Apollo Running Short')
    });

    it('Deve adicionar produto ao carrinho', () => {
        let qtd = 4
        produtosPage.buscarProduto('Aero Daily Fitness Tee')
        produtosPage.addProdutoCarrinho('M', 'Brown', qtd)

        cy.get('.woocommerce-message').should('contain', qtd + ' × “Aero Daily Fitness Tee” foram adicionados no seu carrinho.')

    });
    it('Deve adicionar produto ao carrinho buscando da massa de dados', () => {
        cy.fixture('produtos').then(dados => {
            produtosPage.buscarProduto(dados[2].nomeProduto)
            produtosPage.addProdutoCarrinho(
                dados[2].tamanho,
                dados[2].cor,
                dados[2].quantidade)
            cy.get('.woocommerce-message').should('contain', dados[2].nomeProduto)

        })
    });
    it('Deve validar minha compra', () => {
        cy.fixture('produtos').then(dados => {
            produtosPage.buscarProduto(dados[2].nomeProduto)
            produtosPage.addProdutoCarrinho(
                dados[2].tamanho,
                dados[2].cor,
                dados[2].quantidade)
            cy.get('.woocommerce-message').should('contain', dados[2].nomeProduto)
            produtosPage.validarCompra()
            cy.get('.woocommerce-notice.woocommerce-notice--success.woocommerce-thankyou-order-received').should('contain' , 'Obrigado. Seu pedido foi recebido.')
        })

      

    })

});
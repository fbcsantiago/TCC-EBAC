/// <reference types="cypress"/>
import produtosPage from "../../support/page_objects/produtos.Page"


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
        cy.limparCarrinho();
        let qtd = 2
        produtosPage.buscarProduto('Aero Daily Fitness Tee')
        produtosPage.addProdutoCarrinho('M', 'Yellow', qtd)
        cy.get('.woocommerce-message').should('contain', qtd + ' × “Aero Daily Fitness Tee” foram adicionados no seu carrinho.')

    });
    it('Deve adicionar produto ao carrinho buscando da massa de dados', () => {
        cy.limparCarrinho();
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
        cy.limparCarrinho();
        cy.fixture('perfil').then(perfil => {
            cy.detalhesConta(perfil.nome, perfil.sobrenome, perfil.nomeExibicao)
            produtosPage.visitarUrl()
        })
        cy.fixture('produtos').then(dados => {
            produtosPage.buscarProduto(dados[2].nomeProduto)
            produtosPage.addProdutoCarrinho(
                dados[2].tamanho,
                dados[2].cor,
                dados[2].quantidade)
            cy.get('.woocommerce-message').should('contain', dados[2].nomeProduto)
            cy.fixture('perfil').then(perfil => {
                produtosPage.validarCompra(perfil.checkout)
            })
            cy.get('.woocommerce-notice.woocommerce-notice--success.woocommerce-thankyou-order-received').should('contain' , 'Obrigado. Seu pedido foi recebido.')
        })
   
    });

    it('Não deve permitir subtotal acima de R$ 990,00', () => {
        cy.limparCarrinho();
        produtosPage.buscarProduto('Atlas Fitness Tank');
        produtosPage.addProdutoCarrinho('XS', 'Blue', 50);
        produtosPage.addProdutoCarrinho('S', 'Blue', 1); 
        cy.visit('/carrinho');
        cy.get('.cart-subtotal .amount').invoke('text').then(subtotalTxt => {
            const subtotal = parseFloat(subtotalTxt.replace(/[^0-9,]/g, '').replace(',', '.'));
            expect(subtotal).to.be.at.most(990);
        });
       
    });

    it('Deve aplicar cupom de 10% para subtotal entre R$ 200 e R$ 600', () => {
        cy.limparCarrinho();
        cy.criarCupomApiUnico('ganhe10', '10', 'percent', 'Cupom 10% para testes').then(() => {
            const cupom = Cypress.env('cupom_gerado');
            produtosPage.buscarProduto('Ajax Full-Zip Sweatshirt');
            produtosPage.addProdutoCarrinho('L', 'Red', 3); 
            cy.visit('/carrinho');
            cy.get('.cart-subtotal .amount').invoke('text').then(subtotalTxt => {
                const subtotal = parseFloat(subtotalTxt.replace(/[^0-9,]/g, '').replace(',', '.'));
                expect(subtotal).to.be.greaterThan(200);
                expect(subtotal).to.be.lessThan(600.01);
                cy.get('#coupon_code').type(cupom);
                cy.get('[name="apply_coupon"]').click();
                cy.get('.cart-discount .amount', {timeout: 5000}).invoke('text').then(descontoTxt => {
                    const desconto = parseFloat(descontoTxt.replace(/[^0-9,]/g, '').replace(',', '.'));
                    expect(desconto).to.be.closeTo(subtotal * 0.10, 0.1);
                });
            });
        });
    });

    it('Deve aplicar cupom de 15% para subtotal acima de R$ 600', () => {
        cy.limparCarrinho();
        cy.criarCupomApiUnico('ganhe15', '15', 'percent', 'Cupom 15% para testes').then(() => {
            const cupom = Cypress.env('cupom_gerado');
            produtosPage.buscarProduto('Aether Gym Pant');
            produtosPage.addProdutoCarrinho('32', 'Blue', 9); 
            cy.visit('/carrinho');
            cy.get('.cart-subtotal .amount').invoke('text').then(subtotalTxt => {
                const subtotal = parseFloat(subtotalTxt.replace(/[^0-9,]/g, '').replace(',', '.'));
                expect(subtotal).to.be.greaterThan(600);
                cy.get('#coupon_code').type(cupom);
                cy.get('[name="apply_coupon"]').click();
                cy.get('.cart-discount .amount', {timeout: 5000}).invoke('text').then(descontoTxt => {
                    const desconto = parseFloat(descontoTxt.replace(/[^0-9,]/g, '').replace(',', '.'));
                    expect(desconto).to.be.closeTo(subtotal * 0.15, 0.1);
                });
            });
        });
    });
     
    it('Não deve permitir inserir mais de 10 itens do mesmo produto ao carrinho', () => {
        cy.visit('http://lojaebac.ebaconline.art.br/produtos/')
        cy.get('.products').contains('Atlas Fitness Tank').click()
        cy.get('.button-variable-item-XS').click()
        cy.get('.button-variable-item-Blue').click()
        cy.get('.input-text qty').clear().type('11')
        cy.get('.single_add_to_cart_button').click()

        cy.get('body').then($body => {
            if ($body.text().includes('11 × “Atlas Fitness Tank” foram adicionados')) {
                throw new Error('A loja permitiu adicionar mais de 10 itens do mesmo produto ao carrinho, violando a regra de negócio.')
            }
        });

        });
});
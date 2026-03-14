class ProdutosPage{

    visitarUrl() {
       cy.visit('produtos')
    }
 
     buscarProduto(nomeProduto) {
         cy.get('[name="s"]').eq(1).type(nomeProduto)
         cy.get('.button-search').eq(1).click()
     }
 
     buscarProdutoLista(nomeProduto) {
         cy.get('.products > .row')
         .contains(nomeProduto)
         .click()
     }
 
     visitarProduto(nomeProduto) {
     //cy.visit(`produtos/${nomeProduto}`)
     const urlFormatada = nomeProduto.replace(/ /g, '-')   
     cy.visit(`produtos/${urlFormatada}`)
     }
 
     addProdutoCarrinho(tamanho,cor,quantidade) {
         cy.get('.button-variable-item-' + tamanho).click()
         cy.get(`.button-variable-item-${cor}`).click() 
         cy.get('.input-text').clear().type(quantidade)
         cy.get('.single_add_to_cart_button').click()
    }

    preencherCheckout(selector, valor) {
        if (!valor) return

        cy.get('body').then($body => {
            if ($body.find(selector).length) {
                cy.get(selector).first().clear({ force: true }).type(String(valor), { force: true })
            }
        })
    }

    preencherSelectCheckout(selector, valor) {
        if (!valor) return

        cy.get('body').then($body => {
            if ($body.find(selector).length) {
                cy.get(selector).select(String(valor), { force: true })
            }
        })
    }

     validarCompra(dadosCheckout){  
         cy.get('.woocommerce-message > a').click()
         cy.get('.wc-proceed-to-checkout > a').click()

         if (dadosCheckout) {
            this.preencherCheckout('#billing_first_name', dadosCheckout.nome)
            this.preencherCheckout('#billing_last_name', dadosCheckout.sobrenome)
            this.preencherCheckout('#billing_company', dadosCheckout.empresa)
            this.preencherSelectCheckout('#billing_country', dadosCheckout.pais)
            this.preencherCheckout('#billing_address_1', dadosCheckout.endereco)
            this.preencherCheckout('#billing_address_2', dadosCheckout.complemento)
            this.preencherCheckout('#billing_city', dadosCheckout.cidade)
            this.preencherSelectCheckout('#billing_state', dadosCheckout.estado)
            this.preencherCheckout('#billing_postcode', dadosCheckout.cep)
            this.preencherCheckout('#billing_phone', dadosCheckout.telefone)
            this.preencherCheckout('#billing_email', dadosCheckout.email)
        }

         cy.get('body').then($body => {
            if ($body.find('#terms').length) {
                cy.get('#terms').check({ force: true })
            } else if ($body.find('.woocommerce-terms-and-conditions-checkbox-text').length) {
                cy.get('.woocommerce-terms-and-conditions-checkbox-text').click({ force: true })
            }
        })

         cy.get('body').then($body => {
            if ($body.find('#place_order').length) {
                cy.get('#place_order').click({ force: true })
            } else {
                cy.get('.checkout.woocommerce-checkout').submit()
            }
        })
        


     }     
 }
 
 export default new ProdutosPage()
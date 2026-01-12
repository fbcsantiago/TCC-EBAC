class ProdutosPage {

  visitarUrl() {
    cy.visit('/produtos')
    cy.url().should('include', '/produtos')
  }

  buscarProduto(nomeProduto) {
    cy.get('input[name="s"]')
      .should('be.visible')
      .clear()
      .type(nomeProduto)

    cy.get('button.button-search')
      .should('be.visible')
      .click()
  }

  buscarProdutoLista(nomeProduto) {
    cy.get('.products')
      .contains(nomeProduto)
      .should('be.visible')
      .click()
  }

  visitarProduto(nomeProduto) {
    const urlFormatada = nomeProduto
      .toLowerCase()
      .replace(/ /g, '-')

    cy.visit(`/produtos/${urlFormatada}`)
    cy.url().should('include', urlFormatada)
  }

  addProdutoCarrinho(tamanho, cor, quantidade) {
    cy.contains('.button-variable-item', tamanho).click()
    cy.contains('.button-variable-item', cor).click()

    cy.get('input.qty')
      .clear()
      .type(quantidade)

    cy.get('button.single_add_to_cart_button')
      .should('be.enabled')
      .click()
  }

  validarCompra() {
    cy.get('.woocommerce-message a')
      .should('be.visible')
      .click()

    cy.url().should('include', 'cart')

    cy.get('.wc-proceed-to-checkout a')
      .should('be.visible')
      .click()

    cy.url().should('include', 'checkout')
  }
}

export default new ProdutosPage()

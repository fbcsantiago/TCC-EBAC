Cypress.Commands.add('token', (email, senha) => {
    cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/login`,
        body: {
            "email": email,
            "password": senha 
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.authorization
    })
 })

 Cypress.Commands.add('cadastrarProduto' , (token, produto, preco, descricao, quantidade) =>{
    cy.request({
        method: 'POST', 
        url: `${Cypress.env('apiUrl')}/produtos`,
        headers: {authorization: token}, 
        body: {
            "nome": produto,
            "preco": preco,
            "descricao": descricao,
            "quantidade": quantidade
          }, 
          failOnStatusCode: false
    })
 })

 Cypress.Commands.add('cadastrarUsuario' , (usuario, email ) =>{
    cy.request({
        method: 'POST', 
        url: `${Cypress.env('apiUrl')}/usuarios`, 
        body: {
            "nome": usuario,
            "email": email,
            "password": "teste",
            "administrador": "true"
          },
          failOnStatusCode: false
    })
})
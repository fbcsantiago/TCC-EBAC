/// <reference types="cypress" />
import contrato from '../../../contracts/produtos.contract'

describe('Testes da Funcionalidade Produtos', () => {
    let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    });

    it('Deve validar contrato de produtos', () => {
        cy.request(`${Cypress.env('apiUrl')}/produtos`).then(response => {
            return contrato.validateAsync(response.body)
        })
    });

    it('Deve listar os produtos cadastrados', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/produtos`
        }).then((response) => {
            //expect(response.body.produtos[9].nome).to.equal('Produto EBAC 436746')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(2000)
        })
    });

    it('Deve cadastrar um produto com sucesso', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`
        cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl')}/produtos`,
            body: {
                "nome": produto,
                "preco": 200,
                "descricao": "Produto novo",
                "quantidade": 100
            },
            headers: { authorization: token }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
        let produto = `Produto EBAC DUP ${Math.floor(Math.random() * 100000000)}`

        cy.cadastrarProduto(token, produto, 250, "Descrição do produto novo", 180)
            .then((response) => {
                expect(response.status).to.equal(201)

                cy.cadastrarProduto(token, produto, 250, "Descrição do produto novo", 180)
                    .then((responseRepetido) => {
                        expect(responseRepetido.status).to.equal(400)
                        expect(responseRepetido.body.message).to.equal('Já existe produto com esse nome')
                    })
            })
    });

    it('Deve editar um produto já cadastrado', () => {
        cy.request(`${Cypress.env('apiUrl')}/produtos`).then(response => {
            let id = response.body.produtos[0]._id
            let produtoEditado = `Produto Editado ${Math.floor(Math.random() * 100000000)}`
            cy.request({
                method: 'PUT', 
                url: `${Cypress.env('apiUrl')}/produtos/${id}`,
                headers: {authorization: token}, 
                body: 
                {
                    "nome": produtoEditado,
                    "preco": 100,
                    "descricao": "Produto editado",
                    "quantidade": 100
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('Deve editar um produto cadastrado previamente', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarProduto(token, produto, 250, "Descrição do produto novo", 180)
        .then(response => {
            let id = response.body._id

            cy.request({
                method: 'PUT', 
                url: `${Cypress.env('apiUrl')}/produtos/${id}`,
                headers: {authorization: token}, 
                body: 
                {
                    "nome": produto,
                    "preco": 200,
                    "descricao": "Produto editado",
                    "quantidade": 300
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('Deve deletar um produto previamente cadastrado', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarProduto(token, produto, 250, "Descrição do produto novo", 180)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `${Cypress.env('apiUrl')}/produtos/${id}`,
                headers: {authorization: token}
            }).then(response =>{
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        })
    });
});

/// <reference types="cypress" />

describe('US-0003 - API de cupons', () => {
  const authHeader = 'Basic YWRtaW5fZWJhYzpAYWRtaW4hJmJAYyEyMDIy'
  const endpoint = '/wp-json/wc/v3/coupons'

  const headers = {
    Authorization: authHeader,
    'Content-Type': 'application/json',
  }

  const criarPayloadCupom = (code) => ({
    code,
    amount: '10.00',
    discount_type: 'fixed_product',
    description: 'Cupom de teste',
  })

  const deletarCupom = (id) => {
    if (!id) return

    cy.request({
      method: 'DELETE',
      url: `${endpoint}/${id}?force=true`,
      headers,
      failOnStatusCode: false,
    })
  }

  it('Deve listar todos os cupons cadastrados', () => {
    cy.request({
      method: 'GET',
      url: endpoint,
      headers,
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('array')
    })
  })

  it('Deve listar cupom buscando por ID', () => {
    cy.request({
      method: 'GET',
      url: endpoint,
      headers,
      qs: { per_page: 1 },
    }).then((listaResponse) => {
      expect(listaResponse.status).to.equal(200)
      expect(listaResponse.body).to.be.an('array')

      if (listaResponse.body.length > 0) {
        const idExistente = listaResponse.body[0].id

        cy.request({
          method: 'GET',
          url: `${endpoint}/${idExistente}`,
          headers,
        }).then((cupomResponse) => {
          expect(cupomResponse.status).to.equal(200)
          expect(cupomResponse.body).to.have.property('id', idExistente)
        })

        return
      }

      const codigoNovo = `ganhe10-${Date.now()}`

      cy.request({
        method: 'POST',
        url: endpoint,
        headers,
        body: criarPayloadCupom(codigoNovo),
      }).then((criaResponse) => {
        expect(criaResponse.status).to.equal(201)

        const idCriado = criaResponse.body.id

        cy.request({
          method: 'GET',
          url: `${endpoint}/${idCriado}`,
          headers,
        }).then((cupomResponse) => {
          expect(cupomResponse.status).to.equal(200)
          expect(cupomResponse.body).to.have.property('id', idCriado)
        })

        deletarCupom(idCriado)
      })
    })
  })

  it('Deve cadastrar cupom com campos obrigatorios', () => {
    const codigoNovo = `ganhe10-${Date.now()}`

    cy.request({
      method: 'POST',
      url: endpoint,
      headers,
      body: criarPayloadCupom(codigoNovo),
    }).then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body).to.have.property('code')
      expect(String(response.body.code).toLowerCase()).to.equal(codigoNovo.toLowerCase())
      expect(response.body).to.have.property('amount')
      expect(response.body).to.have.property('discount_type', 'fixed_product')
      expect(response.body).to.have.property('description')

      deletarCupom(response.body.id)
    })
  })

  it('Nao deve permitir cadastrar cupom com codigo repetido', () => {
    const codigoDuplicado = `ganhe10-dup-${Date.now()}`

    cy.request({
      method: 'POST',
      url: endpoint,
      headers,
      body: criarPayloadCupom(codigoDuplicado),
    }).then((primeiroCadastro) => {
      expect(primeiroCadastro.status).to.equal(201)

      cy.request({
        method: 'POST',
        url: endpoint,
        headers,
        body: criarPayloadCupom(codigoDuplicado),
        failOnStatusCode: false,
      }).then((segundoCadastro) => {
        expect(segundoCadastro.status).to.equal(400)
        expect(segundoCadastro.body).to.have.property('message')
      })

      deletarCupom(primeiroCadastro.body.id)
    })
  })
})

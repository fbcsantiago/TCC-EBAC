/// <reference types="cypress" />

const endpoint = '/wp-json/wc/v3/coupons';
const authHeader = 'Basic YWRtaW5fZWJhYzpAYWRtaW4hJmJAYyEyMDIy';
const headers = {
    Authorization: authHeader,
    'Content-Type': 'application/json',
};

describe('[US-0003] API de cupons', () => {
    // GET - Listar todos os cupons
    it('Deve listar todos os cupons cadastrados', () => {
        cy.request({
            method: 'GET',
            url: endpoint,
            headers,
        }).should((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });
    });

    // GET - Listar cupom por ID
    it('Deve listar cupom buscando por ID', () => {
        cy.request({
            method: 'GET',
            url: endpoint,
            headers,
            qs: { per_page: 1 },
        }).then((listaResponse) => {
            expect(listaResponse.status).to.equal(200);
            expect(listaResponse.body).to.be.an('array');
            if (listaResponse.body.length > 0) {
                const idExistente = listaResponse.body[0].id;
                cy.request({
                    method: 'GET',
                    url: `${endpoint}/${idExistente}`,
                    headers,
                }).should((cupomResponse) => {
                    expect(cupomResponse.status).to.equal(200);
                    expect(cupomResponse.body).to.have.property('id', idExistente);
                });
            }
        });
    });

    // POST - Cadastrar cupom com campos obrigatórios
    it('Deve cadastrar um novo cupom com campos obrigatórios', () => {
        const code = `Ganhe10_${Date.now()}`; 
        const payload = {
            code: code,
            amount: '10.00',
            discount_type: 'fixed_product',
            description: 'Cupom de desconto de teste',
        };
        cy.request({
            method: 'POST',
            url: endpoint,
            headers,
            body: payload,
            failOnStatusCode: false
        }).should((response) => {
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('code');
            expect(response.body.code.toLowerCase()).to.equal(code.toLowerCase());
        });
    });

    // POST - Não deve permitir nome de cupom repetido
    it('Não deve permitir cadastrar cupom com nome repetido', () => {
        const code = `Ganhe10Repetido_${Date.now()}`;
        const payload = {
            code: code,
            amount: '10.00',
            discount_type: 'fixed_product',
            description: 'Cupom de desconto de teste',
        };
        // Cria o cupom pela primeira vez
        cy.request({
            method: 'POST',
            url: endpoint,
            headers,
            body: payload,
            failOnStatusCode: false
        }).then((response1) => {
            expect(response1.status).to.equal(201);
            // Tenta criar novamente com o mesmo nome
            cy.request({
                method: 'POST',
                url: endpoint,
                headers,
                body: payload,
                failOnStatusCode: false
            }).should((response2) => {
                expect(response2.status).to.be.oneOf([400, 409]); 
                expect(response2.body).to.have.property('code');
                expect(response2.body.code).to.match(/coupon_exists|duplicate|already_exists/);
            });
        });
    });
});

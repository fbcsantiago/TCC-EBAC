 


 


 QUALIDADE DE SOFTWARE


Fernanda Bezerra de Carvalho Santiago






Análise de Qualidade 







Salvador
2026
1.	RESUMO
Este projeto apresenta a análise de qualidade do site de compras da loja EBAC SHOP, com foco na validação de fluxos críticos de negócio por meio de testes em UI e API com Cypress, para isto foi feita uma proposta com planejamento de testes, critérios de aceitação, foram criados casos de testes, execução automatizada, integração continua com Jenkins e consolidação de relatórios. Os resultados foram aderentes aos requisitos implementados no repositório, com testes de cobertura de cenários de caminho feliz e cenários negativos para as histórias de usuários priorizadas, verificando sempre a estabilidade, usabilidade, desempenho e conformidade com os requisitos funcionais, com foco na experiência do usuário e prevenção de falhas em produção e melhorias. 
2.	SUMÁRIO
1.	RESUMO	2
2.	SUMÁRIO	3
3.	INTRODUÇÃO	4
4.	O PROJETO	5
4.1	Estratégia de teste	5
4.2	Critérios de aceitação	5
4.2.1	História de usuário 1: [US-0001] – Adicionar item ao carrinho	5
4.2.2	História de usuário 2: [US-0002] – Login na plataforma	6
4.2.3	História de usuário 3: [US-0003] – API de cupons	6
4.3	Casos de testes	6
4.3.1	História de usuário 1: [US-0001] – Adicionar item ao carrinho	6
4.3.2	História de usuário 2: [US-0002] – Login na plataforma	6
4.3.3	História de usuário 3: API de Cupom	7
4.4	Repositório no Github	7
4.5	Testes automatizados	7
4.5.1	Automação de UI	7
4.5.2	Automação de API	7
4.6	Integração contínua	8
4.7	Testes de performance	8
5.	CONCLUSÃO	9
6.	REFERÊNCIAS BIBLIOGRÁFICAS	9










3.	INTRODUÇÃO
O projeto do site da loja EBAC Shop, onde foi feita uma análise de qualidade, na qual poderão observar todos os aspectos qualitativos, com evidências e com muita percepção da qualidade da loja EBAC Shop, com foco na avaliação de funcionalidades como desempenho, usabilidade, compatibilidade entre plataforma e segurança do sistema.    O EBAC Shop é uma plataforma de comércio eletrônico voltada para a comercialização de produtos diversos. Por ser um canal essencial de contato com o cliente final, garantir sua estabilidade, fluidez e segurança é fundamental para a manutenção da confiança do usuário e a conversão de vendas. Durante o processo de validação, foram executados testes manuais e automatizados em diferentes ambientes, navegadores e dispositivos, utilizando ferramentas como JMeter, Postman e navegadores com console de desenvolvedor. Além disso, foram avaliadas interações reais do usuário e métricas de performance para garantir que a experiência oferecida esteja em conformidade com os padrões de qualidade esperados.  Este documento apresenta os principais achados, evidências, pontos de melhoria e recomendações para correções ou otimizações antes da liberação da versão em produção.











4.	O PROJETO
Para o Trabalho de Conclusão de Curso Qualidade de Software, você deve considerar as histórias de usuário já refinadas e como se você estivesse participando de um time ágil. As funcionalidades devem seguir todo o fluxo de trabalho de um QA, desde o planejamento até a entrega. Siga as etapas dos sub-tópicos para te orientar no trabalho. Todas as boas práticas, tanto de documentação, escrita e desenvolvimento, serão consideradas na nota. Portanto caprichem, pois além de trabalho servir como nota para o curso, vai servir como Portfólio em seu github.

4.1	Estratégia de teste
•	Técnicas aplicadas: particionamento por equivalência, valor limite e cenários negativos.
•	Abordagem: caminho feliz, caminho alternativo e caminho de erro.
•	Ferramentas: Cypress para UI e API, Jenkins para CI e Mochawesome para relatórios.
•	Evidências: arquivos de relatório em Cypress/Reports.

•	MAPA MENTAL:
 
4.2	Critérios de aceitação 

4.2.1	História de usuário 1: [US-0001] – Adicionar item ao carrinho 
Critérios de aceitação:

Cenário 1: Adicionar produto ao carrinho com sucesso.
Dado que o produto está disponível para compra. 
Quando o usuário solicitar a adição do item ao carrinho.
Então deve ser adicionado ao carrinho e atualizar a quantidade total e o valor correspondente.


Cenário 2: validação de quantidade máxima permitida.
Dado que o usuário solicita a adição de um produto ao carrinho.
Quando informar a quantidade <quantidade>
Então deve exibir o <resultado> e a mensagem “<mensagem>”

Exemplos:

Quantidade	Resultado	mensagem
5	Permitir a adição	Item adicionado ao carrinho com sucesso
10	Permitir a adição	Item adicionado ao carrinho com sucesso
11	Recusar a adição	Limite máximo de 10 unidades por produto
 

4.2.2	História de usuário 2: [US-0002] – Login na plataforma  

Critérios de aceitação:
Contexto:
Dado que o usuário acesse a página de login.

Cenário 1: Realizar login com sucesso.
Quando preencher o e-mail “Teste01@ebac.com.br”
E a senha “Ebac123@”
Então o sistema deve autenticar o usuário e conceder acesso a plataforma. 

Cenário 2: Login com credenciais inválidas.
Quando preencher o e-mail <e-mail> e senha <senha>.
Então o sistema deve negar o acesso e exibir a mensagem “<mensagem>”.

Exemplos:

Email	Senha	mensagem
Teste01@ebac.com.br	senhaErrada	e-mail ou senha inválidos
 invalido@ebac.com.br	senhaErrada	e-mail ou senha inválidos
Teste01@ebac.com.br		O campo senha é obrigatório
	Ebac123@	O campo e-mail é obrigatório


4.2.3	História de usuário 2: [US-0003] – API de cupons 
Critérios de aceitação: 



Cenário 1: Aplicação de cupom de desconto válido.
Dado que o usuário possui um cupom de desconto ativo.
Quando e informar o código do cupom na finalização da compra.
Então o sistema deve validar o código via API de cupons e aplicar o desconto correspondente no valor total.

Cenário 2: tentativa de aplicar cupons inválidos.
Dado que usuário informa um código de cupom.
Quando o código for <código>.
Então a API deve rejeitar o cupom e exibir a mensagem “<mensagem>”.

Exemplos:

código	Mensagem
Expirado10	Cupom expirado
Invalido123	Cupom inválido ou inexistente
Descontovip	Cupom não aplicável a este pedido
	Código de cupom obrigatório


4.3	 Casos de testes

4.3.1	História de usuário 1: [US-0001] – Adicionar item ao carrinho: 
•	CT01: Deve selecionar um produto da lista e adicionar ao carrinho com sucesso.
CT02: Deve adicionar quantidade válida e confirmar mensagem de sucesso.
CT03: Deve validar limite máximo permitido e tentativa acima do limite.

4.3.2	História de usuário 2: 
CT01: Deve realizar login com credenciais validas.
CT02: Deve bloquear login com senha invalida.
CT03: Deve validar obrigatoriedade de e-mail e senha.

4.3.1	História de usuário 3: API de Cupom
•	CT01: Deve listar todos os cupons cadastrados (status 200).
•	CT02: Deve retornar cupom específico ao consultar por ID valido (status 200).
•	CT03: Deve cadastrar cupom com campos obrigatórios (status 201).
•	CT04: Não deve permitir cupom com código repetido (status 400).

4.4	 Repositório no Github
•	Link do repositório: https://github.com/fbcsantiago/TCC-EBAC.git

4.5	 Testes automatizados 
4.5.1	Automação de UI 

•	Automação de UI: - cadastro.cy.js - login.cy.js - produtos.cy.js.
•	Automação de API: - login.api.cy.js - produtos.api.cy.js - cupons.api.cy.js

4.5.2	Automação de API 
•	Crie uma pasta chamada API para os testes de API da História de usuário “Api de cupons”. 
•	Faça a automação de listar os cupons e cadastrar cupom, seguindo as regras da História de usuário. 
•	Exemplo da automação de Api – GET
    it('Deve listar todos os cupons cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'coupons',
            headers: {
                authorization: 'código_da_autorização_aqui'
            }
        }).should((response) => {
            cy.log(response)
            expect(response.status).to.equal(200)
        })
    });

4.6	 Integração contínua

O projeto utiliza pipeline descrita em Jenkinsfile para instalação de dependências, execução dos testes e publicação de relatórios.

4.7	Testes de performance
•	Usando o Apache Jmeter, faça um teste de performance com o fluxo de login da História de usuário: [US-0002] – Login na plataforma 
•	Crie um template de gravação no jmeter (recording);
•	Use massa de dados dinâmica em arquivo CSV;

•	Configurações do teste de performance:  
-Usuários virtuais: 20
-Tempo de execução: 2 minutos
-RampUp: 20 segundos
-Massa de dados: Usuário / senha: 
user1_ebac / psw!ebac@test
user2_ebac / psw!ebac@test
user3_ebac / psw!ebac@test
user4_ebac / psw!ebac@test
user5_ebac / psw!ebac@test 

 

•	DICA: Em uma das requisições, após a gravação, vai aparecer os parâmetros usado. Substitua esses parâmetros pela sua massa de dados, conforme aprendido em aula:
 


5.	CONCLUSÃO
A execução deste projeto foi bastante desafiadora e, ao mesmo tempo, muito enriquecedora para a minha vida profissional e minha formação em qualidade de software.	Ao longo do projeto, consegui aplicar de forma prática os principais conceitos de QA aprendidos nas aulas, iniciando pelo planejamento, definição de estratégias de testes, elaboração de histórias de usuários e critérios de aceitação, até a estruturação do ambiente no Visual Studio Code e a automação com Cypress. Essa experiência me mostro, na prática, como um planejamento bem-feito impacta diretamente a qualidade das entregas e eficiência das validações.
	A realização do projeto também me permitiu aplicar as práticas de QA de forma integrada, conectando planejamento, automação e monitoramento de resultados. A automação com Cypress aumentou a repetibilidade dos testes e reduziu o tempo de regressão, tornando o processo mais confiável e produtivo. 
Além disso, o contato com testes de API e performance ampliou minha visão sobre qualidade, reforçando a importância de evidências objetivas para apoiar análises técnicas e tomadas de decisão.
Como lições para minha vida profissional, levo a importância de estruturar testes com clareza, priorizar cobertura funcional e não funcional desde o início e manter rastreabilidade dos resultados. 
	
6.	REFERÊNCIAS BIBLIOGRÁFICAS 

APACHE JMETER PROJECT. Apache JMeter User Manual. Disponível em: https://jmeter.apache.org/usermanual/index.html.

CYPRESS. Cypress Documentation. Disponível em: https://docs.cypress.io/.

FIELDING, R.; RESCHKE, J. RFC 7231: Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content. IETF, 2014. Disponível em: https://www.rfc-editor.org/rfc/rfc7231. 

GITHUB. GitHub Docs. Disponível em: https://docs.github.com/. 

INTERNATIONAL ORGANIZATION FOR STANDARDIZATION. ISO/IEC 25010:2011 - Systems and software engineering - Systems and software Quality Requirements and Evaluation (SQuaRE) - System and software quality models. Geneva: ISO, 2011.

ISTQB. Certified Tester Foundation Level (CTFL) Syllabus v4.0. Disponível em: https://www.istqb.org/certifications/certified-tester-foundation-level.

JENKINS. Jenkins User Documentation. Disponível em: https://www.jenkins.io/doc/. 

MOCHAWESOME. Mochawesome Reporter Documentation. Disponível em: https://github.com/adamgruber/mochawesome. 

OWASP FOUNDATION. OWASP Web Security Testing Guide. Disponível em: https://owasp.org/www-project-web-security-testing-guide/.

POSTMAN. Postman Learning Center. Disponível em: https://learning.postman.com/. 

PRESSMAN, R. S.; MAXIM, B. R. Engenharia de Software: uma abordagem profissional. 8. ed. Porto Alegre: AMGH, 2016.

SOMMERVILLE, I. Engenharia de Software. 10. ed. São Paulo: Pearson, 2019.


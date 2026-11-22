# Especificação Detalhada de Requisitos — Cantina Solidária do IFRJ

**Equipe:** Equipe Cão — Marcelo Oliveira, Cauê Augusto e Gabriel Pires  
**Projeto:** Sistema Web/App da Cantina Solidária do IFRJ — Campus Niterói  
**Semestre:** 2026.2  
**Versão deste artefato:** 1.0 — 22/11/2026  
**Documento de referência:** *Documentação Técnica do Projeto Integrador de Engenharia de Software*, versão 1.0 (12/11/2026).  
**Repositório:** https://github.com/CaueAugustoSilva/SistemaDeCantinaSolidaria

## 1. Revisão dos requisitos e delimitação do MVP

Foram revisados os requisitos **RF01–RF15**, **RNF01–RNF10** e **RN01–RN12** da documentação inicial. Todos os 15 requisitos funcionais integram o **MVP (prioridade P1)**; os requisitos não funcionais e as regras de negócio também se aplicam ao MVP, conforme sua natureza. Foram mantidos os identificadores originais para assegurar rastreabilidade.

O ciclo principal do MVP é: **consulta à vitrine → envio do pedido → aceite/recusa → preparo → retirada/entrega → registro de pagamento e venda**. A solução não executa pagamentos nem entregas externas. O Administrador Geral é previamente cadastrado; usuários podem atuar como compradores e/ou vendedores.

**Precisões utilizadas na especificação, sem criar novos requisitos:**

- **RN01/RF06:** o comprador pode selecionar produtos de vendedores diferentes durante a montagem, mas o sistema deve separá-los em **pedidos distintos**, cada um vinculado a um vendedor.
- **RN08/RF09:** o estado **Em Preparo** pode ser omitido somente para retirada no mesmo dia; **Recusado**, **Cancelado** e **Entregue** são finais. Recusa e cancelamento exigem justificativa.
- **RN09/RF05:** itens **esgotados** continuam visíveis, porém indisponíveis para inclusão em pedidos; itens **pausados/removidos** deixam de ser ofertados.
- **RN04/RF10:** o registro de pagamento pode ser **pendente, parcial ou total**. A venda somente é consolidada depois de registrada a entrega e de haver valor efetivamente recebido; pedido, pagamento e venda permanecem registros distintos.
- **RF03:** turno e quantidade prevista são opcionais no MVP, assim como foto do produto, chave Pix e comprovante de pagamento. Não se exige estoque automático.

**Pontos cuja política permanece pendente de validação com os responsáveis pela Cantina, conforme a documentação inicial:** locais/horários de retirada, regras de participação, política de cancelamento, condições de pagamento e responsabilidades sobre dados pessoais. As especificações abaixo não estabelecem novas políticas para esses pontos.

## 2. Histórias de usuário e critérios de aceitação

Os critérios são escritos em cenários **Dado / Quando / Então** e incluem fluxos inválidos ou alternativos pertinentes.

### HU01 — Cadastrar conta de usuário
**Requisitos relacionados:** RF01; RN12; RNF04, RNF09.

**História:** Como integrante da comunidade acadêmica, quero criar minha conta informando meus dados básicos e perfil de comprador e/ou vendedor, para utilizar as funcionalidades correspondentes.

**Critérios de aceitação:**
1. **Dado** que uma pessoa ainda não possui cadastro, **quando** informar nome, vínculo, campus, e-mail, telefone, credenciais e perfil permitido, **então** o sistema deverá registrar a conta com o perfil selecionado.
2. **Dado** que o e-mail já está cadastrado, **quando** solicitar outro cadastro com o mesmo e-mail, **então** o sistema deverá impedir a duplicidade e informar a ocorrência.
3. **Dado** que faltam dados obrigatórios ou há dados inválidos, **quando** solicitar o cadastro, **então** o sistema deverá indicar a correção necessária e não concluir o cadastro.
4. **Dado** que a pessoa acessa o cadastro público, **quando** visualizar os perfis disponíveis, **então** não deverá existir opção de autocadastro como Administrador Geral.

### HU02 — Autenticar e acessar o sistema
**Requisitos relacionados:** RF01, RF15; RN12; RNF04, RNF05.

**História:** Como usuário cadastrado, quero entrar no sistema com minhas credenciais, para acessar as funcionalidades autorizadas para meu perfil.

**Critérios de aceitação:**
1. **Dado** que a conta está ativa, **quando** forem informadas credenciais válidas, **então** o sistema deverá autenticar o usuário e disponibilizar seu acesso autorizado.
2. **Dado** que as credenciais são inválidas, **quando** houver tentativa de login, **então** o sistema deverá negar o acesso.
3. **Dado** que a conta foi suspensa, **quando** houver tentativa de acesso, **então** o sistema deverá impedir a autenticação/uso da conta.
4. **Dado** que o usuário possui os papéis de comprador e vendedor, **quando** acessar o sistema, **então** deverá poder utilizar as funcionalidades correspondentes aos dois papéis.

### HU03 — Manter perfil de vendedor
**Requisitos relacionados:** RF14; RN12; RNF05, RNF09.

**História:** Como vendedor, quero cadastrar e atualizar minha apresentação, meus turnos habituais e, opcionalmente, minha chave Pix, para informar aos compradores dados sobre minha atuação na Cantina.

**Critérios de aceitação:**
1. **Dado** que o usuário possui perfil de vendedor, **quando** salvar apresentação e turnos habituais válidos, **então** o sistema deverá persistir e apresentar os dados atualizados.
2. **Dado** que o vendedor não informou chave Pix, **quando** salvar o perfil, **então** o sistema deverá permitir a operação.
3. **Dado** que um usuário não possui perfil de vendedor, **quando** tentar manter um perfil de vendedor sem autorização, **então** o sistema deverá impedir a operação.

### HU04 — Cadastrar e editar produtos
**Requisitos relacionados:** RF02; RN03, RN10, RN12; RNF05, RNF08.

**História:** Como vendedor, quero cadastrar e editar os produtos da minha vitrine, para apresentar corretamente os alimentos e bebidas que comercializo.

**Critérios de aceitação:**
1. **Dado** que o vendedor está autenticado, **quando** informar nome, descrição, tipo (comida/bebida), categoria, preço unitário, aceite de encomenda e disponibilidade, **então** o sistema deverá salvar o produto; a foto poderá ser omitida.
2. **Dado** que os dados obrigatórios estão incompletos ou o preço é inválido, **quando** solicitar o salvamento, **então** o sistema deverá impedir a operação e apontar o problema.
3. **Dado** que um produto pertence ao vendedor, **quando** alterar seus dados e salvar, **então** a vitrine deverá refletir a atualização, respeitadas as datas de oferta.
4. **Dado** que o produto consta de pedidos anteriores, **quando** o preço de catálogo for alterado, **então** os preços unitários registrados nesses pedidos deverão permanecer inalterados.
5. **Dado** que o produto pertence a outro vendedor, **quando** houver tentativa de edição, **então** o sistema deverá negar a operação.

### HU05 — Pausar, esgotar ou remover produto
**Requisitos relacionados:** RF02, RF05; RN06, RN09; RNF05.

**História:** Como vendedor, quero alterar a disponibilidade, pausar ou remover produtos da vitrine, para manter a oferta coerente com o que posso vender.

**Critérios de aceitação:**
1. **Dado** que o produto está ativo e disponível, **quando** for marcado como esgotado, **então** deverá continuar visível com identificação de “Esgotado” e sem possibilidade de inclusão em novos pedidos.
2. **Dado** que o produto está ativo, **quando** o vendedor pausá-lo ou removê-lo, **então** o sistema deverá retirá-lo das novas ofertas, sem apagar fisicamente seus vínculos históricos.
3. **Dado** que existem pedidos ou vendas vinculados ao produto, **quando** ele for pausado ou removido, **então** os registros históricos deverão continuar consultáveis pelos usuários autorizados.
4. **Dado** que um vendedor tenta modificar produto de terceiro, **quando** solicitar a ação, **então** o sistema deverá impedir a alteração.

### HU06 — Definir datas de oferta
**Requisitos relacionados:** RF03; RN09, RN10; RNF05.

**História:** Como vendedor, quero definir as datas em que meus produtos serão ofertados, para indicar quando estarão disponíveis para retirada ou encomenda.

**Critérios de aceitação:**
1. **Dado** que o vendedor possui um produto, **quando** cadastrar uma data de oferta válida, **então** o sistema deverá relacionar a data ao produto.
2. **Dado** que há uma oferta cadastrada para a data atual ou futura, **quando** o comprador consultar essa data, **então** o produto deverá aparecer segundo sua situação de disponibilidade.
3. **Dado** que não há oferta do produto na data escolhida, **quando** o comprador tentar incluí-lo em pedido dessa data, **então** o sistema deverá impedir a inclusão.
4. **Dado** que o vendedor não preenche turno ou quantidade prevista, **quando** salvar uma oferta válida, **então** o cadastro deverá ser permitido, pois esses campos são opcionais no MVP.

### HU07 — Consultar e filtrar vitrine
**Requisitos relacionados:** RF04, RF05; RN09; RNF01, RNF02, RNF03, RNF08.

**História:** Como comprador, quero consultar a vitrine por data, categoria e vendedor, para localizar os produtos disponíveis no período desejado.

**Critérios de aceitação:**
1. **Dado** que existem ofertas cadastradas para a data atual ou futura, **quando** o comprador consultar a vitrine, **então** o sistema deverá apresentar os produtos ativos ofertados naquela data.
2. **Dado** que o comprador aplica filtros por data, categoria ou vendedor, **quando** confirmar a consulta, **então** a listagem deverá respeitar os filtros selecionados.
3. **Dado** que não existem ofertas correspondentes, **quando** executar a consulta, **então** o sistema deverá apresentar um resultado vazio de forma compreensível.
4. **Dado** que há produto esgotado, **quando** aparecer na vitrine, **então** deverá estar sinalizado como “Esgotado” e não poderá ser selecionado para novo pedido.
5. **Dado** que o produto está pausado, removido ou não possui oferta na data escolhida, **quando** a vitrine for consultada, **então** esse produto não deverá ser apresentado como ofertado para aquela data.

### HU08 — Montar e confirmar pedido
**Requisitos relacionados:** RF06, RF07; RN01, RN02, RN03, RN09, RN10, RN11; RNF04, RNF05.

**História:** Como comprador, quero escolher itens, quantidades, data de retirada e observações e conferir o total antes de enviar minha solicitação, para encomendar produtos da Cantina.

**Critérios de aceitação:**
1. **Dado** que os itens são elegíveis para a data escolhida, **quando** o comprador informar quantidades inteiras iguais ou maiores que 1, **então** o sistema deverá calcular subtotal = quantidade × preço unitário e total = soma dos subtotais.
2. **Dado** que o comprador selecionou itens de mais de um vendedor, **quando** confirmar a solicitação, **então** o sistema deverá gerar pedidos separados por vendedor, sem misturar seus itens.
3. **Dado** que os itens são de um vendedor e os dados são válidos, **quando** confirmar o pedido, **então** o sistema deverá registrar a solicitação com status “Pendente” e preservar os preços unitários do momento da criação.
4. **Dado** que a data de retirada é futura, **quando** o comprador incluir item que não aceita encomenda, **então** a inclusão deverá ser impedida.
5. **Dado** que o produto está esgotado, pausado ou sem oferta na data selecionada, **quando** tentar incluí-lo, **então** o sistema deverá rejeitar a inclusão.
6. **Dado** que a quantidade é zero, negativa, fracionária ou inválida, **quando** o comprador tentar confirmar o pedido, **então** o sistema deverá impedir o envio e solicitar correção.
7. **Dado** que o pedido foi enviado e está Pendente, **quando** o comprador consultar sua situação, **então** deverá ficar claro que o envio ainda não representa reserva confirmada.

### HU09 — Consultar e decidir sobre pedidos recebidos
**Requisitos relacionados:** RF08; RN02, RN08, RN12; RNF04, RNF05.

**História:** Como vendedor, quero visualizar os pedidos destinados a mim e aceitá-los ou recusá-los com motivo, para organizar o atendimento das solicitações.

**Critérios de aceitação:**
1. **Dado** que existem pedidos destinados ao vendedor, **quando** ele abrir sua fila, **então** deverá visualizar apenas seus pedidos e seus itens, quantidades, observações e dados pertinentes do comprador.
2. **Dado** que um pedido está Pendente, **quando** o vendedor aceitá-lo, **então** o status deverá passar para “Aceito” e a reserva será considerada confirmada.
3. **Dado** que um pedido está Pendente, **quando** o vendedor recusá-lo informando um motivo, **então** o status deverá passar para “Recusado” e o motivo deverá ser registrado.
4. **Dado** que não foi informado o motivo da recusa, **quando** tentar concluí-la, **então** o sistema deverá impedir a operação.
5. **Dado** que o pedido já foi decidido ou está em situação final, **quando** houver nova tentativa de aceite ou recusa incompatível, **então** o sistema deverá impedir a transição.

### HU10 — Atualizar atendimento e entrega
**Requisitos relacionados:** RF09; RN04, RN08; RNF04, RNF05.

**História:** Como vendedor, quero atualizar o andamento dos pedidos aceitos até a entrega, para informar o comprador sobre o preparo e a retirada.

**Critérios de aceitação:**
1. **Dado** que o pedido está Aceito, **quando** o vendedor iniciar o preparo, **então** o status deverá passar para “Em Preparo”.
2. **Dado** que o pedido está Em Preparo, **quando** o vendedor concluir o preparo, **então** deverá passar para “Pronto para Retirada”.
3. **Dado** que o pedido foi aceito para retirada no mesmo dia, **quando** o vendedor indicar que está pronto, **então** poderá passar diretamente de “Aceito” para “Pronto para Retirada”.
4. **Dado** que o pedido está Pronto para Retirada, **quando** o vendedor confirmar a entrega, **então** deverá passar para “Entregue” e registrar a entrega.
5. **Dado** que o pedido está Entregue, Recusado ou Cancelado, **quando** houver tentativa de avançar ou alterar o status, **então** o sistema deverá impedir a transição.

### HU11 — Cancelar pedido não entregue
**Requisitos relacionados:** RF09; RN08; RNF04, RNF05.

**História:** Como vendedor, quero cancelar um pedido ainda não entregue e registrar a justificativa, para formalizar a impossibilidade de concluí-lo.

**Critérios de aceitação:**
1. **Dado** que um pedido não está em situação final e não foi entregue, **quando** o vendedor informar uma justificativa e confirmar o cancelamento, **então** o status deverá passar para “Cancelado”, preservando o motivo.
2. **Dado** que o motivo não foi informado, **quando** o vendedor tentar cancelar, **então** o sistema deverá impedir o cancelamento.
3. **Dado** que o pedido já está Entregue, Recusado ou Cancelado, **quando** o vendedor tentar cancelá-lo, **então** o sistema deverá impedir a operação.
4. **Dado** que um pedido foi cancelado, **quando** o comprador consultar seu histórico, **então** deverá visualizar o status e a justificativa registrada.

### HU12 — Registrar pagamento manualmente
**Requisitos relacionados:** RF10; RN04, RN07; RNF04, RNF05.

**História:** Como vendedor, quero registrar manualmente os valores recebidos, o meio de pagamento e a situação do pagamento, para acompanhar o recebimento de cada pedido.

**Critérios de aceitação:**
1. **Dado** que o vendedor acessa um pedido próprio, **quando** informar um pagamento recebido com valor e meio válidos, **então** o sistema deverá registrar o pagamento vinculado ao pedido.
2. **Dado** que o valor registrado é inferior ao total do pedido, **quando** consultar a situação financeira, **então** deverá ser possível identificar pagamento parcial e o valor recebido registrado.
3. **Dado** que o valor devido foi integralmente registrado, **quando** consultar a situação financeira, **então** deverá constar pagamento total; na ausência de valor recebido, a situação deverá ser pendente.
4. **Dado** que o registro é manual, **quando** o vendedor lançar um pagamento, **então** o sistema não deverá executar transação bancária nem apresentar validação automática de Pix ou transferência.
5. **Dado** que o valor informado é inválido ou o meio não foi indicado para um pagamento recebido, **quando** tentar salvar, **então** o sistema deverá rejeitar o registro incompleto/inválido.

### HU13 — Consolidar venda após entrega
**Requisitos relacionados:** RF10; RN04, RN05, RN07; RNF04, RNF05.

**História:** Como vendedor, quero consolidar a venda de um pedido entregue com valor recebido registrado, para contabilizar corretamente minhas vendas.

**Critérios de aceitação:**
1. **Dado** que o pedido está Entregue e existe valor efetivamente recebido registrado, **quando** o vendedor consolidar a venda, **então** o sistema deverá criar o registro de venda correspondente e considerar o valor recebido nos indicadores.
2. **Dado** que o pedido não está Entregue ou não há valor recebido registrado, **quando** solicitar a consolidação, **então** o sistema deverá impedir a conclusão da venda.
3. **Dado** que já existe venda consolidada para o pedido, **quando** o vendedor tentar consolidá-la novamente, **então** o sistema deverá impedir a criação de uma segunda venda para o mesmo pedido.
4. **Dado** que o pedido está Pendente, Recusado ou Cancelado, **quando** os indicadores forem calculados, **então** esse pedido não deverá compor a receita realizada.

### HU14 — Acompanhar pedidos e histórico de compras
**Requisitos relacionados:** RF11; RN03, RN06, RN08; RNF04, RNF05.

**História:** Como comprador, quero consultar meus pedidos atuais e anteriores, para acompanhar a situação das encomendas e rever meu histórico de compras.

**Critérios de aceitação:**
1. **Dado** que o comprador possui pedidos, **quando** acessar seu histórico, **então** o sistema deverá listar seus pedidos e os respectivos estados atualizados.
2. **Dado** que um pedido foi aceito, recusado, colocado em preparo, disponibilizado para retirada, entregue ou cancelado, **quando** o comprador abrir seus detalhes, **então** deverá visualizar a situação correspondente.
3. **Dado** que o vendedor alterou ou removeu um produto posteriormente, **quando** o comprador consultar pedido anterior, **então** os itens, quantidades e preços registrados no pedido deverão permanecer preservados.
4. **Dado** que um usuário tenta consultar pedido de outro comprador sem autorização, **quando** solicitar os dados, **então** o sistema deverá negar o acesso.

### HU15 — Consultar resumo gerencial de vendas
**Requisitos relacionados:** RF12; RN04, RN05; RNF03, RNF05.

**História:** Como vendedor, quero consultar um resumo dos pedidos por situação, das vendas concluídas e da receita registrada, para acompanhar minhas atividades comerciais na Cantina.

**Critérios de aceitação:**
1. **Dado** que o vendedor possui pedidos em diferentes estados, **quando** abrir o resumo, **então** o sistema deverá apresentar a quantidade de pedidos agrupados por situação.
2. **Dado** que existem vendas consolidadas, **quando** abrir o resumo, **então** deverá visualizar a quantidade de vendas concluídas e a receita baseada nos valores efetivamente recebidos e registrados nessas vendas.
3. **Dado** que existem pedidos Pendentes, Recusados ou Cancelados, **quando** calcular a receita, **então** o sistema não deverá incluí-los como receita realizada.
4. **Dado** que um vendedor consulta o resumo, **quando** os indicadores forem exibidos, **então** deverão abranger seus próprios registros, sem revelar dados gerenciais detalhados de outro vendedor.

### HU16 — Consultar regras e orientações da Cantina
**Requisitos relacionados:** RF13; RNF01, RNF08.

**História:** Como usuário da Cantina, quero consultar as regras de participação e orientações gerais, para conhecer as condições divulgadas pela administração.

**Critérios de aceitação:**
1. **Dado** que existem regras e orientações publicadas, **quando** o usuário acessar a seção correspondente, **então** o sistema deverá apresentá-las para consulta.
2. **Dado** que não existem registros publicados, **quando** a seção for aberta, **então** o sistema deverá apresentar a ausência de conteúdo de forma compreensível.
3. **Dado** que um usuário não é Administrador Geral, **quando** tentar alterar as regras, **então** o sistema deverá impedir a operação.

### HU17 — Gerenciar regras e orientações
**Requisitos relacionados:** RF13; RN12; RNF04, RNF05.

**História:** Como Administrador Geral, quero publicar e atualizar regras e orientações da Cantina, para manter as informações de participação disponíveis aos usuários.

**Critérios de aceitação:**
1. **Dado** que o Administrador Geral está autenticado, **quando** registrar título e descrição de uma orientação válida, **então** o sistema deverá disponibilizar o conteúdo na seção de regras.
2. **Dado** que uma orientação foi publicada, **quando** o administrador atualizar seu conteúdo, **então** a consulta deverá apresentar a versão atualizada.
3. **Dado** que os campos necessários estão ausentes ou inválidos, **quando** tentar publicar, **então** o sistema deverá impedir a operação e informar o problema.
4. **Dado** que um usuário não possui perfil administrativo, **quando** tentar publicar ou alterar regras, **então** o sistema deverá negar o acesso.

### HU18 — Consultar e suspender/reativar contas
**Requisitos relacionados:** RF15; RN12; RNF04, RNF05, RNF09.

**História:** Como Administrador Geral, quero consultar usuários e suspender ou reativar suas contas, para administrar o acesso à plataforma.

**Critérios de aceitação:**
1. **Dado** que o Administrador Geral está autenticado, **quando** abrir a administração de usuários, **então** deverá visualizar os usuários cadastrados.
2. **Dado** que uma conta está ativa, **quando** o administrador suspendê-la, **então** seu acesso deverá ser bloqueado e os registros históricos preservados.
3. **Dado** que uma conta está suspensa, **quando** o administrador reativá-la, **então** o usuário deverá voltar a poder acessar o sistema com credenciais válidas.
4. **Dado** que uma conta é suspensa ou reativada, **quando** forem consultados pedidos e vendas anteriores, **então** seus registros deverão permanecer íntegros.
5. **Dado** que um usuário não é administrador, **quando** tentar consultar a administração de contas ou alterar a situação de outra conta, **então** o sistema deverá impedir a operação.

## 3. Casos de uso para fluxos complexos

### CDU01 — Realizar pedido de produtos

- **Objetivo:** registrar uma ou mais solicitações de compra para retirada, respeitando a oferta e a separação por vendedor.
- **Ator principal:** Comprador.
- **Requisitos relacionados:** RF04, RF05, RF06, RF07; RN01, RN02, RN03, RN09, RN10, RN11; RNF04, RNF05.
- **Pré-condições:** comprador autenticado e ativo; produtos cadastrados e ofertas vigentes para a data solicitada.
- **Gatilho:** comprador decide confirmar os produtos selecionados.

**Fluxo principal:**
1. O Comprador consulta a vitrine e seleciona a data de retirada.
2. O Sistema apresenta os produtos ofertados para a data e suas disponibilidades.
3. O Comprador seleciona itens, indica quantidades e informa observações, quando necessárias.
4. O Sistema valida a elegibilidade dos itens para a data e a aceitação de encomenda futura.
5. O Sistema calcula os subtotais e o total estimado dos itens selecionados.
6. O Sistema apresenta o resumo do pedido antes do envio.
7. O Comprador confirma a solicitação.
8. O Sistema agrupa os itens por vendedor e registra um pedido por vendedor, com os preços unitários vigentes na criação e status inicial **Pendente**.
9. O Sistema apresenta a confirmação de registro e informa que a reserva depende do aceite do vendedor.

**Fluxos alternativos e exceções:**
- **A1 — Mais de um vendedor (passo 8):** o Sistema cria solicitações independentes para cada vendedor, preservando a composição e o valor de cada uma.
- **E1 — Produto esgotado, pausado ou sem oferta para a data (passo 4):** o Sistema impede a inclusão ou confirmação daquele item e informa sua indisponibilidade.
- **E2 — Produto não aceita encomenda futura (passo 4):** o Sistema impede a inclusão para data futura e informa a restrição.
- **E3 — Quantidade inválida (passo 4):** o Sistema solicita correção para número inteiro maior ou igual a 1.
- **E4 — Falha de validação ao confirmar (passo 8):** o Sistema não registra pedido inválido e informa o motivo ao Comprador.

**Pós-condições:** pedidos válidos registrados como **Pendente** e vinculados a um único vendedor cada; itens, quantidades e preços originais preservados; nenhuma reserva automaticamente confirmada.

### CDU02 — Atender pedido e consolidar venda

- **Objetivo:** decidir sobre um pedido recebido, acompanhar o preparo e a entrega, registrar pagamentos manuais e, quando permitido, consolidar a venda.
- **Ator principal:** Vendedor.
- **Requisitos relacionados:** RF08, RF09, RF10, RF11, RF12; RN02, RN04, RN05, RN07, RN08; RNF04, RNF05.
- **Pré-condições:** vendedor autenticado e ativo; pedido destinado a esse vendedor e registrado no sistema.
- **Gatilho:** vendedor seleciona um pedido em sua fila de atendimento.

**Fluxo principal:**
1. O Vendedor abre a fila de pedidos recebidos.
2. O Sistema apresenta os pedidos do vendedor e seus detalhes.
3. O Vendedor seleciona um pedido **Pendente** e o aceita.
4. O Sistema altera o estado para **Aceito** e confirma a reserva.
5. O Vendedor indica o início do preparo.
6. O Sistema altera o estado para **Em Preparo**.
7. O Vendedor informa que o pedido está pronto.
8. O Sistema altera o estado para **Pronto para Retirada**.
9. O Vendedor confirma a entrega presencial.
10. O Sistema registra a entrega e altera o estado para **Entregue**.
11. O Vendedor registra manualmente o valor recebido e o meio de pagamento.
12. O Sistema registra o pagamento e sua situação, sem realizar transação bancária.
13. O Vendedor solicita a consolidação da venda.
14. O Sistema verifica a entrega e a existência de valor efetivamente recebido registrado.
15. O Sistema consolida uma única venda para o pedido e considera o valor efetivamente recebido nos indicadores.

**Fluxos alternativos e exceções:**
- **A1 — Recusa (passo 3):** o Vendedor recusa o pedido Pendente informando a justificativa; o Sistema registra o motivo e altera o status para **Recusado**, encerrando o atendimento.
- **A2 — Retirada no mesmo dia (passos 5–8):** o Vendedor pode indicar diretamente que o pedido Aceito está **Pronto para Retirada**, sem registrar a etapa Em Preparo.
- **A3 — Cancelamento antes da entrega (entre os passos 4 e 9):** o Vendedor solicita o cancelamento, informa o motivo, e o Sistema registra **Cancelado** como situação final.
- **A4 — Pagamento parcial (passo 12):** o Sistema registra a situação **Parcial** e o valor recebido; a venda somente poderá ser consolidada após entrega e com valor efetivamente recebido registrado.
- **E1 — Recusa/cancelamento sem motivo:** o Sistema rejeita a ação e solicita justificativa.
- **E2 — Transição inválida:** o Sistema impede alterações incompatíveis com RN08, incluindo qualquer alteração após situação final.
- **E3 — Consolidação antes da entrega ou sem recebimento registrado:** o Sistema impede a consolidação e informa a condição não atendida.
- **E4 — Consolidação duplicada:** o Sistema impede uma segunda venda para o mesmo pedido.

**Pós-condições:** se concluído com sucesso, pedido **Entregue**, pagamento(s) registrado(s) e uma venda consolidada vinculada ao pedido; se recusado ou cancelado, pedido em situação final sem compor a receita realizada. O comprador pode consultar a situação atual no sistema.

## 4. Requisitos não funcionais transversais — condições de verificação

| Código | Condição verificável no MVP | Incidência |
| :--- | :--- | :--- |
| **RNF01** | Verificar as telas principais em largura de **360 px** e em tela desktop, sem perda de operação das funcionalidades. | Todas as histórias com interface. |
| **RNF02** | Executar fluxos principais nas versões atuais de **Chrome, Safari, Firefox e Edge**, em contextos móveis/desktop compatíveis. | Todas as histórias com interface. |
| **RNF03** | Em condições normais de **4G/Wi-Fi**, medir carregamento da vitrine e respostas da API com tempo **inferior a 2 segundos**. | HU07 e operações da API de HU01–HU18. |
| **RNF04** | Inspecionar que senhas são tratadas por **Supabase Auth** com hash seguro; verificar que rotas protegidas recusam requisições sem **JWT válido**. | HU01–HU15, HU17–HU18 e casos de uso. |
| **RNF05** | Testar acessos com usuário autorizado e não autorizado; impedir acesso indevido a pedidos, contatos, pagamentos, vendas e informações comerciais de terceiros. | HU02–HU05, HU08–HU15, HU17–HU18. |
| **RNF06** | Revisar a organização do código em responsabilidades **Model, View e Controller**, com regras de negócio separadas das telas e estrutura que permita testes unitários. | Implementação de todo o MVP. |
| **RNF07** | Verificar, por registros de monitoramento da nuvem, disponibilidade de **no mínimo 99% entre 07h e 22h** no período acadêmico avaliado. | Sistema completo. |
| **RNF08** | Verificar contraste de texto **≥ 4,5:1**, rótulos nos formulários, texto alternativo nas fotos e navegação por teclado nas telas principais, segundo itens WCAG 2.1 AA aplicáveis. | HU01, HU03–HU08, HU14, HU16–HU18 e demais telas. |
| **RNF09** | Conferir os dados de cadastro/coleta: **nome, vínculo, campus, e-mail e telefone**, sem exigir dados sensíveis ou socioeconômicos; revisar acesso e tratamento conforme LGPD. | HU01, HU03, HU09, HU14, HU18. |
| **RNF10** | Conferir código do front-end em **React**, back-end em **Python**, persistência em **PostgreSQL/Supabase** e versionamento no **GitHub**. | Implementação de todo o MVP. |

## 5. Matriz de rastreabilidade

### 5.1 Requisitos funcionais → histórias e casos de uso

| Requisito | Histórias correspondentes | Casos de uso |
| :--- | :--- | :--- |
| RF01 | HU01, HU02 | — |
| RF02 | HU04, HU05 | — |
| RF03 | HU06 | — |
| RF04 | HU07 | CDU01 |
| RF05 | HU05, HU07 | CDU01 |
| RF06 | HU08 | CDU01 |
| RF07 | HU08 | CDU01 |
| RF08 | HU09 | CDU02 |
| RF09 | HU10, HU11 | CDU02 |
| RF10 | HU12, HU13 | CDU02 |
| RF11 | HU14 | CDU02 |
| RF12 | HU15 | CDU02 |
| RF13 | HU16, HU17 | — |
| RF14 | HU03 | — |
| RF15 | HU02, HU18 | — |

### 5.2 Regras de negócio → histórias e casos de uso

| Regra | Histórias correspondentes | Casos de uso |
| :--- | :--- | :--- |
| RN01 | HU08 | CDU01 |
| RN02 | HU08, HU09 | CDU01, CDU02 |
| RN03 | HU04, HU08, HU14 | CDU01 |
| RN04 | HU10, HU12, HU13, HU15 | CDU02 |
| RN05 | HU13, HU15 | CDU02 |
| RN06 | HU05, HU14 | — |
| RN07 | HU12, HU13 | CDU02 |
| RN08 | HU09, HU10, HU11, HU14 | CDU02 |
| RN09 | HU05, HU06, HU07, HU08 | CDU01 |
| RN10 | HU04, HU06, HU08 | CDU01 |
| RN11 | HU08 | CDU01 |
| RN12 | HU01, HU02, HU03, HU09, HU17, HU18 | — |

### 5.3 Requisitos não funcionais → verificação

Todos os **RNF01–RNF10** estão contemplados na seção **4**. Os vínculos mais diretamente funcionais estão indicados em cada história; os requisitos transversais (especialmente RNF01, RNF02, RNF06, RNF07 e RNF10) aplicam-se ao conjunto do MVP, independentemente de repetição em todas as histórias.

## 6. Resultado da revisão e controle de alterações

A revisão **não identificou necessidade de renumerar, incluir ou excluir requisitos RF, RNF ou RN** da documentação técnica inicial. As precisões da seção 1 apenas detalham comportamentos já previstos para torná-los verificáveis, preservando o escopo P1 e a rastreabilidade. Permanecem pendentes de validação com a Cantina os pontos de política já assinalados na documentação inicial. Assim, **a documentação inicial versão 1.0 pode permanecer como referência**, e este arquivo constitui o artefato complementar de especificação detalhada do MVP.

| Versão | Data | Alteração |
| :--- | :--- | :--- |
| 1.0 | 22/11/2026 | Revisão dos requisitos do MVP; elaboração de HU01–HU18, critérios de aceitação, CDU01–CDU02, verificação de RNF e matriz de rastreabilidade. |

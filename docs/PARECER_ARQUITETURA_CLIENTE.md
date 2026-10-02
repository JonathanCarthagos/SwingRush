# Parecer Arquitetural — SwingRush

## Resumo executivo

O SwingRush possui uma base web moderna, bem organizada e adequada para a atual fase de lançamento. A recomendação é manter o site como canal de aquisição e conteúdo, usar o **Vivenu como sistema de registro** para clientes, pedidos e ingressos, e avaliar o **Vivenu Engage** como solução principal para CRM e email marketing.

SMS deve entrar apenas quando houver necessidade operacional clara e consentimento explícito do público. Dessa forma, o negócio evita criar integrações complexas cedo demais e preserva uma única fonte confiável para os dados de ticketing.

Sobre a dúvida comercial levantada pelo cliente: Brevo é uma alternativa relevante porque combina email e SMS e cobra principalmente por volume de envio, o que pode parecer mais eficiente para listas grandes e pouco acionadas. Mesmo assim, para o momento atual, a recomendação continua sendo começar por Vivenu + Vivenu Engage, porque o desafio principal ainda não é apenas o custo de disparo; é garantir que waitlist, consentimentos, compradores e participação em eventos estejam conectados ao sistema de ticketing desde o início.

Nenhuma integração será implementada nesta fase. Este documento registra a direção recomendada para a evolução futura.

## Diagnóstico da arquitetura atual

O site é construído com Next.js, TypeScript e Sanity CMS. A arquitetura já separa corretamente a camada visual dos dados de conteúdo, o que permite evoluir páginas e conteúdo sem reescrever os componentes.

Pontos fortes:

- Estrutura atualizada de Next.js com páginas rápidas e foco em SEO.
- CMS desacoplado da interface: Sanity é usado para conteúdo, sem misturar regras de negócio nos componentes visuais.
- Páginas de cidades, desafios e instruções já têm contratos de dados claros, facilitando a expansão para novos mercados.
- Preview editorial e publicação de conteúdo estão limitados às áreas que efetivamente usam CMS.
- Já existe uma estrutura inicial para captação de RSVP, que pode ser substituída por uma waitlist real no momento adequado.

Lacunas para a fase comercial:

- A captação atual não cria uma base de leads segmentável nem registra consentimentos de marketing.
- O site ainda não está conectado ao ticketing, CRM ou automações de campanha.
- Não há uma origem única consolidando compras, histórico de presença e preferências por cidade.

Essas lacunas são naturais para a etapa atual do produto; não indicam necessidade de refazer a plataforma.

## Recomendação

### Vivenu como sistema de registro

O Vivenu deve ser a fonte principal de verdade para clientes, pedidos, tickets, transferências, cancelamentos e comportamento relacionado ao evento. O site não deve tentar replicar essa responsabilidade em Sanity, Resend ou em uma base paralela.

### Vivenu Engage para CRM e email

Antes de contratar uma ferramenta adicional de marketing, a recomendação é validar o Vivenu Engage. Por estar conectado aos dados de ticketing, ele tende a reduzir exportações manuais, integrações frágeis e divergências entre listas de marketing e compradores reais.

Isso permite criar segmentos práticos, como:

- Pessoas interessadas em uma cidade específica.
- Compradores de uma edição anterior que ainda não compraram para a próxima.
- Participantes recorrentes ou compradores VIP.
- Pessoas que receberam uma campanha, mas não concluíram a compra.

### SMS apenas com opt-in e necessidade comprovada

SMS deve ser tratado como um canal de urgência — por exemplo, abertura de pré-venda, último lote ou lembrete de evento — e não como substituto de email.

O número de telefone não representa autorização para marketing. A inscrição para SMS deve ser voluntária, explícita e registrada no checkout ou formulário de waitlist. Quando esse canal passar a ser necessário, deve ser adotado um fornecedor especializado que atenda às exigências de consentimento e mensageria do mercado em que o evento ocorre.

## Por que esta é a melhor opção agora

| Opção | Avaliação para o SwingRush |
| --- | --- |
| **Vivenu + Vivenu Engage + SMS especializado quando necessário** | **Recomendação.** Mantém dados de ticketing e segmentação próximos, reduz complexidade operacional e evita pagar por uma arquitetura maior do que a necessária. |
| Klaviyo | Excelente produto, mas sua economia baseada em perfis pode se tornar pouco atrativa para uma marca de eventos que ativa cada cidade apenas em janelas sazonais. |
| ActiveCampaign | Boa alternativa caso a operação exija email e SMS em uma única interface. Porém, o custo por contatos armazenados pode pesar conforme a base histórica nacional cresce. |
| Brevo | Alternativa forte caso o custo por envio seja prioritário em grande escala. Exige avaliar com mais cuidado a integração e a sincronização com o Vivenu. |

A principal vantagem da recomendação é evitar duas bases concorrentes de clientes. O dado de compra nasce no ticketing; marketing usa esse dado para segmentar e comunicar, sem se tornar a fonte oficial do histórico do cliente.

### Observação sobre Brevo e listas grandes

O argumento a favor do Brevo é válido: se uma cidade pequena tiver cerca de 15 mil emails, uma cidade grande chegar a 80 mil emails, e a operação enviar apenas algumas campanhas por ano, pagar por envio pode ser financeiramente melhor do que pagar por todos os contatos armazenados.

Esse ponto torna o Brevo uma opção que vale manter no radar, especialmente para uma fase posterior em que o SwingRush já tenha bases nacionais grandes, campanhas pouco frequentes e necessidade comprovada de operar email e SMS no mesmo painel.

Ainda assim, ele não deve ser a primeira decisão arquitetural por três motivos:

1. O primeiro problema a resolver é a **qualidade do dado**, não apenas o custo de envio. A waitlist precisa nascer com cidade de interesse, origem, consentimento e histórico futuro de compra.
2. O Vivenu já será o sistema mais próximo do dado transacional: comprador, pedido, ingresso, presença, reembolso, transferência e edição do evento.
3. Se o Brevo entrar cedo demais, a equipe pode acabar mantendo uma base de marketing separada da base real de ticketing, criando retrabalho de sincronização, risco de divergência e mais pontos de falha operacional.

Portanto, a recomendação prática é: começar com Vivenu como sistema de registro e validar o Vivenu Engage para CRM/email. Caso a análise comercial mostre que o custo por contato do Engage não atende bases muito grandes e pouco acionadas, o Brevo pode ser avaliado como camada de disparo no futuro, recebendo segmentos já qualificados a partir do Vivenu, em vez de virar a fonte principal dos dados do cliente.

## Roadmap recomendado

1. **Waitlist por cidade**
   - Criar formulário de interesse por cidade no site.
   - Registrar email, cidade de interesse, origem da campanha e consentimento de email.
   - Solicitar telefone somente se houver uma proposta clara de SMS com consentimento opcional.
   - Evitar tratar a waitlist como uma lista genérica; cada contato precisa nascer ligado a uma cidade ou mercado.

2. **Consentimentos e segmentação**
   - Manter registro de data, texto aceito e canal autorizado para cada consentimento.
   - Criar segmentos por cidade, interesse, compra e recorrência.

3. **Sincronização com ticketing**
   - Conectar eventos relevantes do Vivenu: compra, cancelamento, transferência e participação.
   - Atualizar os atributos de marketing sem duplicar o sistema de pedidos no site.

4. **Automação comercial**
   - Usar email para anúncio, conteúdo, pré-venda e relacionamento.
   - Usar SMS de forma limitada para comunicações urgentes e apenas para contatos opt-in.

## Riscos e pré-requisitos

- Confirmar com o Vivenu o escopo comercial e técnico do Engage, especialmente recursos de segmentação, automação, exportação de dados e roadmap de SMS.
- Validar requisitos legais e operacionais de consentimento para os países e estados em que os eventos ocorrerão.
- Definir uma política de privacidade e textos de consentimento antes de ativar a waitlist.
- Definir quem é responsável pela governança dos dados, campanhas e atendimento aos pedidos de descadastro.
- Não iniciar integrações diretas com múltiplas ferramentas de marketing antes de definir a fonte de verdade e o fluxo de dados.

## Próximos passos

1. Solicitar uma demonstração comercial e técnica do Vivenu Engage.
2. Confirmar se SMS é uma necessidade do primeiro ciclo de lançamento ou uma etapa posterior.
3. Definir o formulário, a política de consentimento e as cidades prioritárias para a waitlist.
4. Após essas decisões, desenhar a integração técnica sem alterar a arquitetura editorial já existente.

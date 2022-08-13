# Leitor de notas de corretagem

## Introdução
Conversor de notas de corretagem para `.csv`. Testado apenas com as notas das corretoras Rico e Clear. Automaticamente ignora notas duplicadas, mesmo que em PDFs diferentes.

## Modo de usar
1. Instale o [NodeJS](https://nodejs.org/en/). Qualquer versão acima do 14.0 serve.
2. Na hora da instalação, tenha certeza de marcar a opção de "Adicionar ao PATH", caso seja perguntado (Windows)
3. Faça o download desse repositório
4. Adicione o PDF das notas de corretagem na pasta `adicione_notas_aqui`. Adicione quantas notas quiser.
5. Abra um terminal na mesma pasta do arquivo `package.json`. No Windows, basta segurar Shift e clicar com o botão direito na pasta. Selecione a opção "Abrir janela do PowerShell aqui"
6. Na janela do terminal, rode o comando `npm ci` e aguarde. Caso algum erro ocorra, rode o comando `npm i`. **Só é necessário fazer essa passo uma vez!** Esse comando instala as dependências. Não precisa rodar sempre que usar o programa
7. Novamente na janela do termianl, rode o comando `npm run parse` e aguarde. O arquivo `Resultado.csv` será gerado na pasta atual. Ele pode ser importado pelo Excel
8. É possível abrir o `Resultado.csv` diretamento no Excel, mas é recomendado importar de uma outra maneira para obter-se uma melhor visualização. Abra um novo arquivo do Excel, seleciona a aba `Dados` e clique em `De Text/CSV` (ou digite `csv` na busca do Excel). Então, basta selecionar o arquivo `Resultado.csv`

## Possíveis problemas
### Não foi possível abrir a nota...
* Verifique se as notas de corretagem estão na pasta `adicione_notas_aqui`.
* Se as notas de corretagem possuírem senha, adicione as senhas em `config.env` no formato `PDF_PASSWORD=123`. Você pode adicionar quantas senhas quiser, cada uma em uma nova linha

### Algumas ações não foram identificadas
Para as ações que não conseguiram ser automaticamente identificadas, ocorrerá um erro semelhante ao abaixo
> Can't find COSAN LOG ON NM

Para resolver esse problema, abra o arquivo `assets.env` e, em uma nova linha, adicione manualmente o código da ação e o nome dela (conforme nota) seguido do seu tipo
Ex.:
> CSAN3=COSAN LOG ON

## Considerações
* Os valores totais já incluem os custos totais das notas distribuídos ponderadamente
* Os valores podem desviar na casa dos centavos. Por favor, sempre verifique se o resultado está de acordo com o esperado.
* Pode funcionar para outras outras corretoras, mas não foi testado.
* Caso alguma ação não seja ON, PN nem UNIT, terá que ser inserida manualmente em `assets.env`
* Caso encontre problemas na conversão, pode-se tentar atualizar a lista de ações rodando no terminal o comando `npm run update-assets`
* Se encontrar algum outro problema, considere reportar na aba `Issues`
* Os FIIs não possuem CNPJ na tabela gerada

## Obrigado? De nada
Se te ajudei, manda um "Valeu!" 👋 pelo pix 😊
> a09e5878-2355-45f7-9f36-6df4ccf383cf

## Licença

Conforme licença, esse software não fornece nenhum tipo de garantia e seu autor se exime de responsabilidades de uso. Use sob sua responsabilidade e risco.

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

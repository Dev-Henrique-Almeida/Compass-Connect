<div>
    <h1>Challenge 2 - Compass Video</h1>
    <img src="@/public/desktop-logo.png"/>
</div>

<h1>Descrição do desafio:</h1>
<h4>A ideia do desafio é a criação de uma rede social, onde a mesma possui diversas funcionalidades.</h4>

<h1>Requisitos OBRIGATÓRIOS:</h1>

<details>
  <summary>1 - Cadastrar novos usuários</summary>
</br>
  Nesta primeira etapa, se deve criar um formulário de cadastro para novos usuários. Os dados precisam seguir as regras de validação descritas abaixo e todos os campos são obrigatórios:

- Nome: nome completo, sem validações (max: 255 caracteres).
- Usuário: deve ser único dentre todos os usuários (api retornará erro quando já existir, max: 255 caracteres).
- Data de Nascimento: deve ser escrita no formato dd/mm/aaaa (enviada para api no formato aaaa-mm-dd).
- Email: deve ser único e não deve aceitar endereços sem @ e/ou domínio. (api retornará erro quando já existir, max: 255 caracteres).
- Senha: deve exigir no mínimo 6 caracteres e no máximo 50.
- Confirmar senha: deve ter valor igual ao digitado em Senha.

</details>

<details>
  <summary>2 - Login de Usuários cadastrados (Tela inicial não estando autenticado) 
</summary>
</br>
    Nesta etapa, se deve criar um formulário de login para usuários já cadastrados. Os dados precisam seguir as regras de validação descritas abaixo e todos os campos são obrigatórios: 
  
  - Usuário: deve ser único dentre todos os usuários (max: 255 caracteres);
  - Senha: deve exigir no mínimo 6 caracteres e no máximo 50;
</br>

- Ao realizar o login, a api retornará informações do usuário suficientes para acessar a aplicação.
- Ao informar credenciais inválidas, deve ser mostrada a mensagem “Usuário e/ou Senha inválidos. Por favor, tente novamente!”.
</details>

<details>
  <summary>3 - Página de Feed (Tela inicial ao estar autenticado)  
</summary>
  </br>
  
  Em todas as telas (exceto login e cadastro) à esquerda, temos um menu lateral com as seguintes rotas disponíveis: 
- Página Inicial (Feed) 
- Meu Perfil
- Marketplace
- Sair (faz o logout do usuário e o redireciona para a tela de login) 
</details>

<details>
  <summary>4 - Página Meu Perfil  
</summary>
  </br>
  
  Ao centro, deve conter as informações a respeito do perfil acessado, como:
  </br>

- Foto de capa, estática (pode ser sempre a mesma foto, ou utilizar alguma lógica para randomizar imagens).
- Foto de perfil, estática (pode ser sempre a mesma foto, ou utilizar alguma lógica para randomizar imagens).
- Nome e profissão do usuário (vindas da api).
- O botão editar perfil só deve aparecer caso o perfil pertença ao usuário logado na aplicação.
- O campo sobre deve conter algumas outras informações que não foram preenchidas no cadastro da conta, que podem ser editadas ao clicar no botão editar perfil.
- Há três botões, Followers, Following, Posts (já selecionado), nenhum possui ação ao ser clicado.
- Uma listagem de posts criados pelo usuário do perfil com seus respectivos comentários.
- Posts que foram feitos pelo usuário logado, podem ser editados e excluídos.
- Comentários feitos pelo usuário logado podem ser editados e excluídos.

  </br>
  Ao clicar em editar o perfil, deve-se abrir uma modal com os seguintes campos para atualização do perfil do usuário:
  </br>

- Nome

- Cargo/Ocupação
- Sexo
- Data de Nascimento (mostrado como dd/mm/aaaa, enviado para api como aaaa-mm-dd)
- Endereço
- Telefone (enviar para a api somente os caracteres numéricos)

 </br>

Todos os campos são opcionais e possuem um máximo de 255 caracteres:
</br>

- Ao clicar em cancelar, fechar a modal.
- Ao clicar em salvar, enviar as informações para o endpoint de atualizar usuário.

</details>

<h1>Requisitos OPCIONAIS:</h1>

<details>
  <summary>1 - Página Detalhes do Item (Opcional, conta como bônus) 
</summary>
  </br>
  
  Deve trazer as mesmas informações da listagem, porém, com as informações do vendedor e, caso tenha sido vendido, também as informações do comprador. 
Caso o item tenha sido cadastrado pelo usuário logado, existirá o botão de menu do item, que mostrará as opções de Editar e Deletar. 
Caso o item ainda não tenha sido vendido, terá um botão Comprar Item, onde o item será marcado como vendido e as informações do usuário gravadas como comprador.

</details>

<details>

<summary><h3>Atenção:</h3></summary>
 
 - Utilize css “padrão” ou alguma biblioteca de estilização de sua preferência. 
- Pode ser utilizado Next.js caso queira.
- Utilize o gerenciamento de estados globais de sua preferência (context, redux, zustand, etc). 
- Testes unitários/e2e (tentem atingir pelo menos 30% de coverage) são opcionais, mas contam como bônus. 
- O usuário ao estar logado, não pode conseguir acessar a página de login e cadastro, devem ser rotas protegidas que redirecionam para o feed de posts. 
- O usuário ao estar deslogado, não pode acessar as demais páginas além do login e cadastro, devem ser rotas protegidas que redirecionam para a página de login. 
- Responsividade é opcional, mas conta como bônus (Aplicar Mobile-First pode ajudar nesta questão). 
- Padrões de commits é opcional, mas conta como bônus. 
- Readme.md é opcional, mas conta como bônus (é sempre bom uma breve apresentação do projeto ao abrir o repositório). 
- Nenhuma cópia é permitida, os projetos que identificarmos como plágio, serão zerados. (É permitido solicitar ajuda para colegas, mas sem copiar e colar o código 😉)

<details>

<summary><h3>Obrigatório:</h3></summary>
 </br>

Você precisa publicar seu código no github, em um repositório privado e incluir tanto o SM como todos os instrutores como colaboradores, as contas que devem utilizar seguem abaixo:

- [Isabela](https://github.com/isadfrn)
- [Carlos](https://github.com/ycarlosedu)
- [Gustavo](https://github.com/gustavoeyros)
- [Thiago](https://github.com/thiago-compasso)

</details>

<details>

<summary><h3>Links úteis:</h3></summary>
 </br>

Você precisa publicar seu código no github, em um repositório privado e incluir tanto o SM como todos os instrutores como colaboradores, as contas que devem utilizar seguem abaixo:

- [Figma](<https://www.figma.com/file/9nK8ak0y39Pn3SIkZ0uCni/Compass-Login-(Challenge-III)?type=design&node-id=0%3A1&mode=design&t=tMffu78JBk0sbcI8-1>)
- [Figma Protótipo Navegável(Desktop)](<https://www.figma.com/proto/9nK8ak0y39Pn3SIkZ0uCni/Compass-Login-(Challenge-III)?type=design&node-id=0-3&t=tKVyC1sBTohXRzrL-0&scaling=scale-down&page-id=0%3A1&starting-point-node-id=6%3A121>)
- [Figma Protótipo Navegável(Mobile)](<https://www.figma.com/proto/9nK8ak0y39Pn3SIkZ0uCni/Compass-Login-(Challenge-III)?type=design&node-id=1470-2202&t=T5YR7Yvf5xPwRa3S-0&scaling=scale-down&page-id=1451%3A1005&starting-point-node-id=1470%3A2202>)
- [API(Postman)](https://www.postman.com/silvacarlosoliveira/workspace/socialcompass/collection/28862195-64fbaff4-e94a-4abb-8a8d-af15ee6e6f17?action=share&creator=28862195&active-environment=28862195-551dbb4f-6228-4a9b-8504-109a4db23ef5)

</details>

</details>

## Iniciando o projeto

1. Em primeiro lugar, se deve colocar o seguinte no terminal:

```bash
npm install
```

2. Em seguida:

```bash
npm run dev
```

Após isso, o projeto deve rodar e ser aberto no link: [Projeto](http://localhost:3000), onde será aberto um navegador para a visualização do projeto.

# sisgea-module-autenticacao

Microservice de autenticação.

## Desenvolvimento

```
git clone https://github.com/sisgha/module-autenticacao.git
cd module-autenticacao
```

### Serviços do [devops/development/docker-compose.yml](./devops/development/docker-compose.yml)

| Host                            | Endereço             | Descrição                               | Plataforma Base                   |
| ------------------------------- | -------------------- | --------------------------------------- | --------------------------------- |
| `sisgea-module-autenticacao`    | `127.128.47.10:3471` | Aplicação NodeJS do module-autenticacao | `docker.io/library/node:18`       |
| `sisgea-module-autenticacao-db` | `127.128.47.11:5432` | Banco de dados postgres                 | `docker.io/bitnami/postgresql:15` |

### Scripts Make

O projeto conta com um [arquivo make](./Makefile) que comporta scrips destinados ao desenvolvimento da aplicação.

```Makefile
dev-setup:
  # Configura o ambiente de deselvolvimento, como a criação da rede sisgea-net e os arquivos .env
dev-up:
  # Inicia os containers docker
dev-shell:
  # Inicia os containers docker e abre o bash na aplicação node
dev-down:
  # Para todos os containers
dev-logs:
  # Mostra os registros dos containers
```

### Aplicação nest/nodejs

```bash
$ npm install
```

#### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

#### Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

#### Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

#### License

Nest is [MIT licensed](LICENSE).

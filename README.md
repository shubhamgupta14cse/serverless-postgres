# Abiliyo Serverless Backend

### Requirements 📑

- Node.js 12.x
- Serverless Framework
- Yarn Workspaces
- AWS Profile
- PostgreSQL
- pgAdmin
- Sequelize CLI

### Directory Structure 📝

```
|-db ----- Migration, Seeders and SQL for DB initilization
|-services
|     |- authentication ----- authentication service
|     |- upload ----- Upload service
|- gateway-errors.yml ----- Common resource file
|- package.json ----- Project dependencies
|- README.md ----- Readme
|- yarn.lock ----- Workspace generated file
```


### Setup 🔧


#### Node.js install

  - https://nodejs.org/en/download/

#### Clone repository
```
  git clone https://github.com/Meraaki-Learning/abiliyo-serverless.git
```

#### Yarn install
```
  yarn install
```

#### Set AWS profile
```
  serverless config credentials --provider aws --key AKIA**************** --secret wJalrXUtnF************************
```

#### Serverless framework install

  - https://www.npmjs.com/package/serverless
```
  npm install -g serverless
```

#### Serverless-offline install

  - https://www.npmjs.com/package/serverless-offline
```
  npm install -g serverless-offline
```

#### Sequelize-cli install

  - https://www.npmjs.com/package/sequelize-cli
```
  npm i sequelize-cli
```

#### go to .env file and paste this
```
  DB_NAME=abiliyo
  DB_USER=postgres
  DB_PASSWORD=postgres
  DB_HOST=127.0.0.1
  DB_PORT=5432
  NODE_ENV=dev
  SECURITY_GROUP_ID=sg-xx
  SUBNET1_ID=subnet-xx
  SUBNET2_ID=subnet-xx
  SUBNET3_ID=subnet-xx
  SUBNET4_ID=subnet-xx
```


### Generate Docs 🔧

> Run from root folder

```bash
yarn run docs
```

### Offline Database Setup

#### Require local installation of PostgreSQL
  - https://www.postgresql.org/download/

#### Require local installation of pgAdmin
  - https://www.pgadmin.org/download/
  - Start a server on Port no. 5432
  - Create a Database name called Abiliyo
  - Create a schema name called Abiliyo

```
cd <service>
serverless offline
```

### Deploy to AWS 🚀

The services have some dependencies and need to be deployed in the following order:

1. abiliyo-authentication-service
2. abiliyo-upload-service
3. abiliyo-student-service
4. abiliyo-instructor-servicee

```bash
cd <service>
serverless deploy

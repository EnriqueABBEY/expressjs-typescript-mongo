## Requirements
- node 18
- an active connection to a mongo db cluster

## Install
```ssh
cd app_folder
yarn install or npm install (depending on your package manager)
cp .env.production  .env
```
## Configuration (.env)
- MONGO_URI //the URI of your mongo db collecion
- PICTURE_BASE_URL // Sample link to generate avatar using lastname and firstname
- JWT_SECRET //Jwt secret key to used to genrate all your token
- JWT_TTL //Jwt token validity
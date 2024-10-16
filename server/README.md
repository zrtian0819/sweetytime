# express-base-es6-esm

## 版本

v1.2

## !!使用前注意

- git clone後，將`.env.template`改為`.env`檔案，之後進行其中相關設定
- `.env`中`DB_XXX`相關設定，需改為你的資料庫、帳號、密碼才能開始使用


## 指令

express執行:

> 模型對應資料表不存在會自動建立

```sh
npm run dev
```

模型對應資料表建立+種子(範例)資料載入:

```sh
npm run seed
```

資料庫備份(mysqldump):

```sh
npm run backup
```

express執行&除錯(macOS, linux):

```sh
npm run debug
```

express執行&除錯(win):

```sh
npm run debug-win
```

## 設計準則 Design Rules

- [SQL Style Guide](https://www.sqlstyle.guide/zh-tw/)
- [Modern SQL Style Guide](https://gist.github.com/mattmc3/38a85e6a4ca1093816c08d4815fbebfb)

### 資料庫 DB

### 資料表名稱 Table Names

- 全英文小寫(以下底線`_`分隔字詞) Lower Case Table Name
- 英文單數詞 Table name in Singular
- 前綴字名稱 Prefixed Table name

### 欄位名稱 Field Names

- 全英文小寫，無空白與數字
- 選擇短名稱，不超過兩個單詞
- 主鍵(Primary key)使用`id`或`資料表名稱_id`
- 避免使用保留字詞，加上前綴字例如user_name或signup_date
- 避免使用相同於資料表名稱
- 避免使用縮寫或簡稱
- 外鍵(Foreign key)欄位需要有資料表名稱加上它們的主鍵，例如blog_id代表從資料表blog來的外鍵

### API路由 REST API

#### 標準

- [JSend](https://github.com/omniti-labs/jsend)
- [Microsoft Azure REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md)
- [Google JSON guide](https://google.github.io/styleguide/jsoncstyleguide.xml)

#### 範例

成功:

```json
{
    "status" : "success",
    "data" : {
        "post" : { "id" : 1, "title" : "A blog", "body" : "Some content" }
     }
}
```

或 不需要回應資料時(DELETE...)

```json
{
    "status" : "success",
    "data" : null
}
```

失敗:

```json
{
    "status" : "fail",
    "data" : { "title" : "A title is required" }
}
```

錯誤:

```json
{
    "status" : "error",
    "message" : "Unable to communicate with database"
}
```

#### 狀態碼(status code)

```text
GET: 200 OK
POST: 201 Created
PUT: 200 OK
PATCH: 200 OK
DELETE: 204 No Content
```

```text
200 OK - the request was successful and the response contains the requested data
201 Created - the request was successful and a new resource was created
400 Bad Request - the request was invalid or missing required parameters
401 Unauthorized - the client needs to authenticate to access the resource
404 Not Found - the requested resource was not found
500 Internal Server Error - an unexpected error occurred on the server
```

POST

```text
Once you are creating a resource on the server, you should return the 201 status code along with a Location header, allowing the client to locate the newly created resource.

The response payload is optional and it typically describes and links to the resource created.
```

#### pagnation

```text
GET /posts?limit=10&offset=0 - retrieves the first 10 posts
GET /posts?limit=10&offset=10 - retrieves the second 10 posts
GET /posts?limit=10&offset=20 - retrieves the third 10 posts, and so on
```

### JWT

- add only unchangeable fields like username, role to JWT

## OTHERS

For postgresql test

> db.js

```js
// for postgresql test
const sequelize = new Sequelize(
  process.env.PG_DB_DATABASE,
  process.env.PG_DB_USERNAME,
  process.env.PG_DB_PASSWORD,
  {
    host: process.env.PG_DB_HOST,
    port: process.env.PG_DB_PORT,
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  }
)
```

> .env

```text
# TEST FOR pgsql
PG_DB_HOST=127.0.0.1
PG_DB_PORT=5432
PG_DB_DATABASE=test
PG_DB_USERNAME=test
PG_DB_PASSWORD=12345
```
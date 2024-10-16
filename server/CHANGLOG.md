# Change log

## TODO

- [ ] add prefix for sample db models and seeds
- [ ] ecpay
- [ ] ?add associations sync feature
- [ ] change smtp error to warning
- [ ] downsize Product sample data
- [ ] line pay feature refactor
- [ ] clear up `data` and other nouse files
- [ ] add base db sample crud route X 2(one for sample origin node+mysql2, one for sequalize)

## FIXME

## ChangeLog

> `u`: change/update `f`:fixed `a`: add `rm`: remove `!`: notice

### 240918

- (u) sequelize seeds-setup add try...catch for more error messages
- (u) update ecpay MerchantTradeNo to original sample code

### 240513

- (a) add raw mysql pool export file
- (u) sequelize timezone to +8:00
- (rm) remove pg npm for test
- (rm) deprecated `models/base.js`
- (f) routes/users register(create) should use FindOrCreate function with OR condition. [refs](https://stackoverflow.com/questions/22147151/sequelize-findorcreate-function-with-or-condition)

### 240327

- (f) fixed gmail smtp bugs ([issue](https://github.com/nodemailer/nodemailer/issues/1429))

### 231105

- (test) ? 10k products data maybe squelize seed function max limit
- (u) products route add brand_ids query string for brand query(as cat_ids)
- (u) products route refactor
- (a) user model add avatar and upload-avatar route
- (u) jwt access token change include user id, google_uid, line_uid, username. and expiresIn change to '3d'

### 231104

- (a) user register/update(profile) feature
- (u) refactor test all reset-password(otp) feature
- (a) db password hashing with bcrypt
- (a) node import alias for root(##)

### 231028

- (u) sequelize raw query for model/base.js
- (u) dynamic import routes
- (a) pg, pg-hstore, mariadb npm mods for test
- remove express-fileupload and only use multer

### 231024

- (d) models/users change router/user db funcs
- (d) docs
- (d) auth, facebook-login

### 231023-

- OTP workflow
- +nodemailer + Google SMTP
- +[faker](https://github.com/faker-js/faker)
- fixed create table issue(executeQuery only one query each time) drop if exist then create
- es6 import wo babel 
- auth route (session-cookie should use?... no, use jwt)

### 230604

- get: all, byId is ok
- post: insertOne is ok

### 230606

- json2db(create db and insert data) ok
- db backup tool ok
- create, drop, TRUNCATE db.... should need another TEST db?
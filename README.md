## <b>项目背景介绍</b>

本仓库最主要是为了尝试使用 deno+mysql+graphql 技术栈来熟悉这些技术

## <b>如何是用该项目</b>

`deno run --allow-net deno-graphql.ts`： 在 8080 端口打开站点可以根据需要的不同字段返回相应的数据，这个是会连接后端 mysql 数据库的 http://localhost:8080/graphql
`deno run --allow-net deno-graphql.ts`：在 7777 端口打开站点,页面是根据 react 和 graphql 实现的，可以根据需要的不同字段返回相应的数据，这个是会连接后端 mysql 数据库的 http://localhost:8080/graphql

## <b>mysql 数据库的原始数据</b>

```
select * from websites;
```

+-----+----------------+------------------------------+-------+---------+
| id | name | url | alexa | country |
+-----+----------------+------------------------------+-------+---------+
| 3 | 菜鸟教程 | http://www.runoob.com/ | 4689 | CN |
| 4 | 微博 | http://weibo.com/ | 20 | CN |
| 5 | Facebook | https://www.facebook.com/ | 3 | USA |
| 30 | 菜鸟教程 | http://www.runoob.com/ | 4689 | CN |
| 40 | 微博 1 | http://weibo.com1/ | 201 | CN1 |
| 41 | 微博 1 | http://weibo.com1/ | 201 | CN1 |
| 50 | Facebook | https://www.facebook.com/ | 3 | USA |
| 232 | Facebooktestss | https://www.facebook.cwwwom/ | 3426 | USAFSDF |
+-----+----------------+------------------------------+-------+---------+

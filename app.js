//載入ＥＸＰＲＥＳＳ
const express = require('express')
//將app定義為載入後的Express
const app = express()
//設定預設阜值 ＝３０００
const port = 3000
//載入express-handlebars
const exphbs = require('express-handlebars')
//載入以整理好的資料
const restaurantList = require('./restaurant.json')
//定義模板引擎名稱為'handlebars',並設定預設的模板為'main'
app.engine('handlebars', exphbs({ defaultLayout: "main" }))
//設定Express 要使用的模板引擎更改為名為 ‘handlebars’的模板引擎
app.set('view engine', 'handlebars')
//不管從哪個路由走，都必須先經過靜態檔案名為'public‘的資料
app.use(express.static('public'))
//設定路由，收到根目錄的路徑要求後，從restaurantList.results取得值，
//再到index.handlebars傳給屬性名為restaurant的物件，經過express-handlebars的樣板引擎，
//最後回應ＨＴＭＬ的格式給瀏覽器
app.get('/', (req, res) => {
  res.render('index', { restaurant: restaurantList.results })
})
//設定動態路由，收到'/restaurants/:id'的路徑，用：定義名為id為變數，存儲在req.params的物件裡
//利用filter一一核對id，回傳出符合條件後組成新的陣列。
//傳給名為show.handlebars中屬性名為restarantItem的物件，並從item[0]中取得值。
app.get('/restaurants/:id', (req, res) => {
  let item = restaurantList.results.filter(item => {
    return item.id === Number(req.params.id)
  })
  res.render('show', { restaurantItem: item[0] })
})
//搜尋功能，當搜尋時網址後會顯示？keyword=value，value可以在req.query.keyword中找到
app.get('/search', (req, res) => {
  let searchList = restaurantList.results.filter(item => {
    if (item.name.toLowerCase().includes(req.query.keyword.toLowerCase()) || item.category.toLowerCase().includes(req.query.keyword.toLowerCase())) {
      return item
    }
  })
  res.render('index', { restaurant: searchList, keywords: req.query.keyword })
})
//啟動伺服器
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
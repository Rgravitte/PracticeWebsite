const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



let Article = require('./models/article')

mongoose.connect('mongodb://localhost/test');
let db = mongoose.connection;

//checking for connection
db.once('open', function(){
  console.log('connected to the db');
})

//checking for db errors
db.on('error', function(err){
  console.log(err);
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//middleware for bodyparser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname, 'public')));
//home route
app.get('/', (req, res, next)=>{
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    }else{
      // console.log(articles);
    res.render('index', {
      
      staticTitle: 'Articles',
      articles: articles,
      title: articles.title,
      body: articles.body,
      author: articles.author
    });
  }
  })
  
});

app.get('/article/:id', (req, res, next)=>{
  Article.findById(req.params.id, function(err, article){

    res.render('article', ({
      article: article,
      title: article.title,
      author: article.author,
      body: article.body
    }));
    console.log(article, '^#^#^#^#^#^#^#^#^#^#^#^#^#^#^#^#^#^#^#^#^#^#^');
  })
})

app.get('/article/add', (req, res, next)=>{
  
  res.render('add_article', function(err) {
    if(err){
      console.log(err);
    }else{
      res.redirect('/')

    }
  })
  });



//add submit POST route
app.post('/article/add', (req, res, next)=>{
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    }else{
      res.redirect('/');
    }
  })
})

app.get('/article/edit/:id', (req, res, next)=>{
  Article.findById(req.params.id, function(err, article){
    console.log(article.author);
    res.render('edit_article', {
      title: 'Edit Article',
      author: req.params.author,
      body: req.body.body
    });
  })
})

console.log("-`-`-`-`-`-`--`-`-`-`-`-`-`-`-`-`-`-`");
//server
app.listen(3000, ()=>{
  console.log('the server is working');
})
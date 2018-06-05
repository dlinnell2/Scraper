var express = require('express');
var hbrs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var db = require('./models');
var request = require('request');

var app = express();
var PORT = process.env.PORT || 3000;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./public'));

app.engine("handlebars", hbrs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get('/', function (req, res) {
    db.Article.find({}, null, {sort:{createdAt:-1}}).then(function (results) {
        res.render('index', {articles:results});
    });
});

app.get('/saved', function(req, res){
    db.Article.find({saved:true}, null, {sort:{updatedAt:-1}}).then(function(results){
        res.render('saved', {articles:results});
    });
});

app.get('/save/:status/:id', function(req, res){

    db.Article.findOneAndUpdate(
        {_id:req.params.id},
        {saved:req.params.status},
        {new:true}
    ).then(function(results){

        res.json(results);

    });

});

app.get('/comments/:id', function(req, res){

    db.Article.findOne({_id:req.params.id}).then(function(article){
        
        var results = {
            title: article.title,
            id: article._id,
        }

        console.log(article);

        if(article.comments){
            article.comments.forEach(function(element){
                db.Comment.find({_id:element}).then(function(comment){
                    results.comments.push(comment.body);
                })
            })
        }

        res.json(results)
    });
});

app.post('/comments/:articleId', function(req, res){

    db.Comment.create(req.body).then(function(newComment){
        console.log(newComment);

        console.log(req.params.articleId);

        return db.Article.findOneAndUpdate({_id:req.params.articleId}, { $push: { comments: newComment._id } }, { new: true });
    }).then(function(updatedArticle){
        console.log(updatedArticle);
    })
})

app.get('/scrape', function (req, res) {

    request("https://bbc.com", function (error, response, html) {
        var $ = cheerio.load(html);

        $('div.media__content').each(function (i, element) {
            var newEntry = {}

            var title = $(element).children('h3').children('a').text();
            var link = $(element).children('h3').children('a').attr('href');
            var summary = $(element).children('p.media__summary').text();

            if (!link.startsWith('http://' || 'https://')){
                newEntry = {
                    title: title,
                    summary: summary,
                    link: `https://bbc.com${link}`
                };
                db.Article.create(newEntry).then(function (dbEntry) {
                    console.log(dbEntry);
    
                })

            };
        });


        res.redirect('/');

    })
})

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
});
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose= require('mongoose');

var app = require('../server');
var Book = require('../server/models/books')

var should = chai.should();
chai.use(chaiHttp);

describe('Search', function() {

  it('should load a page', function(done) {
    chai.request(app)
      .get('/search')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });
});

describe('Search API', function() {
  it('should return a set of JSON results', function(done) {
    chai.request(app)
      .get('/api/search/harry%20potter')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      })
  })
})

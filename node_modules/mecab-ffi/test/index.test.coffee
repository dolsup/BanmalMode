should = require 'should'
async = require 'async'

mecab = require '../lib/index'


describe 'mecab', ->
  inputString = '안녕하세요.테스트데이터입니다.'

  describe '.parse(...)', ->
    it 'should be done', (done) ->
      mecab.parse inputString, (err, result) ->
        should.not.exist err
        should.exist result
        done()


  describe '.parseSync(...)', ->
    it 'should be done', (done) ->
      result = mecab.parseSync inputString
      should.exist result
      done()


  describe 'muptiple parse(...)', ->
    it 'should be done', (done) ->
      async.forEach [1..100]
      ,
        (i, callback) ->
          mecab.parse "#{i}", callback
      ,
        (err) ->
          should.not.exist err
          done()


  describe '.extractKeywords(...)', ->
    it 'should be done', (done) ->
      inputString = "‘다이어트와 심리치료’, ‘평생 살찌지 않는 체질 만들기’, ‘요요 없는 다이어트 불변의 법칙’ 등 다양한 주제로 활발한 강연과 연구활동을 펼치고 있다. 채소와 과일로 만든 해독주스 다이어트 가이드북. 혁신적인 다이어트 프로그램을 연구, 개발하여 이미 15만 명의 환자들이 이 프로그램을 체험하고 체중 감량에 많은 효과를 보았다. 수화토 체질 구분법을 통해 내 몸의 체질을 파악하고, 그에 맞는 해독주스를 알 수 있다. ..."

      mecab.extractKeywords inputString, (err, result) ->
        should.not.exist err
        should.exist result
        done()


  describe 'getDiceCoefficientByString(...)', ->
    it 'should be done', (done) ->
      strA = '한국이 국제축구연맹(FIFA) 터키 20세 이하 월드컵 16강에 진출했다.'
      strB = '국제축구연맹(FIFA) 20세 이하 월드컵에 나선 어린 태극전사들이 16강 직행티켓을 놓쳤다.'
      
      mecab.getDiceCoefficientByString strA, strB, (err, result) ->
        should.not.exist err
        should.exist result
        done()

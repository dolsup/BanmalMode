async = require 'async'

ref = require 'ref'
ffi = require 'ffi'


# types
ModelType = ref.types.void
ModelTypePtr = ref.refType ModelType

TaggerType = ref.types.void
TaggerTypePtr = ref.refType TaggerType

LatticeType = ref.types.void
LatticeTypePtr = ref.refType LatticeType


# libmecab
libMecab = ffi.Library 'libmecab',
  'mecab_model_new2': [ ModelTypePtr, [ 'string' ] ]
  'mecab_model_destroy': [ 'void', [ ModelTypePtr ] ]
  'mecab_model_new_tagger': [ TaggerTypePtr, [ ModelTypePtr ] ]
  'mecab_model_new_lattice': [ LatticeTypePtr, [ ModelTypePtr ] ]
  'mecab_lattice_set_sentence': [ 'void', [ LatticeTypePtr, 'string' ] ]
  'mecab_parse_lattice': [ 'void', [ TaggerTypePtr, LatticeTypePtr ] ]
  'mecab_lattice_tostr': [ 'string', [ LatticeTypePtr ] ]
  'mecab_lattice_clear': [ 'void', [ LatticeTypePtr ] ]
  'mecab_lattice_destroy': [ 'void', [ LatticeTypePtr ] ]
  'mecab_strerror': [ 'string', [ TaggerTypePtr ] ]


# init
modelPtr = libMecab.mecab_model_new2 ''
if modelPtr.isNull()
  errorString = libMecab.mecab_strerror null
  return throw new Error "Failed to create a new model - #{errorString}"

taggerPtr = libMecab.mecab_model_new_tagger modelPtr
if taggerPtr.isNull()
  libMecab.mecab_model_destroy modelPtr
  errorString = libMecab.mecab_strerror taggerPtr
  return throw new Error "Failed to create a new tagger - #{errorString}"



class MeCab


parseMeCabOutputString = (outputString) ->
  result = []
  outputString.split('\n').forEach (line) ->
    result.push line.replace('\t', ',').split(',')
  
  result[0...-2]



MeCab.parse = (inputString, callback) ->
  async.waterfall [
    (callback) ->
      libMecab.mecab_model_new_lattice.async modelPtr, (err, latticePtr) ->
        if latticePtr.isNull()
          errorString = libMecab.mecab_strerror taggerPtr
          return callback new Error "Failed to create a new lattice - #{errorString}"
        callback err, latticePtr
  ,
    (latticePtr, callback) ->
      libMecab.mecab_lattice_set_sentence.async latticePtr, inputString, (err) -> 
        callback err, latticePtr
  ,
    (latticePtr, callback) ->
      libMecab.mecab_parse_lattice.async taggerPtr, latticePtr, (err) ->
        callback err, latticePtr
  ,
    (latticePtr, callback) ->
      libMecab.mecab_lattice_tostr.async latticePtr, (err, outputString) ->
        callback err, latticePtr, outputString
  ,
    (latticePtr, outputString, callback) ->
      libMecab.mecab_lattice_destroy.async latticePtr, (err) ->
        callback err, outputString

  ], (err, outputString) ->
    return callback err  if err?
    
    callback null, parseMeCabOutputString outputString



MeCab.parseSync = (inputString) ->
  latticePtr = libMecab.mecab_model_new_lattice modelPtr
  if latticePtr.isNull()
    errorString = libMecab.mecab_strerror taggerPtr
    return callback new Error "Failed to create a new lattice - #{errorString}"

  libMecab.mecab_lattice_set_sentence latticePtr, inputString
  libMecab.mecab_parse_lattice taggerPtr, latticePtr
  outputString = libMecab.mecab_lattice_tostr latticePtr
  libMecab.mecab_lattice_destroy latticePtr

  parseMeCabOutputString outputString



MeCab.extractNouns = (inputString, callback) ->
  MeCab.parse inputString, (err, morphemes) ->
    return callback err  if err?

    nouns = []
    for morpheme, index in morphemes
      if morpheme[1] is 'NN'
        
        if index > 0
          prevMorpheme = morphemes[index - 1]
          if prevMorpheme[1] is 'SN' or prevMorpheme[1] is 'NN' or prevMorpheme[1] is 'VA+ETM'
            nouns.push "#{prevMorpheme[0]} #{morpheme[0]}"

          if index > 1
            prevPrevMorpheme = morphemes[index - 2]
            if prevPrevMorpheme[1] is 'VA' and prevMorpheme[1] is 'ETM'
              nouns.push "#{prevPrevMorpheme[0]}#{prevMorpheme[0]} #{morpheme[0]}"
        
        nouns.push morpheme[0]  if morpheme[1] is 'NN'

    callback null, nouns



MeCab.extractKeywords = (inputString, options, callback) ->
  if typeof options is 'function'
    callback = options
    options = {}
  
  options = {}  if not options?
  options.n = 3  if not options.n?

  MeCab.parse inputString, (err, morphemes) ->
    return callback err  if err?

    keywords = []
    nouns = []
    tempSN = ''

    for morpheme in morphemes
      if morpheme[1] is 'SN'
        tempSN = morpheme[0]

      else if morpheme[1] is 'NN' and morpheme[0].length > 1 and morpheme[4] is '*'
        nouns.push "#{tempSN}#{morpheme[0]}"
        tempSN = ''

      else
        if nouns.length > 1
          keywords.push nouns.join ' '
        nouns = []
        tempSN = ''

    uniqueKeywordMap = {}
    uniqueKeywordMap[keyword] = keyword for keyword in keywords
    uniqueKeywords = []
    for k, v of uniqueKeywordMap
      uniqueKeywords.push v
    uniqueKeywords = uniqueKeywords[0...options.n]
    uniqueKeywords.sort (a, b) -> b.length - a.length

    callback null, uniqueKeywords



MeCab.extractNounMap = (inputString, callback) ->
  MeCab.extractNouns inputString, (err, nouns) ->
    return callback err  if err?

    nounMap = {}
    for noun in nouns
      nounMap[noun] = 0  if not nounMap[noun]?
      nounMap[noun]++

    callback null, nounMap



MeCab.extractSortedNounCounts = (inputString, callback) ->
  MeCab.extractNounMap inputString, (err, nounMap) ->
    return callback err  if err?

    nounCounts = []
    for noun, count of nounMap
      nounCounts.push
        noun: noun
        count: count

    nounCounts.sort (a, b) ->
      b.count - a.count

    callback null, nounCounts



MeCab.getDiceCoefficientByNounMap = (nounMapA, nounMapB, callback) ->
  score = 0

  for noun, countA of nounMapA
    countB = 0
    countB = nounMapB[noun]  if nounMapB[noun]?
    score += countA * countB

  callback null, score



MeCab.getDiceCoefficientByString = (inputStringA, inputStringB, callback) ->
  async.parallel
    nounMapA: (callback) ->
      MeCab.extractNounMap inputStringA, callback
    nounMapB: (callback) ->
      MeCab.extractNounMap inputStringB, callback
  ,
    (err, result) ->
      MeCab.getDiceCoefficientByNounMap result.nounMapA, result.nounMapB, callback



module.exports = MeCab

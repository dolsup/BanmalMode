# node-mecab-ffi

A node.js module for binding MeCab asynchronously using foreign function interface.

This module supports MacOS(surely Unix/Linux) and multi-thread safety.


## Installation

node-mecab-ffi depends on [MeCab](http://mecab.googlecode.com/svn/trunk/mecab/doc/index.html) v0.994 or higher.

Warning: To use libmecab in MacOS, you should install the newest gcc first and compile MeCab with it. Refer to [here](http://www.ficksworkshop.com/blog/14-coding/65-installing-gcc-on-mac). Otherwise it could split errors which cannot find dictionary directory or showing abort trap when you try to parse input strings.

Via [npm](https://npmjs.org):

    $ npm install mecab-ffi
  

## Quick Start

### Load in the module

    var mecab = require('mecab-ffi');

### Parse a string

#### Asynchronously
```javascript
  mecab.parse('test input string', function(err, result) {
    ...
  });
```

#### Synchronously
```javascript
  result = mecab.parseSync('test input string');
```

### Extract nouns

#### Noun list
```javascript
  mecab.extractNouns('test input string', function(err, result) {
    // result = ['test', 'input', 'string']
    ...
  });
```

#### Noun Map
```javascript
  mecab.extractNounMap('test input string test', function(err, result) {
    // result = { "test":2, "input":1, "string":1 }
    ...
  })

```

#### Noun list sorted by count
```javascript
  mecab.extractSortedNounCounts('test input string test', function(err, result) {
    // result = [ {"noun":"test", "count":2}, {"noun":"input", "count":1}, {"noun":"string", "count":1} ]
    ...
  });
```

### Get Dice-Coefficient

#### by two strings
```javascript
  mecab.getDiceCoefficientByString('test string A', 'test string B', function(err, result) {
    // result = 2
    ...
  });
```

#### by two noun maps
```javascript
  mecab.getDiceCoefficientByNounMap(mapA, mapB, function(err, result) {
    ...
  });
```

## License

Released under the MIT License

Copyright (c) 2013 Taeho Kim <xissysnd@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/xissy/node-mecab-ffi/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


(function(){var a=function(c){var b=new a.Builder;return b.pipeline.add(a.trimmer,a.stopWordFilter,a.stemmer),b.searchPipeline.add(a.stemmer),c.call(b,b),b.build()};a.version="2.3.9",a.utils={},a.utils.warn=function(a){return function(b){a.console&&console.warn&&console.warn(b)}}(this),a.utils.asString=function(a){return a===void 0||a===null?"":a.toString()},a.utils.clone=function(b){var c,f,d,e,a;if(b===null||b===void 0)return b;c=Object.create(null),f=Object.keys(b);for(d=0;d<f.length;d++){if(e=f[d],a=b[e],Array.isArray(a)){c[e]=a.slice();continue}if(typeof a=='string'||typeof a=='number'||typeof a=='boolean'){c[e]=a;continue}throw new TypeError("clone is not deep and does not support nested objects")}return c},a.FieldRef=function(a,b,c){this.docRef=a,this.fieldName=b,this._stringValue=c},a.FieldRef.joiner="/",a.FieldRef.fromString=function(b){var c=b.indexOf(a.FieldRef.joiner),d,e;if(c===-1)throw"malformed field ref string";return d=b.slice(0,c),e=b.slice(c+1),new a.FieldRef(e,d,b)},a.FieldRef.prototype.toString=function(){return this._stringValue==void 0&&(this._stringValue=this.fieldName+a.FieldRef.joiner+this.docRef),this._stringValue},a.Set=function(a){if(this.elements=Object.create(null),a){this.length=a.length;for(var b=0;b<this.length;b++)this.elements[a[b]]=!0}else this.length=0},a.Set.complete={intersect:function(a){return a},union:function(){return this},contains:function(){return!0}},a.Set.empty={intersect:function(){return this},union:function(a){return a},contains:function(){return!1}},a.Set.prototype.contains=function(a){return!!this.elements[a]},a.Set.prototype.intersect=function(b){var c,d,e,g=[],f,h;if(b===a.Set.complete)return this;if(b===a.Set.empty)return b;this.length<b.length?(c=this,d=b):(c=b,d=this),e=Object.keys(c.elements);for(f=0;f<e.length;f++)h=e[f],h in d.elements&&g.push(h);return new a.Set(g)},a.Set.prototype.union=function(b){return b===a.Set.complete?a.Set.complete:b===a.Set.empty?this:new a.Set(Object.keys(this.elements).concat(Object.keys(b.elements)))},a.idf=function(b,d){var a=0,c,e;for(c in b){if(c=='_index')continue;a+=Object.keys(b[c]).length}return e=(d-a+.5)/(a+.5),Math.log(1+Math.abs(e))},a.Token=function(a,b){this.str=a||"",this.metadata=b||{}},a.Token.prototype.toString=function(){return this.str},a.Token.prototype.update=function(a){return this.str=a(this.str,this.metadata),this},a.Token.prototype.clone=function(b){return b=b||function(a){return a},new a.Token(b(this.str,this.metadata),this.metadata)},a.tokenizer=function(c,j){var e,i,g,b,d,k,h,f;if(c==null||c==void 0)return[];if(Array.isArray(c))return c.map(function(b){return new a.Token(a.utils.asString(b).toLowerCase(),a.utils.clone(j))});e=c.toString().toLowerCase(),i=e.length,g=[];for(b=0,d=0;b<=i;b++)k=e.charAt(b),h=b-d,(k.match(a.tokenizer.separator)||b==i)&&(h>0&&(f=a.utils.clone(j)||{},f.position=[d,h],f.index=g.length,g.push(new a.Token(e.slice(d,b),f))),d=b+1);return g},a.tokenizer.separator=/[\s\-]+/,a.Pipeline=function(){this._stack=[]},a.Pipeline.registeredFunctions=Object.create(null),a.Pipeline.registerFunction=function(b,c){c in this.registeredFunctions&&a.utils.warn('Overwriting existing registered function: '+c),b.label=c,a.Pipeline.registeredFunctions[b.label]=b},a.Pipeline.warnIfFunctionNotRegistered=function(b){var c=b.label&&b.label in this.registeredFunctions;c||a.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n',b)},a.Pipeline.load=function(c){var b=new a.Pipeline;return c.forEach(function(c){var d=a.Pipeline.registeredFunctions[c];if(d)b.add(d);else throw new Error('Cannot load unregistered function: '+c)}),b},a.Pipeline.prototype.add=function(){var b=Array.prototype.slice.call(arguments);b.forEach(function(b){a.Pipeline.warnIfFunctionNotRegistered(b),this._stack.push(b)},this)},a.Pipeline.prototype.after=function(d,c){a.Pipeline.warnIfFunctionNotRegistered(c);var b=this._stack.indexOf(d);if(b==-1)throw new Error('Cannot find existingFn');b=b+1,this._stack.splice(b,0,c)},a.Pipeline.prototype.before=function(d,b){a.Pipeline.warnIfFunctionNotRegistered(b);var c=this._stack.indexOf(d);if(c==-1)throw new Error('Cannot find existingFn');this._stack.splice(c,0,b)},a.Pipeline.prototype.remove=function(b){var a=this._stack.indexOf(b);if(a==-1)return;this._stack.splice(a,1)},a.Pipeline.prototype.run=function(b){for(var h=this._stack.length,e=0,g,f,c,a,d;e<h;e++){g=this._stack[e],f=[];for(c=0;c<b.length;c++){if(a=g(b[c],c,b),a===null||a===void 0||a==='')continue;if(Array.isArray(a))for(d=0;d<a.length;d++)f.push(a[d]);else f.push(a)}b=f}return b},a.Pipeline.prototype.runString=function(b,c){var d=new a.Token(b,c);return this.run([d]).map(function(a){return a.toString()})},a.Pipeline.prototype.reset=function(){this._stack=[]},a.Pipeline.prototype.toJSON=function(){return this._stack.map(function(b){return a.Pipeline.warnIfFunctionNotRegistered(b),b.label})},a.Vector=function(a){this._magnitude=0,this.elements=a||[]},a.Vector.prototype.positionForIndex=function(c){if(this.elements.length==0)return 0;for(var d=0,f=this.elements.length/2,e=f-d,a=Math.floor(e/2),b=this.elements[a*2];e>1;){if(b<c&&(d=a),b>c&&(f=a),b==c)break;e=f-d,a=d+Math.floor(e/2),b=this.elements[a*2]}if(b==c)return a*2;if(b>c)return a*2;if(b<c)return(a+1)*2},a.Vector.prototype.insert=function(a,b){this.upsert(a,b,function(){throw"duplicate index"})},a.Vector.prototype.upsert=function(b,c,d){this._magnitude=0;var a=this.positionForIndex(b);this.elements[a]==b?this.elements[a+1]=d(this.elements[a+1],c):this.elements.splice(a,0,b,c)},a.Vector.prototype.magnitude=function(){var b,d,a,c;if(this._magnitude)return this._magnitude;b=0,d=this.elements.length;for(a=1;a<d;a+=2)c=this.elements[a],b+=c*c;return this._magnitude=Math.sqrt(b)},a.Vector.prototype.dot=function(j){for(var g=0,e=this.elements,f=j.elements,h=e.length,i=f.length,c=0,d=0,a=0,b=0;a<h&&b<i;)c=e[a],d=f[b],c<d?a+=2:c>d?b+=2:c==d&&(g+=e[a+1]*f[b+1],a+=2,b+=2);return g},a.Vector.prototype.similarity=function(a){return this.dot(a)/this.magnitude()||0},a.Vector.prototype.toArray=function(){for(var b=new Array(this.elements.length/2),a=1,c=0;a<this.elements.length;a+=2,c++)b[c]=this.elements[a];return b},a.Vector.prototype.toJSON=function(){return this.elements},a.stemmer=function(){var g={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},s={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},l="[^aeiou]",d="[aeiouy]",a=l+"[^aeiouy]*",b=d+"[aeiou]*",k="^("+a+")?"+b+a,h="^("+a+")?"+b+a+"("+b+")?$",i="^("+a+")?"+b+a+b+a,j="^("+a+")?"+d,e=new RegExp(k),c=new RegExp(i),m=new RegExp(h),n=new RegExp(j),o=/^(.+?)(ss|i)es$/,p=/^(.+?)([^s])s$/,q=/^(.+?)eed$/,r=/^(.+?)(ed|ing)$/,f=/.$/,t=/(at|bl|iz)$/,u=new RegExp("([^aeiouylsz])\\1$"),v=new RegExp("^"+a+d+"[^aeiouwxy]$"),w=/^(.+?[^aeiou])y$/,x=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,y=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,z=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,A=/^(.+?)(s|t)(ion)$/,B=/^(.+?)e$/,C=/ll$/,D=new RegExp("^"+a+d+"[^aeiouwxy]$"),E=function(a){var d,l,j,b,h,k,E,i;return a.length<3?a:(j=a.substr(0,1),j=="y"&&(a=j.toUpperCase()+a.substr(1)),b=o,h=p,b.test(a)?a=a.replace(b,"$1$2"):h.test(a)&&(a=a.replace(h,"$1$2")),b=q,h=r,b.test(a)?(i=b.exec(a),b=e,b.test(i[1])&&(b=f,a=a.replace(b,""))):h.test(a)&&(i=h.exec(a),d=i[1],h=n,h.test(d)&&(a=d,h=t,k=u,E=v,h.test(a)?a=a+"e":k.test(a)?(b=f,a=a.replace(b,"")):E.test(a)&&(a=a+"e"))),b=w,b.test(a)&&(i=b.exec(a),d=i[1],a=d+"i"),b=x,b.test(a)&&(i=b.exec(a),d=i[1],l=i[2],b=e,b.test(d)&&(a=d+g[l])),b=y,b.test(a)&&(i=b.exec(a),d=i[1],l=i[2],b=e,b.test(d)&&(a=d+s[l])),b=z,h=A,b.test(a)?(i=b.exec(a),d=i[1],b=c,b.test(d)&&(a=d)):h.test(a)&&(i=h.exec(a),d=i[1]+i[2],h=c,h.test(d)&&(a=d)),b=B,b.test(a)&&(i=b.exec(a),d=i[1],b=c,h=m,k=D,(b.test(d)||h.test(d)&&!k.test(d))&&(a=d)),b=C,h=c,b.test(a)&&h.test(a)&&(b=f,a=a.replace(b,"")),j=="y"&&(a=j.toLowerCase()+a.substr(1)),a)};return function(a){return a.update(E)}}(),a.Pipeline.registerFunction(a.stemmer,'stemmer'),a.generateStopWordFilter=function(a){var b=a.reduce(function(a,b){return a[b]=b,a},{});return function(a){if(a&&b[a.toString()]!==a.toString())return a}},a.stopWordFilter=a.generateStopWordFilter(['a','able','about','across','after','all','almost','also','am','among','an','and','any','are','as','at','be','because','been','but','by','can','cannot','could','dear','did','do','does','either','else','ever','every','for','from','get','got','had','has','have','he','her','hers','him','his','how','however','i','if','in','into','is','it','its','just','least','let','like','likely','may','me','might','most','must','my','neither','no','nor','not','of','off','often','on','only','or','other','our','own','rather','said','say','says','she','should','since','so','some','than','that','the','their','them','then','there','these','they','this','tis','to','too','twas','us','wants','was','we','were','what','when','where','which','while','who','whom','why','will','with','would','yet','you','your']),a.Pipeline.registerFunction(a.stopWordFilter,'stopWordFilter'),a.trimmer=function(a){return a.update(function(a){return a.replace(/^\W+/,'').replace(/\W+$/,'')})},a.Pipeline.registerFunction(a.trimmer,'trimmer'),a.TokenSet=function(){this.final=!1,this.edges={},this.id=a.TokenSet._nextId,a.TokenSet._nextId+=1},a.TokenSet._nextId=1,a.TokenSet.fromArray=function(d){for(var b=new a.TokenSet.Builder,c=0,e=d.length;c<e;c++)b.insert(d[c]);return b.finish(),b.root},a.TokenSet.fromClause=function(b){return'editDistance'in b?a.TokenSet.fromFuzzyString(b.term,b.editDistance):a.TokenSet.fromString(b.term)},a.TokenSet.fromFuzzyString=function(k,l){for(var j=new a.TokenSet,c=[{node:j,editsRemaining:l,str:k}],b,i,d,f,g,m,h,e;c.length;){if(b=c.pop(),b.str.length>0&&(i=b.str.charAt(0),i in b.node.edges?d=b.node.edges[i]:(d=new a.TokenSet,b.node.edges[i]=d),b.str.length==1&&(d.final=!0),c.push({node:d,editsRemaining:b.editsRemaining,str:b.str.slice(1)})),b.editsRemaining==0)continue;"*"in b.node.edges?(f=b.node.edges["*"]):(f=new a.TokenSet,b.node.edges["*"]=f),b.str.length==0&&(f.final=!0),c.push({node:f,editsRemaining:b.editsRemaining-1,str:b.str}),b.str.length>1&&c.push({node:b.node,editsRemaining:b.editsRemaining-1,str:b.str.slice(1)}),b.str.length==1&&(b.node.final=!0),b.str.length>=1&&("*"in b.node.edges?(g=b.node.edges["*"]):(g=new a.TokenSet,b.node.edges["*"]=g),b.str.length==1&&(g.final=!0),c.push({node:g,editsRemaining:b.editsRemaining-1,str:b.str.slice(1)})),b.str.length>1&&(m=b.str.charAt(0),h=b.str.charAt(1),h in b.node.edges?e=b.node.edges[h]:(e=new a.TokenSet,b.node.edges[h]=e),b.str.length==1&&(e.final=!0),c.push({node:e,editsRemaining:b.editsRemaining-1,str:m+b.str.slice(2)}))}return j},a.TokenSet.fromString=function(f){for(var b=new a.TokenSet,i=b,c=0,g=f.length,d,h,e;c<g;c++)d=f[c],h=c==g-1,d=="*"?(b.edges[d]=b,b.final=h):(e=new a.TokenSet,e.final=h,b.edges[d]=e,b=e);return i},a.TokenSet.prototype.toArray=function(){for(var d=[],b=[{prefix:"",node:this}],a,e,g,c,f;b.length;){a=b.pop(),e=Object.keys(a.node.edges),g=e.length,a.node.final&&(a.prefix.charAt(0),d.push(a.prefix));for(c=0;c<g;c++)f=e[c],b.push({prefix:a.prefix.concat(f),node:a.node.edges[f]})}return d},a.TokenSet.prototype.toString=function(){var a,c,e,b,d,f;if(this._str)return this._str;a=this.final?'1':'0',c=Object.keys(this.edges).sort(),e=c.length;for(b=0;b<e;b++)d=c[b],f=this.edges[d],a=a+d+f.id;return a},a.TokenSet.prototype.intersect=function(q){for(var l=new a.TokenSet,b=void 0,e=[{qNode:q,output:l,node:this}],k,o,j,p,h,g,f,d,m,i,n,c;e.length;){b=e.pop(),k=Object.keys(b.qNode.edges),o=k.length,j=Object.keys(b.node.edges),p=j.length;for(h=0;h<o;h++){g=k[h];for(f=0;f<p;f++)d=j[f],(d==g||g=='*')&&(m=b.node.edges[d],i=b.qNode.edges[g],n=m.final&&i.final,c=void 0,d in b.output.edges?(c=b.output.edges[d],c.final=c.final||n):(c=new a.TokenSet,c.final=n,b.output.edges[d]=c),e.push({qNode:i,output:c,node:m}))}}return l},a.TokenSet.Builder=function(){this.previousWord="",this.root=new a.TokenSet,this.uncheckedNodes=[],this.minimizedNodes={}},a.TokenSet.Builder.prototype.insert=function(c){var d,e=0,b,f,g;if(c<this.previousWord)throw new Error("Out of order word insertion");for(b=0;b<c.length&&b<this.previousWord.length;b++){if(c[b]!=this.previousWord[b])break;e++}this.minimize(e),this.uncheckedNodes.length==0?d=this.root:d=this.uncheckedNodes[this.uncheckedNodes.length-1].child;for(b=e;b<c.length;b++)f=new a.TokenSet,g=c[b],d.edges[g]=f,this.uncheckedNodes.push({parent:d,char:g,child:f}),d=f;d.final=!0,this.previousWord=c},a.TokenSet.Builder.prototype.finish=function(){this.minimize(0)},a.TokenSet.Builder.prototype.minimize=function(d){for(var c=this.uncheckedNodes.length-1,a,b;c>=d;c--)a=this.uncheckedNodes[c],b=a.child.toString(),b in this.minimizedNodes?a.parent.edges[a.char]=this.minimizedNodes[b]:(a.child._str=b,this.minimizedNodes[b]=a.child),this.uncheckedNodes.pop()},a.Index=function(a){this.invertedIndex=a.invertedIndex,this.fieldVectors=a.fieldVectors,this.tokenSet=a.tokenSet,this.fields=a.fields,this.pipeline=a.pipeline},a.Index.prototype.search=function(b){return this.query(function(c){var d=new a.QueryParser(b,c);d.parse()})},a.Index.prototype.query=function(L){for(var k=new a.Query(this.fields),h=Object.create(null),t=Object.create(null),B=Object.create(null),f=Object.create(null),g=Object.create(null),c=0,d,n,x,p,N,P,q,e,b,s,o,G,O,C,w,K,A,v,H,l,D,E,y,u,m,I,J,i,j,M,z,r,F;c<this.fields.length;c++)t[this.fields[c]]=new a.Vector;L.call(k,k);for(c=0;c<k.clauses.length;c++){d=k.clauses[c],n=null,x=a.Set.empty,d.usePipeline?n=this.pipeline.runString(d.term,{fields:d.fields}):n=[d.term];for(p=0;p<n.length;p++){if(N=n[p],d.term=N,P=a.TokenSet.fromClause(d),q=this.tokenSet.intersect(P).toArray(),q.length===0&&d.presence===a.Query.presence.REQUIRED){for(e=0;e<d.fields.length;e++)b=d.fields[e],f[b]=a.Set.empty;break}for(s=0;s<q.length;s++){o=q[s],G=this.invertedIndex[o],O=G._index;for(e=0;e<d.fields.length;e++){if(b=d.fields[e],C=G[b],w=Object.keys(C),K=o+"/"+b,A=new a.Set(w),d.presence==a.Query.presence.REQUIRED&&(x=x.union(A),f[b]===void 0&&(f[b]=a.Set.complete)),d.presence==a.Query.presence.PROHIBITED){g[b]===void 0&&(g[b]=a.Set.empty),g[b]=g[b].union(A);continue}if(t[b].upsert(O,d.boost,function(a,b){return a+b}),B[K])continue;for(v=0;v<w.length;v++)H=w[v],l=new a.FieldRef(H,b),D=C[H],(E=h[l])===void 0?h[l]=new a.MatchData(o,b,D):E.add(o,b,D);B[K]=!0}}}if(d.presence===a.Query.presence.REQUIRED)for(e=0;e<d.fields.length;e++)b=d.fields[e],f[b]=f[b].intersect(x)}y=a.Set.complete,u=a.Set.empty;for(c=0;c<this.fields.length;c++)b=this.fields[c],f[b]&&(y=y.intersect(f[b])),g[b]&&(u=u.union(g[b]));if(m=Object.keys(h),I=[],J=Object.create(null),k.isNegated()){m=Object.keys(this.fieldVectors);for(c=0;c<m.length;c++)l=m[c],i=a.FieldRef.fromString(l),h[l]=new a.MatchData}for(c=0;c<m.length;c++){if(i=a.FieldRef.fromString(m[c]),j=i.docRef,!y.contains(j))continue;if(u.contains(j))continue;M=this.fieldVectors[i],z=t[i.fieldName].similarity(M),(r=J[j])!==void 0?(r.score+=z,r.matchData.combine(h[i])):(F={ref:j,score:z,matchData:h[i]},J[j]=F,I.push(F))}return I.sort(function(a,b){return b.score-a.score})},a.Index.prototype.toJSON=function(){var b=Object.keys(this.invertedIndex).sort().map(function(a){return[a,this.invertedIndex[a]]},this),c=Object.keys(this.fieldVectors).map(function(a){return[a,this.fieldVectors[a].toJSON()]},this);return{version:a.version,fields:this.fields,fieldVectors:c,invertedIndex:b,pipeline:this.pipeline.toJSON()}},a.Index.load=function(d){var c={},j={},k=d.fieldVectors,g=Object.create(null),h=d.invertedIndex,f=new a.TokenSet.Builder,l=a.Pipeline.load(d.pipeline),b,e,n,m,i,o;d.version!=a.version&&a.utils.warn("Version mismatch when loading serialised index. Current version of lunr '"+a.version+"' does not match serialized index '"+d.version+"'");for(b=0;b<k.length;b++)e=k[b],n=e[0],m=e[1],j[n]=new a.Vector(m);for(b=0;b<h.length;b++)e=h[b],i=e[0],o=e[1],f.insert(i),g[i]=o;return f.finish(),c.fields=d.fields,c.fieldVectors=j,c.invertedIndex=g,c.tokenSet=f.root,c.pipeline=l,new a.Index(c)},a.Builder=function(){this._ref="id",this._fields=Object.create(null),this._documents=Object.create(null),this.invertedIndex=Object.create(null),this.fieldTermFrequencies={},this.fieldLengths={},this.tokenizer=a.tokenizer,this.pipeline=new a.Pipeline,this.searchPipeline=new a.Pipeline,this.documentCount=0,this._b=.75,this._k1=1.2,this.termIndex=0,this.metadataWhitelist=[]},a.Builder.prototype.ref=function(a){this._ref=a},a.Builder.prototype.field=function(a,b){if(/\//.test(a))throw new RangeError("Field '"+a+"' contains illegal character '/'");this._fields[a]=b||{}},a.Builder.prototype.b=function(a){a<0?this._b=0:a>1?this._b=1:this._b=a},a.Builder.prototype.k1=function(a){this._k1=a},a.Builder.prototype.add=function(o,s){var d=o[this._ref],f=Object.keys(this._fields),m,c,p,r,q,k,l,g,n,b,j,i,h,e,t;this._documents[d]=s||{},this.documentCount+=1;for(m=0;m<f.length;m++){c=f[m],p=this._fields[c].extractor,r=p?p(o):o[c],q=this.tokenizer(r,{fields:[c]}),k=this.pipeline.run(q),l=new a.FieldRef(d,c),g=Object.create(null),this.fieldTermFrequencies[l]=g,this.fieldLengths[l]=0,this.fieldLengths[l]+=k.length;for(n=0;n<k.length;n++){if(b=k[n],g[b]==void 0&&(g[b]=0),g[b]+=1,this.invertedIndex[b]==void 0){j=Object.create(null),j._index=this.termIndex,this.termIndex+=1;for(i=0;i<f.length;i++)j[f[i]]=Object.create(null);this.invertedIndex[b]=j}this.invertedIndex[b][c][d]==void 0&&(this.invertedIndex[b][c][d]=Object.create(null));for(h=0;h<this.metadataWhitelist.length;h++)e=this.metadataWhitelist[h],t=b.metadata[e],this.invertedIndex[b][c][d][e]==void 0&&(this.invertedIndex[b][c][d][e]=[]),this.invertedIndex[b][c][d][e].push(t)}}},a.Builder.prototype.calculateAverageFieldLengths=function(){for(var i=Object.keys(this.fieldLengths),j=i.length,d={},e={},b=0,h,c,g,f;b<j;b++)h=a.FieldRef.fromString(i[b]),c=h.fieldName,e[c]||(e[c]=0),e[c]+=1,d[c]||(d[c]=0),d[c]+=this.fieldLengths[h];g=Object.keys(this._fields);for(b=0;b<g.length;b++)f=g[b],d[f]=d[f]/e[f];this.averageFieldLength=d},a.Builder.prototype.createFieldVectors=function(){for(var o={},i=Object.keys(this.fieldTermFrequencies),u=i.length,f=Object.create(null),g=0,c,n,t,j,k,l,r,q,v,h,b,m,s,d,e,p;g<u;g++){c=a.FieldRef.fromString(i[g]),n=c.fieldName,t=this.fieldLengths[c],j=new a.Vector,k=this.fieldTermFrequencies[c],l=Object.keys(k),r=l.length,q=this._fields[n].boost||1,v=this._documents[c.docRef].boost||1;for(h=0;h<r;h++)b=l[h],m=k[b],s=this.invertedIndex[b]._index,f[b]===void 0?(d=a.idf(this.invertedIndex[b],this.documentCount),f[b]=d):d=f[b],e=d*((this._k1+1)*m)/(this._k1*(1-this._b+this._b*(t/this.averageFieldLength[n]))+m),e*=q,e*=v,p=Math.round(e*1e3)/1e3,j.insert(s,p);o[c]=j}this.fieldVectors=o},a.Builder.prototype.createTokenSet=function(){this.tokenSet=a.TokenSet.fromArray(Object.keys(this.invertedIndex).sort())},a.Builder.prototype.build=function(){return this.calculateAverageFieldLengths(),this.createFieldVectors(),this.createTokenSet(),new a.Index({invertedIndex:this.invertedIndex,fieldVectors:this.fieldVectors,tokenSet:this.tokenSet,fields:Object.keys(this._fields),pipeline:this.searchPipeline})},a.Builder.prototype.use=function(b){var a=Array.prototype.slice.call(arguments,1);a.unshift(this),b.apply(this,a)},a.MatchData=function(a,g,c){for(var d=Object.create(null),e=Object.keys(c||{}),b=0,f;b<e.length;b++)f=e[b],d[f]=c[f].slice();this.metadata=Object.create(null),a!==void 0&&(this.metadata[a]=Object.create(null),this.metadata[a][g]=d)},a.MatchData.prototype.combine=function(d){for(var h=Object.keys(d.metadata),e=0,a,i,f,b,j,g,c;e<h.length;e++){a=h[e],i=Object.keys(d.metadata[a]),this.metadata[a]==void 0&&(this.metadata[a]=Object.create(null));for(f=0;f<i.length;f++){b=i[f],j=Object.keys(d.metadata[a][b]),this.metadata[a][b]==void 0&&(this.metadata[a][b]=Object.create(null));for(g=0;g<j.length;g++)c=j[g],this.metadata[a][b][c]==void 0?this.metadata[a][b][c]=d.metadata[a][b][c]:this.metadata[a][b][c]=this.metadata[a][b][c].concat(d.metadata[a][b][c])}}},a.MatchData.prototype.add=function(a,b,d){var f,e,c;if(!(a in this.metadata)){this.metadata[a]=Object.create(null),this.metadata[a][b]=d;return}if(!(b in this.metadata[a])){this.metadata[a][b]=d;return}f=Object.keys(d);for(e=0;e<f.length;e++)c=f[e],c in this.metadata[a][b]?this.metadata[a][b][c]=this.metadata[a][b][c].concat(d[c]):this.metadata[a][b][c]=d[c]},a.Query=function(a){this.clauses=[],this.allFields=a},a.Query.wildcard=new String("*"),a.Query.wildcard.NONE=0,a.Query.wildcard.LEADING=1,a.Query.wildcard.TRAILING=2,a.Query.presence={OPTIONAL:1,REQUIRED:2,PROHIBITED:3},a.Query.prototype.clause=function(b){return'fields'in b||(b.fields=this.allFields),'boost'in b||(b.boost=1),'usePipeline'in b||(b.usePipeline=!0),'wildcard'in b||(b.wildcard=a.Query.wildcard.NONE),b.wildcard&a.Query.wildcard.LEADING&&b.term.charAt(0)!=a.Query.wildcard&&(b.term="*"+b.term),b.wildcard&a.Query.wildcard.TRAILING&&b.term.slice(-1)!=a.Query.wildcard&&(b.term=""+b.term+"*"),'presence'in b||(b.presence=a.Query.presence.OPTIONAL),this.clauses.push(b),this},a.Query.prototype.isNegated=function(){for(var b=0;b<this.clauses.length;b++)if(this.clauses[b].presence!=a.Query.presence.PROHIBITED)return!1;return!0},a.Query.prototype.term=function(b,c){if(Array.isArray(b))return b.forEach(function(b){this.term(b,a.utils.clone(c))},this),this;var d=c||{};return d.term=b.toString(),this.clause(d),this},a.QueryParseError=function(a,b,c){this.name="QueryParseError",this.message=a,this.start=b,this.end=c},a.QueryParseError.prototype=new Error,a.QueryLexer=function(a){this.lexemes=[],this.str=a,this.length=a.length,this.pos=0,this.start=0,this.escapeCharPositions=[]},a.QueryLexer.prototype.run=function(){for(var b=a.QueryLexer.lexText;b;)b=b(this)},a.QueryLexer.prototype.sliceString=function(){for(var a=[],b=this.start,c=this.pos,d=0;d<this.escapeCharPositions.length;d++)c=this.escapeCharPositions[d],a.push(this.str.slice(b,c)),b=c+1;return a.push(this.str.slice(b,this.pos)),this.escapeCharPositions.length=0,a.join('')},a.QueryLexer.prototype.emit=function(a){this.lexemes.push({type:a,str:this.sliceString(),start:this.start,end:this.pos}),this.start=this.pos},a.QueryLexer.prototype.escapeCharacter=function(){this.escapeCharPositions.push(this.pos-1),this.pos+=1},a.QueryLexer.prototype.next=function(){if(this.pos>=this.length)return a.QueryLexer.EOS;var b=this.str.charAt(this.pos);return this.pos+=1,b},a.QueryLexer.prototype.width=function(){return this.pos-this.start},a.QueryLexer.prototype.ignore=function(){this.start==this.pos&&(this.pos+=1),this.start=this.pos},a.QueryLexer.prototype.backup=function(){this.pos-=1},a.QueryLexer.prototype.acceptDigitRun=function(){var b,c;do b=this.next(),c=b.charCodeAt(0);while(c>47&&c<58)b!=a.QueryLexer.EOS&&this.backup()},a.QueryLexer.prototype.more=function(){return this.pos<this.length},a.QueryLexer.EOS='EOS',a.QueryLexer.FIELD='FIELD',a.QueryLexer.TERM='TERM',a.QueryLexer.EDIT_DISTANCE='EDIT_DISTANCE',a.QueryLexer.BOOST='BOOST',a.QueryLexer.PRESENCE='PRESENCE',a.QueryLexer.lexField=function(b){return b.backup(),b.emit(a.QueryLexer.FIELD),b.ignore(),a.QueryLexer.lexText},a.QueryLexer.lexTerm=function(b){if(b.width()>1&&(b.backup(),b.emit(a.QueryLexer.TERM)),b.ignore(),b.more())return a.QueryLexer.lexText},a.QueryLexer.lexEditDistance=function(b){return b.ignore(),b.acceptDigitRun(),b.emit(a.QueryLexer.EDIT_DISTANCE),a.QueryLexer.lexText},a.QueryLexer.lexBoost=function(b){return b.ignore(),b.acceptDigitRun(),b.emit(a.QueryLexer.BOOST),a.QueryLexer.lexText},a.QueryLexer.lexEOS=function(b){b.width()>0&&b.emit(a.QueryLexer.TERM)},a.QueryLexer.termSeparator=a.tokenizer.separator,a.QueryLexer.lexText=function(b){while(!0){var c=b.next();if(c==a.QueryLexer.EOS)return a.QueryLexer.lexEOS;if(c.charCodeAt(0)==92){b.escapeCharacter();continue}if(c==":")return a.QueryLexer.lexField;if(c=="~")return b.backup(),b.width()>0&&b.emit(a.QueryLexer.TERM),a.QueryLexer.lexEditDistance;if(c=="^")return b.backup(),b.width()>0&&b.emit(a.QueryLexer.TERM),a.QueryLexer.lexBoost;if(c=="+"&&b.width()===1)return b.emit(a.QueryLexer.PRESENCE),a.QueryLexer.lexText;if(c=="-"&&b.width()===1)return b.emit(a.QueryLexer.PRESENCE),a.QueryLexer.lexText;if(c.match(a.QueryLexer.termSeparator))return a.QueryLexer.lexTerm}},a.QueryParser=function(b,c){this.lexer=new a.QueryLexer(b),this.query=c,this.currentClause={},this.lexemeIdx=0},a.QueryParser.prototype.parse=function(){this.lexer.run(),this.lexemes=this.lexer.lexemes;for(var b=a.QueryParser.parseClause;b;)b=b(this);return this.query},a.QueryParser.prototype.peekLexeme=function(){return this.lexemes[this.lexemeIdx]},a.QueryParser.prototype.consumeLexeme=function(){var a=this.peekLexeme();return this.lexemeIdx+=1,a},a.QueryParser.prototype.nextClause=function(){var a=this.currentClause;this.query.clause(a),this.currentClause={}},a.QueryParser.parseClause=function(d){var b=d.peekLexeme(),c;if(b==void 0)return;switch(b.type){case a.QueryLexer.PRESENCE:return a.QueryParser.parsePresence;case a.QueryLexer.FIELD:return a.QueryParser.parseField;case a.QueryLexer.TERM:return a.QueryParser.parseTerm;default:throw c="expected either a field or a term, found "+b.type,b.str.length>=1&&(c+=" with value '"+b.str+"'"),new a.QueryParseError(c,b.start,b.end)}},a.QueryParser.parsePresence=function(e){var b=e.consumeLexeme(),c,d;if(b==void 0)return;switch(b.str){case"-":e.currentClause.presence=a.Query.presence.PROHIBITED;break;case"+":e.currentClause.presence=a.Query.presence.REQUIRED;break;default:throw c="unrecognised presence operator'"+b.str+"'",new a.QueryParseError(c,b.start,b.end)}if(d=e.peekLexeme(),d==void 0)throw c="expecting term or field, found nothing",new a.QueryParseError(c,b.start,b.end);switch(d.type){case a.QueryLexer.FIELD:return a.QueryParser.parseField;case a.QueryLexer.TERM:return a.QueryParser.parseTerm;default:throw c="expecting term or field, found '"+d.type+"'",new a.QueryParseError(c,d.start,d.end)}},a.QueryParser.parseField=function(c){var b=c.consumeLexeme(),f,d,e;if(b==void 0)return;if(c.query.allFields.indexOf(b.str)==-1)throw f=c.query.allFields.map(function(a){return"'"+a+"'"}).join(', '),d="unrecognised field '"+b.str+"', possible fields: "+f,new a.QueryParseError(d,b.start,b.end);if(c.currentClause.fields=[b.str],e=c.peekLexeme(),e==void 0)throw d="expecting term, found nothing",new a.QueryParseError(d,b.start,b.end);switch(e.type){case a.QueryLexer.TERM:return a.QueryParser.parseTerm;default:throw d="expecting term, found '"+e.type+"'",new a.QueryParseError(d,e.start,e.end)}},a.QueryParser.parseTerm=function(b){var d=b.consumeLexeme(),c,e;if(d==void 0)return;if(b.currentClause.term=d.str.toLowerCase(),d.str.indexOf("*")!=-1&&(b.currentClause.usePipeline=!1),c=b.peekLexeme(),c==void 0){b.nextClause();return}switch(c.type){case a.QueryLexer.TERM:return b.nextClause(),a.QueryParser.parseTerm;case a.QueryLexer.FIELD:return b.nextClause(),a.QueryParser.parseField;case a.QueryLexer.EDIT_DISTANCE:return a.QueryParser.parseEditDistance;case a.QueryLexer.BOOST:return a.QueryParser.parseBoost;case a.QueryLexer.PRESENCE:return b.nextClause(),a.QueryParser.parsePresence;default:throw e="Unexpected lexeme type '"+c.type+"'",new a.QueryParseError(e,c.start,c.end)}},a.QueryParser.parseEditDistance=function(b){var d=b.consumeLexeme(),f,e,c;if(d==void 0)return;if(f=parseInt(d.str,10),isNaN(f))throw e="edit distance must be numeric",new a.QueryParseError(e,d.start,d.end);if(b.currentClause.editDistance=f,c=b.peekLexeme(),c==void 0){b.nextClause();return}switch(c.type){case a.QueryLexer.TERM:return b.nextClause(),a.QueryParser.parseTerm;case a.QueryLexer.FIELD:return b.nextClause(),a.QueryParser.parseField;case a.QueryLexer.EDIT_DISTANCE:return a.QueryParser.parseEditDistance;case a.QueryLexer.BOOST:return a.QueryParser.parseBoost;case a.QueryLexer.PRESENCE:return b.nextClause(),a.QueryParser.parsePresence;default:throw e="Unexpected lexeme type '"+c.type+"'",new a.QueryParseError(e,c.start,c.end)}},a.QueryParser.parseBoost=function(b){var d=b.consumeLexeme(),f,e,c;if(d==void 0)return;if(f=parseInt(d.str,10),isNaN(f))throw e="boost must be numeric",new a.QueryParseError(e,d.start,d.end);if(b.currentClause.boost=f,c=b.peekLexeme(),c==void 0){b.nextClause();return}switch(c.type){case a.QueryLexer.TERM:return b.nextClause(),a.QueryParser.parseTerm;case a.QueryLexer.FIELD:return b.nextClause(),a.QueryParser.parseField;case a.QueryLexer.EDIT_DISTANCE:return a.QueryParser.parseEditDistance;case a.QueryLexer.BOOST:return a.QueryParser.parseBoost;case a.QueryLexer.PRESENCE:return b.nextClause(),a.QueryParser.parsePresence;default:throw e="Unexpected lexeme type '"+c.type+"'",new a.QueryParseError(e,c.start,c.end)}},function(b,a){typeof define=='function'&&define.amd?define(a):typeof exports=='object'?module.exports=a():b.lunr=a()}(this,function(){return a})})()
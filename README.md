# gil
nihongo parser
```css
/*
import "https://hashsan.github.io/gil/gil.js";
*/
@import url("https://hashsan.github.io/gil/gil.css");

```

```js

import "https://hashsan.github.io/gil/gil.js";

//need min-height
const edit = document.querySelector('#edit')
const view = document.querySelector('#view')

edit.style.display='none'
view.onclick = ()=>{
  //console.log('view.onclick')
  view.style.display='none';
  edit.style.display='block';
  edit.focus();
}
edit.onblur =()=>{
  //console.log('edit.onblur')  
  view.style.display='block';
  edit.style.display='none';
  view.innerHTML= gil(edit.innerHTML) 
}

```


```
//ジルのインターフェイス
const html = gil(temp);
```

```
//仕組み

function gil(temp){
  const html = temp.trim().split('\n').map(parse).join('\n')
  return html;
}

window.gil = gil;
```

```
//ジルの仕様

＃＠は、サイトタイトルを示す -----> <h1><a>...</a></h1>
＃は、記事タイトルを示す ---------> <h2>...</h2>
＃＃は、記事のセンテンスを示す---> <h3>...</h3>
＠は、縦並びのリンクを示す--------> <p><a>...</a></p>
＠＠は、横並びの小さなリンクを示す -----> <a style="font-size:0.7em">...</a>
通常はパラフレーズ           ----> <p></p>
改行の空白はbr            ------> <br>
文中で＊強調＊は強調-------------> <strong>...</strong>

：文字列：は、中央揃え  ---------> <p style="text-align:center">...</p>
文字列：は、右揃え --------------> <p style="text-align:right">...</p>

＠は内部サイトか判定できる ---> <a href="..." role="navigation">...</a>
＠は外部サイトか判定できる ---> <a href="http..." _blank="target" rel="noopener noreffer">...</a>
```

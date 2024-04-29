function gil(temp) {
  return temp.trim().split('\n').map(parse).join('\n');
}

function parse(line) {
  const { content, position } = checkPosition(line);
  let html = mainParse(content);
  html = wrapMark(html);
  return wrapPosition(html, position);
}

const re_pure = /^</;
const re_comm =/^\/\//;

const re_br = /^$/;
const re_h1 = /^(＃＠|#@)/;
const re_h3 = /^(＃＃|##)/;
const re_h2 = /^(＃|#)/;
const re_a2 = /^(@@|＠＠)/;
const re_a = /^(@|＠)/;
const re_s = /^\^/;

function mainParse(line) {
  let html = line;
  if (re_pure.test(line)){
    html = line;
  } else if (re_comm.test(line)){
    html = `<!-- ${line} -->`  
  } else if (re_br.test(line)) {
    html = '<br>';
  } else if (re_h1.test(line)) {
    const title = line.slice(1);
    html = `<h1>${makeLink(title)}</h1>`;
  } else if (re_h3.test(line)) {
    const sentence = line.slice(2);
    html = `<h3>${sentence}</h3>`;
  } else if (re_h2.test(line)) {
    const title = line.slice(1);
    html = `<h2>${title}</h2>`;
  } else if (re_a2.test(line)) {
    const linkContent = line.slice(1);
    html = `<span style="font-size:0.7em;">${makeLink(linkContent)}</span>`;
  } else if (re_a.test(line)) {
    html = `<p>${makeLink(line)}</p>`;
  } else if (re_s.test(line)) {
    const small = line.slice(1)
    html = `<p style="font-size:0.7em;">${small}</p>`;    
  } else {
    html = `<p>${line}</p>`;
  }
  return html;
}

const re_mark = /[\*＊](.+?)[\*＊]/g;

function wrapMark(html) {
  return html.replace(re_mark, '<mark>$1</mark>');
}

const re_position = /^[：:](.+?)[：:]$|^([^：:]+?)[：:]$|^[：:]([^：:]+?)$/;

function checkPosition(line) {
  const match = line.match(re_position);
  let content, position;
  if (match) {
    content = match[1] || match[2] || match[3];
    if (match[1]) position = 'center';
    else if (match[2]) position = 'right';
    else if (match[3]) position = 'left';
  } else {
    content = line;
    position = 'inherit';
  }
  return { content, position };
}

function wrapPosition(html, position) {
  if (position === 'center') {
    return `<div style="text-align:center">${html}</div>`;
  } else if (position === 'right') {
    return `<div style="text-align:right">${html}</div>`;
  } else if (position === 'left') {
    return `<div style="text-align:left">${html}</div>`;
  } else {
    return html;
  }
}

const re_http = /^http/;
const re_link = /[@＠]([^@＠]+?)[(（]([^)）]+?)[)）]/;

function isOuterLink(url) {
  return re_http.test(url);
}

function makeLink(line) {
  const match = line.match(re_link);
  if (!match) {
    console.log('illegal link', line);
    return `<a>${line}</a>`;
  }
  const word = match[1];
  const url = match[2] || match[1];
  const linkType = isOuterLink(url) ? 'target="_blank" rel="noopener noreferrer"' : 'role="navigation"';
  return `<a href="${url}" ${linkType}>${word}</a>`;
}

window.gil = gil; /////////////////////////////////////////////

/*
var temp = `
//コメント
@@PR(#)
@@お問い合わせ(#)
@@ポリシー(#)
＃＠とあるサイト.com(index.html)
＃gilテスト
:こうやると中央:
文字列の中で＊強調＊はこれ。
右端にする。：
：中央揃えの中で＊強調＊するのは、これ。：
右揃えの中で＊強調＊するのは、これ。：
ここまでは、オーケー。あとはメインについて。

＠行リンク(#)
＠行リンク２(#)

^小さくしたい時がある：

＠＠リンク（#meta）
＠＠リンク２（#）
`;

document.body.innerHTML = gil(temp);
*/

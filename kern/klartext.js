'use strict';
// Schreibt die Bedingung einer Regel in Worten aus.
function klartext(b, wenn) {
  const A = new Map(b.angaben.map(a => [a.id, a]));
  const f = (x) => {
    if (x === 'immer') return 'immer';
    if (typeof x === 'string') return b.merkmale[x] || x;
    if ('angabe' in x) {
      const a = A.get(x.angabe); const n = a ? a.frage.replace(/\?$/, '') : x.angabe;
      if ('ist' in x) return `„${n}“: ${x.ist === true ? 'ja' : x.ist === false ? 'nein' : x.ist}`;
      return 'ab' in x ? `„${n}“: ab ${x.ab}` : `„${n}“: bis ${x.bis}`;
    }
    if (x.alle) return x.alle.map(f).map(t => (x.alle.length > 1 && / oder /.test(t) ? `(${t})` : t)).join(' UND ');
    if (x.eine) return x.eine.map(f).map(t => (/ UND /.test(t) ? `(${t})` : t)).join(' oder ');
    if (x.nicht) return `nicht (${f(x.nicht)})`;
    return JSON.stringify(x);
  };
  return f(wenn);
}
module.exports = { klartext };

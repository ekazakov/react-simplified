// https://itnext.io/creating-our-own-react-from-scratch-82dd6356676d

import './style.css';
import { cComp, cElm, cTxt, React } from './react';
// =======================
const root = document.getElementById('app');

const App = () => {
  return cElm('article', { className: 'main', key: 'article-1' }, [
    cElm('h1', { className: 'article-header', key: 'h1-1' }, [
      cTxt('Hello React'),
    ]),
    cElm('p', { className: 'article-content', key: 'p-1' }, [
      cTxt("OMG! It's amaising!"),
    ]),
    // t(Counter, {}),
    // t(Counter, {}),
  ]);
};

console.log('app', cComp(App, { key: 'app' }));
// React.render(t(App, {}), root);

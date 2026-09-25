const main = document.createElement('main');
const h1 = document.createElement('h1');
h1.textContent = 'Rendered by the client';
const p = document.createElement('p');
p.textContent = 'The source has no landmark and no heading. The page has both.';
main.append(h1, p);
document.getElementById('root').append(main);

import Fuse from 'fuse.js';

const items = [{title: 'chicken white sauce pasta'}];
const fuse = new Fuse(items, {
  keys: ['title', 'body'],
  threshold: 0.3,
  ignoreLocation: true
});

console.log(fuse.search('sauce'));
console.log(fuse.search('white'));
console.log(fuse.search('pasta'));
console.log(fuse.search('chicken'));

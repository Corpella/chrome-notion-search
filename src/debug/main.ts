import { BasicBlock } from '../popup/search/Record/Block/Basic';

const block = new BasicBlock({
  block: JSON.parse(prompt('json') || ''),
});

console.info({
  title: block.title,
  icon: block.icon,
});

const elem = document.getElementById('result');
if (elem) elem.textContent = '\n' + JSON.stringify(block, null, 2);

import Ember from 'ember';
const { isPresent } = Ember;

export function formatTerm(params) {
  const term = params[0];
  const characters = ['',''];
  let formatted;

  if (isPresent(term)) {
    const termCharacters = String(term).split('');
    termCharacters.reverse().forEach((character, index) => {
      characters[1 - index] = character;
    });
  }

  // TODO: refactor
  const htmlString = characters.map((c) => {
    return `<span class='d-char'>${c}</span>`;
  }).join('');

  return Ember.String.htmlSafe(htmlString);
}

export default Ember.Helper.helper(formatTerm);

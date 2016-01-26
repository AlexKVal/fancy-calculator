import Ember from 'ember';

const {
  isPresent,
  computed
} = Ember;

export default Ember.Component.extend({
  classNames: ['display'],
  isEqualVisible: false,

  termOne: null,
  termTwo: null,
  answer: null,
  level: null,
  operator: null,

  _pad(value, length) {
    return `  ${value}`.slice(-length).split('').map((s) => {
      return isPresent(s.trim()) ? s : ''; // TODO: use regexp
    });
  },

  characters: computed('termOne', 'termTwo', 'level', 'operator', function() {
    const {
      termOne, termTwo, answer,
      level, operator
    } = this.getProperties(
      'termOne', 'termTwo', 'answer',
      'level', 'operator'
    );

    let characters = [];

    if (isPresent(termOne)) {
      characters = characters.concat(`  ${termOne}`.slice(-2).split(''));
    } else {
      characters = characters.concat(['', '']);
    }

    if (isPresent(operator)) {
      characters.pushObject(operator);
    }

    if (isPresent(termTwo)) {
      characters = characters.concat(this._pad(termTwo));
    } else {
      characters = characters.concat(['', '']);
    }

    if (this.get('displayEquals')) {
      characters.pushObject('=');
    } else {
      characters.pushObject(' ');
    }

    if (isPresent(level)) {
      characters = characters.concat(['L', '', level]);
    } else {
      if (isPresent(answer)) {
        characters = characters.concat(`  ${answer}`.slice(-2).split(''));
      } else {
        characters = characters.concat(['', '']);
      }
    }

    return characters;
  })
});

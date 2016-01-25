import Ember from 'ember';

const {
  computed,
  isPresent
} = Ember;

export default Ember.Object.extend({
  termOne: null,
  termTwo: null,
  operator: null,

  isEvaluable: computed('termOne', 'termTwo', 'operator', function() {
    const { termOne, termTwo, operator } = this.getProperties('termOne', 'termTwo', 'operator');

    return isPresent(termOne) && isPresent(termTwo) && operator;
  }),


  answer: computed('termOne', 'termTwo', 'operator', function() {
    if (this.get('isEvaluable')) {
      const { termOne, termTwo, operator } = this.getProperties('termOne', 'termTwo', 'operator');

      return eval(`${termOne} ${operator} ${termTwo}`);
    }
  })
});

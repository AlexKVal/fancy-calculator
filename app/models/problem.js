import Ember from 'ember';

export default Ember.object.extend({
  termOne: null,
  termTwo: null,
  operator: null,

  isEvaluable: Ember.computed('termOne', 'termTwo', 'operator', function() {
    const termOne = this.get('termOne');
    const termTwo = this.get('termTwo');
    const operator = this.get('operator');

    return Ember.isPresent(termOne) && Ember.isPresent(termTwo) && operator;
  }),


  answer: Ember.computed('termOne', 'termTwo', 'operator', function() {
    if (this.get('isEvaluable')) {
      const termOne = this.get('termOne');
      const termTwo = this.get('termTwo');
      const operator = this.get('operator');

      return eval(`${termOne} ${operator} ${termTwo}`);
    }
  })
});

import DS from 'ember-data';

export default DS.Model.extend({
  termOne: null,
  termTwo: null,
  operator: null,

  isEvaluable: Ember.computed('termOne', 'termTwo', 'operator', function() {
    const termOne = this.get('termOne');
    const termTwo = this.get('termTwo');
    const operator = this.get('operator');

    // TODO: use smth like "is a number"
    const termOneIsDefined = termOne || termOne === 0;
    const termTwoIsDefined = termTwo || termTwo === 0;

    return termOneIsDefined && termTwoIsDefined && operator;
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

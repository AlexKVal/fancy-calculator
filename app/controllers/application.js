import Ember from 'ember';

export default Ember.Controller.extend({
  isOn: false,
  level: null,

  actions: {
    changeOperator(operator) {
      if (this.get('isOn')) {
        this.set('operator', operator);
      }
    }
  }
});

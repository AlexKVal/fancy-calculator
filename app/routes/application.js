import Ember from 'ember';

export default Ember.Route.extend({
  levels: [1, 2, 3, 4],

  setupController(controller) {
    controller.set('isOn', false);
  },

  actions: {
    turnOn() {
      const ctrl = this.controllerFor('application');
      ctrl.set('isOn', true);
      ctrl.set('level', this.get('levels').objectAt(0));
      ctrl.set('operator', '+');
    },

    turnOff() {
      this.controllerFor('application').set('isOn', false);
    },

    nextLevel() {
      const ctrl = this.controllerFor('application');
      if (ctrl.get('isOn')) {
        const level = ctrl.get('level');
        const levelIndex = this.get('levels').indexOf(level);
        const nextLevel = this.get('levels').objectAt(
          (levelIndex + 1) % this.get('levels').length
        );
        ctrl.set('level', nextLevel);
      }
    }
  }
});

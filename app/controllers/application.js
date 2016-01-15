import Ember from 'ember';

export default Ember.Controller.extend({
  levels: [1, 2, 3, 4],

  isOn: null,
  level: null,
  mode: null,

  inSettingsMode: Ember.computed('isOn', 'mode', function() {
    return this.get('isOn') && this.get('mode') === 'settings';
  }),

  inGameMode: Ember.computed('isOn', 'mode', function() {
    return this.get('isOn') && this.get('mode') === 'game';
  }),

  actions: {
    turnOn() {
      this.set('isOn', true);
      this.set('level', this.get('levels').objectAt(0));
      this.set('operator', '+');
      this.set('mode', 'settings');
    },

    turnOff() {
      this.set('isOn', false);
    },

    changeOperator(operator) {
      if (this.get('inSettingsMode')) {
        this.set('operator', operator);
      }
    },

    playGame() {
      if (this.get('inSettingsMode')) {
        this.set('mode', 'game');
      }
    },

    changeSettings() {
      if (this.get('inGameMode')) {
        this.set('mode', 'settings');
      }
    },

    nextLevel() {
      if (this.get('inSettingsMode')) {
        const level = this.get('level');
        const levelIndex = this.get('levels').indexOf(level);
        const nextLevel = this.get('levels').objectAt(
          (levelIndex + 1) % this.get('levels').length
        );
        this.set('level', nextLevel);
      }
    }
  }
});

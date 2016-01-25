import Ember from 'ember';
import { EKMixin, keyDown, getKey } from 'ember-keyboard';

export default Ember.Component.extend(EKMixin, {
  activateKeyboard: Ember.on('init', function() {
    this.set('keyboardActivated', true);
  }),
  onKeyDown: Ember.on(keyDown(), function(event) {
    const keyPressed = getKey(event);
    const buttonValue = this.get('value');
    if (keyPressed == buttonValue) { // jshint ignore:line
      this.get('onPress')(buttonValue);
    }
  }),

  actions: {
    press() {
      this.get('onPress')(this.get('value'));
    }
  }
});

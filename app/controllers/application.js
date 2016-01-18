import Ember from 'ember';

export default Ember.Controller.extend({
  levels: [1, 2, 3, 4],
  digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],

  isRetrying: Ember.computed.gt('tryCount', 0),

  problem: Ember.computed('problems', 'problemIndex', function() {
    return this.get('problems').objectAt(this.get('problemIndex'));
  }),

  isComplete: Ember.computed('problems', 'problemIndex', function() {
    if (Ember.isPresent(this.get('problemIndex')) && Ember.isPresent(this.get('problems'))) {
      return this.get('problemIndex') >= this.get('problems').length;
    }
  }),

  isAnswerComplete: Ember.computed('answer', 'problem.answer', function() {
    const answer = this.get('answer');
    const problemAnswer = this.get('problem.answer');

    if (Ember.isPresent(answer) && Ember.isPresent(problemAnswer)) {
      return answer.toString().length === problemAnswer.toString().length;
    }

    return false;
  }),

  isAnswerCorrect: Ember.computed('answer', 'problem.answer', function() {
    const answer = this.get('answer');
    const problemAnswer = this.get('problem.answer');

    if (Ember.isPresent(answer) && Ember.isPresent(problemAnswer)) {
      return answer === problemAnswer;
    }

    return false;
  }),

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

    go() {
      if (this.get('inSettingsMode')) {
        this.set('mode', 'game');
        this.send('newGame');
      } else {

        if (this.get('isDisplayingAnswer')) {
          this.toggleProperty('isDisplayingAnswer');
          this.send('nextProblem');
        } else if (this.get('isComplete')) {
          this.send('newGame');
        }

      }
    },

    newGame() {
      this.set('problemIndex', null);
      this.set('correctAnswerCount', 0);
      this.set('isDisplayingAnswer', false);

      const problems = [];
      while (problems.length < 3) {
        const newProblem = this.store.createRecord('problem', {
          termOne: Math.floor(Math.random() * 10),
          termTwo: Math.floor(Math.random() * 10),
          operator: this.get('operator');
        });

        problems.pushObject(newProblem);
      }

      this.set('problems', problems);
      this.send('nextProblem');
    },

    nextProblem() {
      this.set('answer', null);
      this.set('isAnswerLocked', false);
      this.set('isIncorrect', false);
      this.set('tryCount', 0);

      if (Ember.isPresent(this.get('problemIndex'))) {
        this.incrementProperty('problemIndex');
      } else {
        this.set('problemIndex', 0);
      }
    },

    changeSettings() {
      if (this.get('inGameMode')) {
        // TODO: use setProperties()
        this.set('mode', 'settings');
        this.set('problems', null);
        this.set('problemIndex', null);
        this.set('answer', null);
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
    },

    pressDigit(digit) {
      if (this.get('inGameMode') && !this.get('isAnswerLocked')) {
        const newAnswer = this.get('answer') ? parseInt(`${this.get('answer')}${digit}`) : digit;
        this.set('answer', newAnswer);

        if (this.get('isAnswerComplete')) {
          this.set('isAnswerLocked', true);
          this.incrementProperty('tryCount');

          if (this.get('isAnswerCorrect')) {
            if (this.get('tryCount') === 1) {
              this.incrementProperty('correctAnswerCount');
            }
            this.set('tryCount', 0);

            Ember.run.later(this, function() {
              this.send('nextProblem');
            }, 500);
          } else { // isAnswerComplete false
            Ember.run.later(this, function() {
              this.set('isIncorrect', true);
              Ember.run.later(this, function() {
                this.set('isIncorrect', false);
                this.set('isAnswerLocked', false);

                if (this.get('tryCount') === 3) {
                  this.set('answer', this.get('problem.answer'));
                  this.toggleProperty('isDisplayingAnswer');
                } else {
                  this.set('answer', null);
                }
              }, 1000);
            }, 500);
          }

        }
      }
    }
  }
});

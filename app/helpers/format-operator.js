import Ember from 'ember';

export function formatOperator(params/*, hash*/) {
  let formatted;

  switch (params[0]) {
    case "+":
      formatted = "+";
      break;
    case "-":
      formatted = "-";
      break;
    case "*":
      formatted = "&times;";
      break;
    case "%":
      formatted = "&divide;";
      break;
  }

  return Ember.String.htmlSafe(formatted);
}

export default Ember.Helper.helper(formatOperator);

Chart.defaults.parsing.date.parse = function(value) {
    return moment.utc(value);
  };
  
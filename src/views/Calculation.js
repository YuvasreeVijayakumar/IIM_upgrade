export const calculation = (x) => {
  if (isNaN(x)) return x;
  else if (x < 1000) {
    if (isNaN(x)) return x;
    else if (x > -1000) {
      let value = (Math.round(x * 1000) / 1000).toFixed(1);
      return '$' + value;
    } else if (x > -9999 || x > -1000000) {
      let value = (x / 1000).toFixed(1);
      return '$' + value + 'K';
    } else if (x > -10000000 || x > -1000000000) {
      let value = (x / 1000000).toFixed(1);
      return '$' + value + 'M';
    } else if (x > -1000000000000) {
      let value = (x / 1000000000).toFixed(1);
      return '$' + value + 'B';
    }
    let value = (Math.round(x * 1000) / 1000).toFixed(1);
    return '$' + value;
  } else if (x < 9999 || x < 1000000) {
    let value = (x / 1000).toFixed(1);
    return '$' + value + 'K';
  } else if (x < 10000000 || x < 1000000000) {
    let value = (x / 1000000).toFixed(1);
    return '$' + value + 'M';
  } else if (x < 1000000000000) {
    let value = (x / 1000000000).toFixed(1);
    return '$' + value + 'B';
  }
  return '$1T+';
};

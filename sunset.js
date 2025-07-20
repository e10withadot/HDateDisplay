function calculate(latitude, longitude, isSunrise, date) {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  // Convert latitude and longitude to radians
  const lat = latitude * rad;
  const lng = longitude * rad;

  // Calculate the day of the year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const dayOfYear = Math.floor(diff / 86400000);

  // Calculate the solar declination
  const declination = 0.4095 * Math.sin(0.016906 * (dayOfYear - 80.086));

  // Calculate the equation of time (in minutes)
  const eot = 229.18 * (0.000075 + 0.001868 * Math.cos(0.016906 * dayOfYear) 
    - 0.032077 * Math.sin(0.016906 * dayOfYear) 
    - 0.014615 * Math.cos(2 * 0.016906 * dayOfYear) 
    - 0.040849 * Math.sin(2 * 0.016906 * dayOfYear));

  // Calculate the hour angle
  const hourAngle = Math.acos(
    (Math.sin(-0.01454) - Math.sin(lat) * Math.sin(declination)) / 
      (Math.cos(lat) * Math.cos(declination))
  );

  // Calculate solar noon (in minutes from midnight)
  const solarNoon = 720 - 4 * longitude - eot;

  // Calculate sunrise/sunset time (in minutes from midnight)
  const sunriseSetMinutes = solarNoon + (isSunrise ? -4 : 4) * hourAngle * deg;

  // Convert minutes to milliseconds and create a new Date object
  const sunriseSetTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  sunriseSetTime.setUTCMinutes(sunriseSetMinutes);
  // Timezone adjustment (UTC+3)
  sunriseSetTime.setHours(sunriseSetTime.getHours()+3);
  return sunriseSetTime;
}

/**
 * Calculate Sunrise time for given longitude, latitude and date
 */
function getSunrise(latitude, longitude, date = new Date()){
  return calculate(latitude, longitude, true, date);
}

/**
 * Calculate Sunset time for given longitude, latitude and date
 */
function getSunset(latitude, longitude, date = new Date()){
  return calculate(latitude, longitude, false, date);
}

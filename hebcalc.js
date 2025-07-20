/*
    This code was converted to Java Script from my VB.Net program
    to convert Hebrew dates to and from Gregorian dates. I avoided
    using many optimization in order to make the logic clearer.

    These functions assume that all the current rules of the
    Hebrew calendar were always in existence (which is not true
    since the Hebrew calendar was not always fixed) and all the
    current rules of the Gregorian calendar were always in existence
    (which is not true).

    Here is a very brief description of the Hebrew calendar.

    The Hebrew calendar is a lunisolar calendar.  This means that
    the months are in sync with the moon and the years stay in sync
    with the sun.  A solar year is approximately 365.25 days.  A
    lunar month is approximately 29.5 days.  Twelve lunar months is
    approximately 354 days (12 * 29.5=354).  Thus, a lunar year of
    twelve months is 11.25 days shorter than the solar year. To make
    up for this shortfall, the Hebrew calendar adds a thirteenth
    month to seven years over a nineteen year period. Therefore, over
    a nineteen year period, the Hebrew calendar is approximately the
    same length as a nineteen year solar calendar.

    In order to understand this code, you must know the following
    terms:
      Molad - new moon. Hebrew months start around the day of the
              new moon
      Chalakim - 1 / 1080 of an hour or 3 1/3 seconds
      Tishrei - the first month of the Hebrew year (at least for
                these calculations)
      Rosh Hashanah - The Jewish new year which starts on Tishrei 1.

    The Hebrew calendar assumes the period of time between one new
    moon to the next is 29 days, 12 hours and 793 chalakim. The first
    molad after creation occurred on Monday, September, 7th -3760 at 5
    hours and 204 chalakim.  Technically, the Gregorian date would be
    in the year 3761 BCE because there was no year 0 in the Gregorian
    calendar, but we will use the year of -3760.

    Sample Usage:
       // Converts AdarB/7/5765 to 4/6/2005
       alert(hebToGreg(5765, 7, 26))

  */

// This function returns how many months there has been from the
// first Molad until the beginning of the year nYearH
function monSinceFirstMolad(nYearH) {
  var nMonSinceFirstMolad

  // A shortcut to this function can simply be the following formula
  return Math.floor(((235 * nYearH) - 234) / 19)

  // This formula is found in Remy Landau's website and he
  // attributes it to Wolfgang Alexander Shochen. I will use a less
  // optimized function which I believe shows the underlying logic better.

  // count how many months there has been in all years up to last
  // year. The months of this year hasn't happened yet.
  // In the 19 year cycle, there will always be 235 months. That
  // would be 19 years times 12 months plus 7 extra month for the
  // leap years. (19 * 12) + 7 = 235.

  // Get how many 19 year cycles there has been and multiply it by 235

  // Get the remaining years after the last complete 19 year cycle

  // Add 12 months for each of those years

  // Add the extra months to account for the leap years
}

// This function returns if a given year is a leap year.
function isLeapYear(nYearH) {
  var nYearInCycle

  // Find out which year we are within the cycle.
  // The 19th year of the cycle will return 0

  yearIndex = [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false, false, true, false];

  nYearInCycle = nYearH % 19
  return yearIndex[nYearInCycle];
}

// This function figures out the Gregorian Date that corresponds to
// the first day of Tishrei, the first month of the Hebrew
// calendar, for a given Hebrew year.
function tishrei1(nYearH) {
  var nMonthsSinceFirstMolad
  var nChalakim
  var nHours
  var nDays
  var nDayOfWeek
  var dTishrei1

  // We want to calculate how many days, hours and chalakim it has
  // been from the time of 0 days, 0 hours and 0 chalakim to the
  // molad at the beginning of year nYearH.

  // The period between one new moon to the next is 29 days, 12
  // hours and 793 chalakim. We must multiply that by the amount
  // of months that transpired since the first molad. Then we add
  // the time of the first molad (Monday, 5 hours and 204 chalakim)
  nMonthsSinceFirstMolad = monSinceFirstMolad(nYearH)
  nChalakim = 793 * nMonthsSinceFirstMolad + 204
  // carry the excess Chalakim over to the hours
  nHours = Math.floor(nChalakim / 1080)
  nChalakim = nChalakim % 1080

  nHours += nMonthsSinceFirstMolad * 12
  nHours += 5

  // carry the excess hours over to the days
  nDays = Math.floor(nHours / 24)
  nHours = nHours % 24

  nDays += 29 * nMonthsSinceFirstMolad
  nDays += 2

  // figure out which day of the week the molad occurs.
  // Sunday = 1, Monday = 2 ..., Shabbos = 0
  nDayOfWeek = nDays % 7

  // In a perfect world, Rosh Hashanah would be on the day of the
  // molad. The Hebrew calendar makes four exceptions where we
  // push off Rosh Hashanah one or two days. This is done to
  // prevent three situation. Without explaining why, the three
  // situations are:
  //   1) We don't want Rosh Hashanah to come out on Sunday,
  //      Wednesday or Friday
  //   2) We don't want Rosh Hashanah to be on the day of the
  //      molad if the molad occurs after the beginning of 18th
  //      hour.
  //   3) We want to limit years to specific lengths.  For non-leap
  //      years, we limit it to either 353, 354 or 355 days.  For
  //      leap years, we limit it to either 383, 384 or 385 days.
  //      If setting Rosh Hashanah to the day of the molad will
  //      cause this year, or the previous year to fall outside
  //      these lengths, we push off Rosh Hashanah to get the year
  //      back to a valid length.
  // This code handles these exceptions.
  if (!isLeapYear(nYearH) &&
    nDayOfWeek == 3 &&
    (nHours * 1080) + nChalakim >= 9924) {
    // This prevents the year from being 356 days. We have to push
    // Rosh Hashanah off two days because if we pushed it off only
    // one day, Rosh Hashanah would comes out on a Wednesday. Check
    // the Hebrew year 5745 for an example.
    nDayOfWeek = 5
    nDays += 2
  }
  else if ( isLeapYear(nYearH - 1) &&
    nDayOfWeek == 2 &&
    (nHours * 1080) + nChalakim >= 16789 ) {
    // This prevents the previous year from being 382 days. Check
    // the Hebrew Year 5766 for an example. If Rosh Hashanah was not
    // pushed off a day then 5765 would be 382 days
    nDayOfWeek = 3
    nDays += 1
  }
  else {
    // see rule 2 above. Check the Hebrew year 5765 for an example
    if (nHours >= 18) {
      nDayOfWeek += 1
      nDayOfWeek = nDayOfWeek % 7
      nDays += 1
    }
    // see rule 1 above. Check the Hebrew year 5765 for an example
    if (nDayOfWeek == 1 ||
      nDayOfWeek == 4 ||
      nDayOfWeek == 6) {
      nDayOfWeek += 1
      nDayOfWeek = nDayOfWeek % 7
      nDays += 1
    }
  }

  // Here we want to add nDays to creation
  //    dTishrie1 = creation + nDays
  // Unfortunately, Many languages do not handle negative years very
  // well. I therefore picked a Random date (1/1/1900) and figured out
  // how many days it is after the creation (2067025). Then I
  // subtracted 2067025 from nDays.
  nDays -= 2067025
  dTishrei1 = new Date(1900, 0, 1) // 2067025 days after creation
  dTishrei1.setDate(dTishrei1.getDate() + nDays)

  return dTishrei1
}


// This function gets the length of a Hebrew year.
function lengthOfYear(nYearH) {
  var dThisTishrei1
  var dNextTishrei1
  var diff

  // subtract the date of this year from the date of next year
  dThisTishrei1 = tishrei1(nYearH)
  dNextTishrei1 = tishrei1(nYearH + 1)
  // Java's dates are stored in milliseconds. To convert it into days
  // we have to divide it by 1000 * 60 * 60 * 24 = 86,400,000
  diff = (dNextTishrei1 - dThisTishrei1) / (86400000)
  return Math.round(diff)
}

// This function converts a Hebrew date into the Gregorian date
// nYearH - is the Hebrew year
// nMonth - Tishrei=1
//          Cheshvan=2
//          Kislev=3
//          Teves=4
//          Shevat=5
//          Adar A=6 (only valid on leap years)
//          Adar=7   (Adar B for leap years)
//          Nisan=8
//          Iyar=9
//          Sivan=10
//          Tamuz=11
//          Av=12
//          Elul=13
function hebToGreg(nYearH, nMonthH, nDateH) {
  var nLengthOfYear
  var bLeap
  var dGreg
  var nMonth
  var nMonthLen
  var bHaser
  var bShalem

  bLeap = isLeapYear(nYearH)
  nLengthOfYear = lengthOfYear(nYearH)

  // The regular length of a non-leap year is 354 days.
  // The regular length of a leap year is 384 days.
  // On regular years, the length of the months are as follows
  //   Tishrei (1)   30
  //   Cheshvan(2)   29
  //   Kislev  (3)   30
  //   Teves   (4)   29
  //   Shevat  (5)   30
  //   Adar A  (6)   30     (only valid on leap years)
  //   Adar    (7)   29     (Adar B for leap years)
  //   Nisan   (8)   30
  //   Iyar    (9)   29
  //   Sivan   (10)  30
  //   Tamuz   (11)  29
  //   Av      (12)  30
  //   Elul    (13)  29
  // If the year is shorter by one less day, it is called a haser
  // year. Kislev on a haser year has 29 days. If the year is longer
  // by one day, it is called a shalem year. Cheshvan on a shalem
  // year is 30 days.

  bHaser = (nLengthOfYear == 353 || nLengthOfYear == 383)
  bShalem = (nLengthOfYear == 355 || nLengthOfYear == 385)

  // get the date for Tishrei 1
  dGreg = tishrei1(nYearH)

  dMonth = {
    1: 30,
    2: 29, // Cheshvan, see note above
    3: 30, // Kislev, see note above
    4: 29,
    5: 30,
    6: 0, // Adar A (6) will be skipped on non-leap years
    7: 29,
    8: 30,
    9: 29,
    10: 30,
    11: 29,
    12: 30,
    13: 29
  }
  if (bLeap) dMonth[6] = 30;
  if (bShalem) dMonth[2] = 30;
  if (bHaser) dMonth[3] = 29;
  // Now count up days within the year
  for (nMonth = 1; nMonth <= nMonthH - 1; nMonth ++) {
    nMonthLen= dMonth[nMonth];
    dGreg.setDate(dGreg.getDate() + nMonthLen)
  }
  dGreg.setDate(dGreg.getDate() + nDateH - 1)
  return dGreg
}

// This function converts a Gregorian date into the Hebrew date.  The
// function returns the hebrew month as a string in the format M/D/Y.
function gregToHeb(dGreg) {
  var nYearH
  var nMonthH
  var nDateH
  var nOneMolad
  var nAvrgYear
  var nDateH
  var dTishrei1
  var nLengthOfYear
  var bLeap
  var bHaser
  var bShalem
  var nMonthLen
  var bWhile
  var d1900 = new Date(1900, 0, 1)

  // The basic algorithm to get Hebrew date for the Gregorian date dGreg.
  // 1) Find out how many days dGreg is after creation.
  // 2) Based on those days, estimate the Hebrew year
  // 3) Now that we a good estimate of the Hebrew year, use brute force to
  //    find the Gregorian date for Tishrei 1 prior to or equal to dGreg
  // 4) Add to Tishrei 1 the amount of days dGreg is after Tishrei 1

  // Figure out how many days are in a month.
  // 29 days + 12 hours + 793 chalakim
  nOneMolad = 29.5 + (793 / 25920)
  // Figure out the average length of a year. The hebrew year has exactly
  // 235 months over 19 years.
  nAvrgYear = nOneMolad * (235 / 19)
  // Get how many days dGreg is after creation. See note as to why I
  // use 1/1/1900 and add 2067025
  nDateH = Math.round((dGreg - d1900) / (86400000))
  nDateH += 2067025 // 2067025 days after creation
  // Guess the Hebrew year. This should be a pretty accurate guess.
  nYearH = Math.floor(nDateH / nAvrgYear) + 1
  // Use brute force to find the exact year nYearH. It is the Tishrei 1 in
  // the year <= dGreg.
  dTishrei1 = tishrei1(nYearH)

  if (sameDate(dTishrei1, dGreg)) {
    // If we got lucky and landed on the exact date, we can stop here
    nMonthH = 1
    nDateH = 1
  }
  else  {
    // Here is the brute force.  Either count up or count down nYearH
    // until Tishrei 1 is <= dGreg.
    if (dTishrei1 < dGreg) {
      // If Tishrei 1, nYearH is less than dGreg, count nYearH up.
      while (tishrei1(nYearH + 1) <= dGreg) {
        nYearH += 1
      }
    }
    else {
      // If Tishrei 1, nYearH is greater than dGreg, count nYearH down.
      nYearH -= 1
      while (tishrei1(nYearH) > dGreg) {
        nYearH -= 1
      }
    }

    // Subtract Tishrei 1, nYearH from dGreg. That should leave us with
    // how many days we have to add to Tishrei 1
    nDateH = (dGreg - tishrei1(nYearH)) / (86400000)
    nDateH = Math.round(nDateH)
    // Find out what type of year it is so that we know the length of the
    // months
    nLengthOfYear = lengthOfYear(nYearH)
    bHaser = nLengthOfYear == 353 || nLengthOfYear == 383
    bShalem = nLengthOfYear == 355 || nLengthOfYear == 385
    bLeap = isLeapYear(nYearH)

    // Add nDateH to Tishrei 1.
    nMonthH = 1
    monthN = {
      1: 30,
      2: 29, // Cheshvan, see note above
      3: 30, // Kislev, see note above
      4: 29,
      5: 30,
      6: 30, // Adar A (6) will be skipped on non-leap years
      7: 29,
      8: 30,
      9: 29,
      10: 30,
      11: 29,
      12: 30,
      13: 29
    }
    if(bShalem) monthN[2] = 30;
    if(bHaser) monthN[3] = 29;
    do {
      nMonthLen = monthN[nMonthH];

      if (nDateH >= nMonthLen) {
        bWhile = true
        if (bLeap || nMonthH != 5) {
          nMonthH ++
        }
        else {
          // We can skip Adar A (6) if its not a leap year
          nMonthH += 2
        }
        nDateH -= nMonthLen
      }
      else {
        bWhile = false
      }
    } while (bWhile)
    //Add the remaining days to Date
    nDateH = nDateH
  }
  return [nMonthH , nDateH , nYearH]
}

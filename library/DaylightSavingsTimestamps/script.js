// in US DST starts at 2:00 am 2nd Sunday in March
// 2am eastern is 7 am UTC
// Start with 7th which is day before earliest start
// and add enough days to get to Sunday
function getStartOfDST(year) {
  const date = new Date(Date.UTC(year, 2, 7, 7, 0));
  date.setDate(7 + (7 - date.getDay()));
  return date;
}

function getEndOfDST(year) {
  const date = new Date(Date.UTC(year, 9, 31, 6, 0));
  date.setDate(31 + (7 - date.getDay()));
  return date;
}

function isInDST(someDate) {
  const year = someDate.getFullYear();

  const eDST = getEndOfDST(year);
  const sDST = getStartOfDST(year);

  return someDate > sDST && someDate < eDST;
}

function getOffset(someDate) {
  // 4 and 5 are appropriate values to use for Eastern Standard / Eastern Daylight Time
  // Adjust these return statements to appropriate values for your timezone.
  if (isInDST(someDate)) {
    return 4;
  } else {
    return 5;
  }
}

function adjustedTZDate() {
  // ////////////////////////////////////////////////////////////////////////////////////////
  // / Purpose: adjust the javascript UTC date to Eastern TimeZone date                   ///
  // /                                                                                    ///
  // / To invoke:                                                                         ///
  // /           var adjTZDate = new Date();                                              ///
  // /           adjTZDate = adjustedTZDate();                                            ///
  // /                                                                                    ///
  // / Returns: a date object with adjusted to Eastern timezone                           ///
  // /                                                                                    ///
  // / Dependencies: the above 4 functions                                                ///
  // /                                                                                    ///
  // ////////////////////////////////////////////////////////////////////////////////////////

  let myOffSet = 0; // init offset value to zero
  const someDate = new Date(); // instantiate the date object

  // / Get the UTC time offset: -4 if Eastern Daylight Savings, -5 if Standard

  myOffSet = getOffset(someDate);

  // / recalculate the time by subtracting the offset

  someDate.setHours(someDate.getHours() - myOffSet);
  return someDate;
}

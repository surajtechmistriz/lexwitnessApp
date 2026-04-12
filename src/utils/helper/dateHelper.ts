

export const formatMonthYear = (monthName?: string, year?: number | string) => {
  if (!monthName || !year) return '';

  const monthMap: Record<string, string> = {
    January: 'Jan',
    February: 'Feb',
    March: 'Mar',
    April: 'Apr',
    May: 'May',
    June: 'Jun',
    July: 'Jul',
    August: 'Aug',
    September: 'Sep',
    October: 'Oct',
    November: 'Nov',
    December: 'Dec',
  };

  const shortMonth = monthMap[monthName] || monthName.slice(0, 3);

  return `${shortMonth} ${year}`;
};



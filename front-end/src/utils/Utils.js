export const formatDateTime = date => {
    let dataFormat = new Date(date);
    let hours = dataFormat.getHours();
    let minutes = dataFormat.getMinutes();

    if (hours < 10) {
        hours = "0"+hours;
    }
    if (minutes < 10) {
        minutes = "0"+minutes;
    }

    return `${dataFormat.getDate()}.${dataFormat.getMonth()+1}.${dataFormat.getFullYear()} ${hours}:${minutes}`;
};

export const formatDate = date => {
    let dataFormat = date;
    if (typeof date === "string") {
        dataFormat = new Date(date);
    }
    return `${dataFormat.getDate()}.${dataFormat.getMonth()+1}.${dataFormat.getFullYear()}`;
};

export const getDatesBetweenDates = (startDate, endDate) => {
    let dates = []
    const theDate = new Date(startDate)
    while (theDate < endDate) {
      dates = [...dates, new Date(theDate)]
      theDate.setDate(theDate.getDate() + 1)
    }
    dates = [...dates, endDate]
    return dates
};
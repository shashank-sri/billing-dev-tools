const getQueryParams = (params) => {
    let res = [];
    Object.keys(params).forEach(p => {
        res.push(`${p}=${params[p]}`);
    })
    return `?${res.join('&')}`;
}

const getElapsedTime = (date) => {
    date = new Date(date);
    let today = new Date();
    let elapsedSecs = Math.ceil((today.getTime() - date.getTime()) / 1000);
    let result, unit;
    if (elapsedSecs < 60) {
        result = elapsedSecs;
        unit = "Second";
    } else if (elapsedSecs >= 60 && (elapsedSecs / 60) < 60) {
        result = Math.floor(elapsedSecs / 60);
        unit = "Minute";
    } else if ((elapsedSecs / 60) >= 60 && (elapsedSecs / 60 / 60) < 24) {
        result = Math.floor(elapsedSecs / 60 / 60);
        unit = "Hour";
    } else if ((elapsedSecs / 60 / 60) >= 24 && (elapsedSecs / 60 / 60 / 24) < 30) {
        result = Math.floor(elapsedSecs / 60 / 60 / 24);
        unit = "Day";
    }
    else if ((elapsedSecs / 60 / 60 / 24) >= 30 && (elapsedSecs / 60 / 60 / 24) < (+today.getFullYear() % 4 === 0 ? 366 : 365)) {
        if (today.getFullYear() === date.getFullYear()) {
            result = today.getMonth() - date.getMonth();
        }
        else {
            result = today.getMonth() + 12 - date.getMonth();
        }
        result = result === 0 ? 12 : result;
        unit = 'Month';
    }
    else {
        result = today.getFullYear() - date.getFullYear();
        unit = 'Year';
    }
    return result + ' ' + (result > 1 ? unit+'s' : unit) + ' ago';
};

export default {
    getQueryParams,
    getElapsedTime,
}
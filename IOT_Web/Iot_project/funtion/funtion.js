
export function getTime() {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = String(currentTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentTime.getDate()).padStart(2, '0');
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');

    const formattedTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedTime;
}

export function turnOn(idSensor) {
    let nameLight = "";
    let numEff = "";
    if (idSensor === 0) {
        nameLight = ".light1"
        numEff = ".eff1";
    } else {
        nameLight = ".light2"
        numEff = ".eff2";
    }
    const light = document.querySelector(nameLight);
    light.style.color = "#f9ca24";
    openEffect(numEff, true)
}

export function turnOff(idSensor) {
    let nameLight = "";
    let numEff = "";
    if (idSensor === 0) {
        nameLight = ".light1"
        numEff = ".eff1";
    } else {
        nameLight = ".light2"
        numEff = ".eff2";
    }
    const light = document.querySelector(nameLight);
    light.style.color = "#bdc3c7";
    openEffect(numEff, false);
}

export function openDashBoard(on) {
    const bar = document.querySelector(".dashboard-container");
    if (on) {
        bar.classList.toggle("show")
    }
    else {
        bar.classList.remove("show")
    }
}

export function openEffect(name, on) {
    const bar = document.querySelector(name);
    if (on) {
        bar.classList.toggle("rotate")
    }
    else {
        bar.classList.remove("rotate")
    }
}


export function setOptionData(labels, optionData, respone) {
    labels.push(respone['time'])
    if (optionData.lenght !== 0 && optionData.lenght < 3) {
        optionData[0].push(respone['temperature'])
        optionData[0].push(respone['humidity'])
    } else if (optionData.lenght === 3) {
        optionData[0].push(respone['temperature'])
        optionData[0].push(respone['humidity'])
        optionData[0].push(respone['light'])
    }
}

export function setRangeColorTemperature(temperature) {
    const temp = document.querySelector(".temperature");
    if (temp === null) return;
    let color = '', color2 = ''
    if (temperature <= 10) {
        color = '#22a6b3';
        color2 = '#6be0ed';
    } else if (temperature > 10 && temperature <= 22) {
        color = '#1cd2e7';
        color2 = '#26de81';
        color = '#20bf6b';
        color2 = '#7bed9f';
    } else if (temperature > 30 && temperature <= 35) {
        color = '#fa8231';
        color2 = '#fc5c65';
    } else {
        color = '#ff6348';
        color2 = '#eb3b5a';
    }
    console.log(color + " " + color2 + " temperature: " + temperature)
    temp.style.background = `linear-gradient(135deg, ${color}, ${color2})`;
}

export function setRangeColorHumidity(temperature) {
    const temp = document.querySelector(".humidity");
    if (temp === null) return;
    let color = '', color2 = ''
    if (temperature <= 30) {
        color = '#ff6348';
        color2 = '#eb3b5a';
    } else if (temperature > 31 && temperature <= 40) {
        color = '#fa983a';
        color2 = '#ff4757';
    } else if (temperature > 40 && temperature <= 70) {
        color = '#20bf6b';
        color2 = '#26de81';
    }
    else {

        color = '#14b8f9';
        color2 = '#06a7e6';
    }
    temp.style.background = `linear-gradient(135deg, ${color}, ${color2})`;
}

export function setRangeColorLight(temperature) {
    const temp = document.querySelector('.light');
    if (temp === null) return;
    let color = '', color2 = ''
    if (temperature <= 100) {
        color = '#a5b1c2';
        color2 = '#778ca3';
    } else if (temperature > 100 && temperature <= 600) {
        color = '#20bf6b';
        color2 = '#26de81';
    } else if (temperature > 600 && temperature <= 1000) {
        color = '#f7b731';
        color2 = '#fa8231';
    } else if (temperature > 1000 && temperature <= 5000) {
        color = '#fa8231';
        color2 = '#eb3b5a';
    } else if (temperature > 5000 && temperature <= 10000) {
        color = '#eb3b5a';
        color2 = '#fc5c65';
    }
    else {
        color = '#eb3b5a';
        color2 = '#ff7f50';
    }
    temp.style.background = `linear-gradient(135deg, ${color}, ${color2})`;
}

export const formatTime = () => {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};
export const setTime = (time) => {
    const date = new Date(time); // Đối tượng ngày giờ hiện tại
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;

}

export const darkMode = (isOn) => {
    const dashboad = document.querySelector('.dashboard-container');
    const main = document.querySelector('.home-container');
    const txtDashboard = document.querySelectorAll('.option-dashboard');
    const myname = document.querySelector('.my-name');
    const title_data_histoory = document.querySelector('.title-name-data');
    if (isOn) {
        txtDashboard.forEach(element => {
            element.style.color = 'white';
            // element.style.border = '1px solid white';

        });
        dashboad.style.background = 'rgba(0, 0, 0, 0.2)';
        main.style.background = 'rgba(0, 0, 0, 0.2)';
        if (myname !== null) myname.style.color = 'white';
        if (title_data_histoory !== null) title_data_histoory.style.color = 'white';
    } else {
        txtDashboard.forEach(element => {
            element.style.color = 'black';
        });
        dashboad.style.background = 'rgb(245, 245, 245)';
        main.style.background = 'rgb(245, 245, 245)';
        if (myname !== null) myname.style.color = '#3498db';
        if (title_data_histoory !== null) title_data_histoory.style.color = '#3498db';
    }

}
export function activePage(page) {
    const button = document.querySelectorAll('.btn-page');
    if (button !== null) {
        button.forEach((element) => {
            element.style.background = '#37cae1';
        });
        let id = `btn-${page}`;
        console.log(id)
        const instanceBtn = document.getElementById(id);
        if (instanceBtn !== null) {
            instanceBtn.style.background = '#c992df';
        }

    }
}
import Cookies from 'js-cookie';

function setCookie(name, token, expiresIn) {
    Cookies.set(name, token, {expires: expiresIn, path: '/'});
}

function getCookie(name) {
    return Cookies.get(name);
}

function deleteCookie(name) {
    Cookies.remove(name, {path: '/'});
}

function isTimePassed() {

    const storedTime = getCookie("expireDate") ?? null;

    const currentTime = new Date();

    const [storedHours, storedMinutes, storedSeconds] = storedTime.split(':').map(Number);

    const storedDate = new Date(currentTime);
    storedDate.setHours(storedHours, storedMinutes, storedSeconds, 0);

    return storedDate <= currentTime;

}

export {
    setCookie,
    getCookie,
    deleteCookie,
    isTimePassed
};
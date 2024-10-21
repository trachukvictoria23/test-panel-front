import dayjs from "dayjs";

export function setFileName(name) {
    const doteIndex = name.lastIndexOf('.')
    if (doteIndex < 10) return name;
    const extension = "." + name.split(".")[name.split(".").length - 1];
    return name.slice(0, 3) + '...' + name.slice(doteIndex - 3, doteIndex) + extension;
}

export function setDate(date) {
    let currentDate = new Date();
    let messageDate = new Date(date);
    if (
        currentDate.getDate() === messageDate.getDate() &&
        currentDate.getMonth() === messageDate.getMonth() &&
        currentDate.getFullYear() === messageDate.getFullYear()
    ) {
        return dayjs(date).format("HH:mm");
    } else if (currentDate.getFullYear() === messageDate.getFullYear()) {
        return dayjs(date).format("DD.MM HH:mm");
    }
    return dayjs(date).format("DD.MM.YYYY HH:mm");
}

export function setFileSize(size) {
    if (size < 1000) return size + " Б";
    if (size < 1000000) return (size / 1000).toFixed(1) + " КБ";
    return (size / 1000 / 1000).toFixed(1) + " МБ";
}

export function setMessageText(text) {
    // return text.replaceAll("\n", " <br /> ")
    let newMessageText = text.replaceAll("\n", " <br /> ");
    const expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const links = [...newMessageText.matchAll(expression)];
    if (links.length) {
      links.forEach((link) => {
        newMessageText = newMessageText.replace(
          link[0],
          `<a href="${link[0]}" target="_blank">${link[0]}</a>`
        );
      });
    }
    return newMessageText
}
export function setUserCredentials(object) {
    localStorage.setItem("picMeUser", JSON.stringify(object));
}

export function getUserCredentials() {
    const storedObject = localStorage.getItem("picMeUser");
    return storedObject ? JSON.parse(storedObject) : null;
}

export function removeUserCredentials() {
    localStorage.removeItem("picMeUser");
}


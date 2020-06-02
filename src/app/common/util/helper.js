export const createNewEvent = (user, photoURL, event) => {
    return {
        ...event,
        hostUid: user.uid,
        hostedBy: user.displayName,
        hostPhotoURL: photoURL || '/assets/user.png',
        created: new Date(),
        attendees: {
            // object bracket notation
            [user.uid]: {
                going: true,
                joinDate: new Date(),
                photoURL: photoURL || '/assets/user.png',
                displayName: user.displayName,
                host: true
            }
        }
    }
}

// Returns an array of key/values of the enumerable properties of an object
// @param o — Object that contains the properties and methods. 
// This can be an object that you created or an existing Document Object Model (DOM) object.

export const objectToArray = (object) => {
    if(object) {
        return Object.entries(object).map(e => Object.assign({}, e[1], {id: e[0]}));
    }
}
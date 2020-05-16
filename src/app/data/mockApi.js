import sampleData from "./data"

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const fetchSampleDate = () => {
    return delay(1000).then(() => {
        return Promise.resolve(sampleData);
    });
}
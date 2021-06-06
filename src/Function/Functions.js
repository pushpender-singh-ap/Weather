import { action, makeAutoObservable } from "mobx"
import { create } from 'apisauce'
import { APPID, location_key } from "../Api/Config"

const api = create({
    baseURL: 'https://api.openweathermap.org/data/2.5',
    headers: { Accept: 'application/vnd.github.v3+json' },
})
const location = create({
    baseURL: 'https://us1.locationiq.com/v1',
    headers: { Accept: 'application/vnd.github.v3+json' },
})

class Data {
    error = false;
    response = [];
    loading = true;
    city = "";

    constructor() {
        makeAutoObservable(this)
        action(this.fatch)
    }
    fatch = async (lat, lon) => {
        await api
            .get(`/forecast?lat=${lat}&lon=${lon}&APPID=${APPID}`)
            .then(
                async (response) => {
                    if (response.ok) {
                        this.response = await response.data.list
                        this.loading = false

                    } else {
                        this.loading = false
                        this.error = true
                    }

                }
            )
    }

    fetchLocation = async (lat, lon) => {
        await location
            .get(`/reverse.php?key=${location_key}&lat=${lat}&lon=${lon}&format=json`)
            .then(
                async (response) => {
                    if (response.ok) {
                        this.city = await response.data.address.city
                        this.loading = false

                    } else {
                        this.loading = false
                        this.error = true
                        console.log(response.data);
                    }

                }
            )
    }
}

export default Data

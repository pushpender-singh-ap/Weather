import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    FlatList
} from "react-native";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { inject, observer } from "mobx-react";
import Geolocation from '@react-native-community/geolocation';

import { Loading } from "./Loading";
import Error from "./Error";
import moment from "moment";

@inject("store")
@observer
class Main extends Component {

    async componentDidMount() {
        this.requestLocationPermission()
    }
    requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            this.getOneTimeLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //To Check, If Permission is granted
                    this.getOneTimeLocation();
                } else {
                    alert("Oops!! seems like you denie the permissions")

                    this.props.store.error = true
                    this.props.store.loading = false
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }

    getOneTimeLocation = async () => {
        console.log('here');
        Geolocation.getCurrentPosition(
            async (position) => {
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);
                console.log({ currentLatitude, currentLongitude, position });
                await this.props.store.fetchLocation(currentLatitude, currentLongitude)
                await this.props.store.fatch(currentLatitude, currentLongitude)
            },
            (error) => {
                this.props.store.error = true
                this.props.store.loading = false
                console.log(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 1000
            },
        );
    }
    reload = async () => {
        console.log('here');
        this.requestLocationPermission()
    }

    renderItem = ({ item, index }) => {
        return (
            <View key={index} style={{
                width: "100%",
                flex: 1,
            }}>
                <View style={{ flex: 1, width: "100%" }}>
                    <View style={styles.line} />
                    <View style={styles.internalView}>
                        <Text style={styles.textstyle}>{`${moment(item.dt_txt).format("dddd")} (${moment(item.dt_txt).format("hh:mm a")})`}</Text>
                        <Text style={styles.textstyle}>{(item.main.temp - 273.15).toFixed(2)}°C</Text>
                    </View>
                    <View style={styles.line} />
                </View>
            </View>
        )
    }
    render() {
        const { response, error, loading, city } = this.props.store
        console.log({ response, error });
        if (loading) {
            return <Loading />
        } else if (error) {
            return <Error reload={this.reload.bind(this)} />
        } else {
            return (
                <View style={styles.container}>
                    {response.length !== 0 &&
                        <View style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Text style={{ fontSize: hp('10%') }}>{(response[0].main.temp - 273.15).toFixed(2)}°C</Text>
                            <Text style={{ fontSize: hp('3.5%') }}>{city}({moment(response[0].dt_txt).startOf('hour').fromNow()})</Text>
                        </View>}

                    <FlatList
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        data={response}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            );
        }

    }
}
export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    line: {
        height: hp('0.2%'),
        backgroundColor: "#222"
    },
    internalView: {
        justifyContent: "space-between",
        paddingHorizontal: hp('2%'),
        paddingRight: hp('5%'),
        flexDirection: "row",
        alignItems: "center"
    },
    textstyle: {
        fontSize: hp('3%')
    }
});
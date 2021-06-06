import { inject } from "mobx-react";
import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

@inject("store")
class Error extends Component {
    reload = async () => {
        this.props.store.error = false;
        this.props.store.loading = true
        this.props.reload()

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    paddingHorizontal: hp('4%')
                }}>
                    <Text style={{ fontSize: hp('7%') }}>Something</Text>
                    <Text style={{ fontSize: hp('7%') }}>Went Wrong</Text>
                    <Text style={{ fontSize: hp('7%') }}>at our End</Text>
                    <View style={{ marginVertical: hp('5%') }} />
                    <TouchableOpacity style={{ alignSelf: "center", borderColor: "#222", borderWidth: hp('0.2%') }} onPress={() => this.reload()}>
                        <Text style={{ paddingVertical: hp('1.5%'), paddingHorizontal: hp('4%') }}>RETRY</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
export default Error;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
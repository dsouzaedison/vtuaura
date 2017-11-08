import React, {Component} from 'react';
import * as actionCreators from '../actionCreators';
import {
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from "react-navigation";
import DeviceInfo from "react-native-device-info";

export class Splash extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.loadLocalData()
            .then(res => {
                this.props.setToken(this.props.localAppData.token);

                if (this.props.localAppData.token) {
                    this.loadAppData();
                } else {
                    this.getToken();
                }
            })

    }

    getToken = () => {
        let authData = {
            uniqueID: DeviceInfo.getUniqueID(),
            manufacturer: DeviceInfo.getManufacturer(),
            brand: DeviceInfo.getBrand(),
            model: DeviceInfo.getModel(),
            deviceId: DeviceInfo.getDeviceId(),
            systemName: DeviceInfo.getSystemName(),
            bundleId: DeviceInfo.getBundleId(),
            deviceName: DeviceInfo.getDeviceName(),
            userAgent: DeviceInfo.getUserAgent(),
            phoneNumber: DeviceInfo.getPhoneNumber(),
            serialNumber: DeviceInfo.getSerialNumber(),
            ipAddress: '',
            macAddress: ''
        };

        // let ipPromise = DeviceInfo.getIPAddress();
        // let macPromise = DeviceInfo.getMACAddress();
        let ipPromise = DeviceInfo.getIPAddress().then(data => {
            authData.ipAddress = data;
        });

        let macPromise = DeviceInfo.getMACAddress().then(data => {
            authData.macAddress = data;
        });

        Promise.all([ipPromise, macPromise])
            .then(data => {
                return fetch(this.props.baseUrl, {
                    method: 'POST',
                    headers: {
                        'Cache-Control': 'no-cache'
                    },
                    body: JSON.stringify(authData)
                })
                    .then(response => response.json())
                    .then((response) => {
                        console.log('Phone ID Firebase: ' + response);
                        this.props.setToken(response);
                        this.storeLocalData(response);
                        this.loadAppData();
                    })
            })
    }

    async loadLocalData() {
        // AsyncStorage.clear();
        // let localAppData = {
        //     favorites: [
        //         {
        //             title: 'My Favorite 1',
        //             customTitle: '',
        //             fileType: 'pdf',
        //             url: 'https://www.ets.org/Media/Tests/GRE/pdf/gre_research_validity_data.pdf'
        //         },
        //         {
        //             title: 'My Favorite 1',
        //             customTitle: '',
        //             fileType: 'pdf',
        //             url: 'https://www.ets.org/Media/Tests/GRE/pdf/gre_research_validity_data.pdf'
        //         },
        //         {
        //             title: 'My Favorite 3',
        //             customTitle: '',
        //             fileType: 'weblink',
        //             url: 'https://www.google.co.in'
        //         }
        //     ]
        // };

        let localAppData = {
            token: null,
            favorites: []
        };

        try {
            await AsyncStorage.getItem('localAppData', (err, data) => {
                if (err) {
                    console.log('Error loading Data');
                    throw err;
                } else {
                    if (data !== null) {
                        console.log('Data Found \n' + data);
                        this.props.loadLocalAppData(JSON.parse(data));
                    } else {
                        console.log('No Data Found');
                        AsyncStorage.setItem('localAppData', JSON.stringify(localAppData), (err) => {
                            if (err)
                                console.log('Error Saving Data! \n' + err);
                            else console.log('Save Success');
                        })
                    }
                }
            });
        } catch (error) {
            // Error saving data
        }
    };

    async storeLocalData(token) {
        let updatedLocalData = this.props.localAppData;
        updatedLocalData.token = token;

        await AsyncStorage.setItem('localAppData', JSON.stringify(updatedLocalData), (err) => {
            if (err)
                console.log('Error Saving Data! \n' + err);
            else console.log('Save Success');
        })
    }

    loadAppData = () => {
        let retry = false;

        return fetch(this.props.baseUrl + 'old?token=' + this.props.token)
            .then(response => {
                if (response.status === 401) {
                    retry = true;
                    this.getToken();
                }
                else return response.json();
            })
            .then((responseJson) => {
                console.log('Firebase Response : ' + responseJson);

                this.props.saveAppData(responseJson);

                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'Home'}),
                    ]
                });

                this.props.navigation.dispatch(resetAction);
                // this.props.navigation.navigate('Home');
            })
            .catch((error) => {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'ErrorPage'}),
                    ]
                });

                // console.log(error.message);
                if (!retry)
                    this.props.navigation.dispatch(resetAction);
            });
    }

    render() {
        return (
            <Image source={require('../assets/splash.jpg')} style={styles.container}>
                <StatusBar
                    backgroundColor="#000"
                    barStyle="light-content"
                />
                <View style={styles.overlay}>
                    <ActivityIndicator color="#fff" size={30}/>
                    <Text style={styles.text}>Fetching Data...</Text>
                </View>
            </Image>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    overlay: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    loaderIcon: {
        color: '#fff',
        fontSize: 30
    },
    text: {
        color: '#fff',
        fontSize: 25,
        paddingHorizontal: 10
    }
});

function mapStateToProps(state) {
    return {
        baseUrl: state.baseUrl,
        localAppData: state.localAppData,
        token: state.token
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveAppData: (appData) => {
            dispatch(actionCreators.saveAppData(appData));
        },
        loadLocalAppData: (localData) => {
            dispatch(actionCreators.loadLocalAppData(localData));
        },
        setToken: (token) => {
            dispatch(actionCreators.setToken(token));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
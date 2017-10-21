import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DrawerLayoutAndroid,
    TouchableOpacity,
    ScrollView,
    StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as actionCreators from '../actionCreators';
import {connect} from 'react-redux';
import {NavigationActions} from "react-navigation";

export class Navbar extends Component {
    constructor() {
        super();
        this.navigateToFavorites = this.navigateToFavorites.bind(this);
    }

    navigateToFavorites = () => {
        const resetAction = NavigationActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({routeName: 'Home'}),
                NavigationActions.navigate({routeName: 'Favorites'})
            ]
        });

        this.props.changeContentType('Favorites');
        this.props.home_nav.dispatch(resetAction);
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#393939"
                    barStyle="light-content"
                />
                <View style={styles.iconWrapperLeft}>
                    <TouchableOpacity onPress={() => this.props.openDrawer()}>
                        <Icon name="bars" style={styles.barsIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{this.props.contentType}</Text>
                </View>
                <TouchableOpacity style={styles.iconWrapperRight} onPress={() => {
                    this.navigateToFavorites();
                }}>
                    <Icon name="heart" style={styles.bellIcon}/>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#393939',
        height: 60,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        elevation: 3
        // resizeMode: 'cover',
    },
    naviconWrapper: {
        flexDirection: 'row',
    },
    iconWrapperLeft: {
        flex: 2,
        // justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconWrapperRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    barsIcon: {
        color: '#fff',
        fontSize: 30,
    },
    bellIcon: {
        color: '#fff',
        fontSize: 30,
    },
    title: {
        color: '#fff',
        fontSize: 30,
        marginLeft: 10
    }
});

function mapStateToProps(state) {
    return {
        contentType: state.contentType,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeTab: (tabName) => {
            dispatch(actionCreators.changeTab(tabName));
        },
        changeContentType: (contentType) => {
            dispatch(actionCreators.changeContentType(contentType));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Navbar)

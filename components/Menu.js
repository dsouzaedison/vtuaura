import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DrawerLayoutAndroid,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Menu extends Component {
    getActiveTab(thisTab, activeTab) {
        if(thisTab === activeTab) {
            return styles.itemActive;
        }
    }

    render() {
        return(
            <View style={styles.drawerContainer}>
                <Image source={require('../assets/loginbg.jpg')} style={styles.drawerBackgroundImage}>
                    <Image source={require('../assets/graduate.jpg')} style={styles.drawerTitleImg}>
                        <View style={styles.drawerTitleImgOverlay}>
                            <Image source={require('../assets/avatar/6.jpeg')} style={styles.avatar}/>
                        </View>
                    </Image>
                    <View style={styles.drawerOverlay}>
                        <ScrollView>
                            <TouchableOpacity style={[styles.menuItemWrapper, this.getActiveTab(0, this.props.activeTab)]} onPress={() => this.props.home_nav.navigate('Home')}>
                                <Text style={styles.menuItem}>Home</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="home" style={styles.navIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuItemWrapper, this.getActiveTab(1, this.props.activeTab)]} onPress={() => this.props.home_nav.navigate('Syllabus')}>
                                <Text style={styles.menuItem}>Syllabus</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="star" style={styles.navIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuItemWrapper, this.getActiveTab(2, this.props.activeTab)]} onPress={() => this.props.home_nav.navigate('Notes')}>
                                <Text style={styles.menuItem}>Notes</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="book" style={styles.navIcon}/>
                                </View>
                            </TouchableOpacity>
                            <View style={[styles.menuItemWrapper]}>
                                <Text style={styles.menuItem}>Question Papers</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="question-circle" style={styles.navIcon}/>
                                </View>
                            </View>
                            <View style={[styles.menuItemWrapper]}>
                                <Text style={styles.menuItem}>Technology News</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="newspaper-o" style={styles.navIcon}/>
                                </View>
                            </View>
                            <View style={[styles.menuItemWrapper]}>
                                <Text style={styles.menuItem}>Events</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="calendar" style={styles.navIcon}/>
                                </View>
                            </View>
                            <View style={[styles.menuItemWrapper]}>
                                <Text style={styles.menuItem}>Help</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="info-circle" style={styles.navIcon}/>
                                </View>
                            </View>
                            <View style={[styles.menuItemWrapper]}>
                                <Text style={styles.menuItem}>Contact Us</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="commenting" style={styles.navIcon}/>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </Image>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#555'
    },
    drawerBackgroundImage: {
        flex: 1,
        flexDirection: 'column',
        height: null,
        width: null,
        resizeMode: 'cover'
    },
    drawerTitleImg: {
        flex: 0.3,
        flexDirection: 'row',
        width: null,
        resizeMode: 'cover'
    },
    drawerOverlay: {
        flex: 0.7,
        flexDirection: 'column',
        backgroundColor: 'rgba(255,255,255,0.3)'
    },
    drawerTitleImgOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: 10
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 40,
        borderColor: '#fff',
        borderWidth: 3
    },
    menuItemWrapper: {
        // flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.4)',
        // height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#cbcbcb'
    },
    menuItem: {
        // flex: 1,
        color: '#4e4e4e',
        fontSize: 20
    },
    itemActive: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        flexDirection: 'row'
    },
    navIconWrapper: {
        flex: 0.4,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    headerBackgroundImage: {
        // flex: 0.3,
        flexDirection: 'column',
        height: 150,
        width: null,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerImageWrapper: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderColor: '#fff',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerImage: {
        height: 40,
        width: 40
    },
    navIcon: {
        fontSize: 24,
        color: '#555'
    }
});
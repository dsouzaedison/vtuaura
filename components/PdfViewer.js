import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
    View,
    Text,
    Alert,
    BackHandler
} from 'react-native';
import Pdf from 'react-native-pdf';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Loader from "./Loader";
import Analytics from 'appcenter-analytics';
import * as actionCreators from "../actionCreators";
import api from '../apis';

let timer;

export class PdfViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 1,
            hideControls: false,
            showLoader: false
        };
        this.pdf = null;
    }

    componentDidMount() {
        Analytics.trackEvent('PDF Viewer', {url: this.props.fileUrl});
        BackHandler.addEventListener('hardwareBackPress', this.nativeBackHandler);
        let _this = this;
        timer = setInterval(function () {
            _this.setState({
                hideControls: true
            });
        }, 12000);
        this.props.changeContentType('PDF');
    }

    componentWillUnmount() {
        clearInterval(timer);
        BackHandler.removeEventListener('hardwareBackPress', this.nativeBackHandler);
    }

    nativeBackHandler = () => {
        if (this.props.contentType === 'PDF') {
            this.props.changeContentType(this.props.navigation.state.params.prevRoute);
            this.props.navigation.goBack();
        }
        return true;
    }

    getOpacity = () => {
        if (this.state.hideControls) {
            return styles.lowOpacity;
        }
    };

    toggleOpacity = (flag) => {
        if (flag) {
            //Show Controls
            this.setState({
                hideControls: false
            });
        } else {
            this.setState({
                hideControls: !this.state.hideControls
            });
        }
    };

    prevPage = () => {
        if (this.pdf) {
            let prePage = this.state.page > 1 ? this.state.page - 1 : 1;
            this.pdf.setNativeProps({page: prePage});
            this.setState({page: prePage});
            console.log(`prePage: ${prePage}`);
        }
    };

    nextPage = () => {
        if (this.pdf) {
            let nextPage = this.state.page + 1 > this.state.pageCount ? this.state.pageCount : this.state.page + 1;
            this.pdf.setNativeProps({page: nextPage});
            this.setState({page: nextPage});
            console.log(`nextPage: ${nextPage}`);
        }

    };

    handleError = () => {
       api.testConnectivity()
            .then(data => {
                let suffix = '', requestScreen;
                if (this.props.navigation.state.params && this.props.navigation.state.params.requestScreen) {
                    requestScreen = this.props.navigation.state.params.requestScreen;
                }
                if (requestScreen && requestScreen === 'Favorites') {
                    suffix = 'Please consider removing this item from favorites.';
                }

                Analytics.trackEvent('Broken PDF Link', {url: this.props.fileUrl});
                this.setState({showLoader: false});
                Alert.alert(
                    'This link appears to be broken',
                    'Possibly, this file might be relocated. ' + suffix,
                    [
                        {
                            text: 'Okay', onPress: () => {
                                this.props.changeContentType(this.props.navigation.state.params.prevRoute);
                                this.props.navigation.goBack();
                            }, style: 'cancel'
                        }
                    ],
                    {cancelable: true}
                );
            })
            .catch(err => {
                this.setState({showLoader: false});
                this.props.navigation.navigate('ErrorPage');
            });
    };

    render() {
        let source = {uri: this.props.fileUrl, cache: true};
        // console.log('PDF Url: ' + this.props.fileUrl);

        return (
            <View style={styles.container}>
                {
                    this.state.showLoader &&
                    <Loader text="Please Wait..."/>
                }
                <Pdf ref={(pdf) => {
                    this.pdf = pdf;
                }}
                     source={source}
                     page={1}
                     horizontal={false}
                     onLoadComplete={(pageCount) => {
                         // console.log(`total page count: ${pageCount}`);
                         this.setState({pageCount: pageCount});
                     }}
                     onPageChanged={(page, pageCount) => {
                         // console.log(`current page: ${page}`);
                         this.setState({
                             hideControls: false
                         });
                         this.setState({page: page});
                     }}
                     onError={(error) => {
                         this.setState({showLoader: true});
                         this.handleError();
                         console.log(error);
                     }}
                     style={styles.pdf}/>

                <View style={[styles.controlsBar, this.getOpacity()]}>
                    <TouchableHighlight style={styles.arrowWrapper} onPress={() => {
                        this.toggleOpacity(true);
                        if (this.state.page > 1) {
                            this.prevPage();
                        }
                    }}>
                        <MaterialIcon name="arrow-upward" color="#fff" size={20}/>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => {
                        this.toggleOpacity(true);
                        this.pdf.setNativeProps({page: 1});
                        this.setState({page: 1})
                    }
                    }>
                        <MaterialIcon name="vertical-align-top" color="#fff" size={20}/>
                    </TouchableHighlight>
                    <TouchableOpacity onPress={() => this.toggleOpacity(false)}>
                        <Text style={styles.pageCount}> <MaterialCommunityIcon name="library-books" color="#fff"
                                                                               size={16}/> {this.state.page} / {this.state.pageCount}
                        </Text>
                    </TouchableOpacity>
                    <TouchableHighlight onPress={() => {
                        this.toggleOpacity(true);
                        this.pdf.setNativeProps({page: this.state.pageCount});
                        this.setState({page: this.state.pageCount})
                    }
                    }>
                        <MaterialIcon name="vertical-align-bottom" color="#fff" size={20}/>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.arrowWrapper} onPress={() => {
                        this.toggleOpacity(true);
                        if (this.state.page < this.state.pageCount) {
                            this.nextPage();
                        }
                    }}>
                        <MaterialIcon name="arrow-downward" color="#fff" size={20}/>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    controlsBar: {
        height: 50,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    arrowWrapper: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 5,
        borderRadius: 4
    },
    pageCount: {
        color: '#fff'
    },
    lowOpacity: {
        opacity: 0.15
    }
});

function mapStateToProps(state) {
    return {
        fileUrl: state.fileUrl,
        contentType: state.contentType,
        mediaBaseUrl: state.mediaBaseUrl,
        endpoints: state.endpoints
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeContentType: (text) => {
            dispatch(actionCreators.changeContentType(text));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PdfViewer)

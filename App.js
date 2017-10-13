/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {
   AppRegistry,
   StyleSheet,
   Text,
   View,
   TextInput,
   ListView,
   Image,
   Button,
   TouchableHighlight,
   Dimensions
 } from 'react-native';
 import Config from './constants';
 import axios from 'axios';
 import VideoList from './components/DisplayVideoList'

 export default class YoutubeAudioConverter extends Component {
   state = {
     searchQuery: '',
     isLoaded: false,
     queryResult: ''
   };

   fetchVideos = (searchQuery) => {
     const vm = this;
     //console.log(`${Config.SEARCH_API_URL}${searchQuery}`);
     axios.get(`${Config.SEARCH_API_URL}${searchQuery}`)
     .then(function (response) {
       vm.setState({
           queryResult: response.data.items,
           isLoaded: true
       });
       return response.data;
     })
     .catch(function (error) {
       console.log(error);
     });
   }


   render() {
     return (
       <View style={styles.homeContainer}>
       <View style={styles.searchContainer} >
           <View style={styles.searchInputContainer}>
             <TextInput
               //underlineColorAndroid='transparent'
               placeholder="Search YouTube"
               value={this.state.searchQuery}
               onChangeText={(searchQuery) => this.setState({searchQuery})}
               />
             </View>
             <View style={styles.searchButtonContainer} >
               <TouchableHighlight
                 style= {styles.searchButton}
                 underlayColor = {'#8E8E8E'}
                 onPress= {() => this.fetchVideos(this.state.searchQuery)}>
                 <Image
                 source={require('./assets/search_icon.png')}
                 />
               </TouchableHighlight>
             </View>
        </View>
        <View>
        {this.state.isLoaded ? <VideoList queryResult = {this.state.queryResult} /> : null}
        </View>
        </View>
    );
   }
 }

 const styles = StyleSheet.create({
   homeContainer: {
     flex: 1,
     alignItems: 'center',
     paddingBottom: 100,
     paddingTop: 20,
     backgroundColor: 'white'
   },
   searchButton: {
     borderColor: 'black',
     backgroundColor: 'white',
     borderWidth: StyleSheet.hairlineWidth,
     paddingHorizontal: 20,
     paddingVertical: 10,
     borderRadius: 5,
   },
   searchContainer: {
     flexDirection: 'row',
     //borderBottomWidth: 0.5,
   },
   searchInputContainer: {
       width: Dimensions.get('window').width-90,
       //marginLeft: 10,
       marginRight: 10,
       height: 60
   },
   searchButtonContainer: {
     width: 60,
     height: 60
   },
 });

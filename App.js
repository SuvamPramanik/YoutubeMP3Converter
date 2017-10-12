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
   TouchableHighlight
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
       console.log(response.data.items);
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
                 underlayColor = {'white'}
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
   searchContainer: {
     flexDirection: 'row',
     //borderBottomWidth: 0.5,
   },
   searchInputContainer: {
       width: 300,
       height: 60
   },
   searchButtonContainer: {
     width: 60,
     height: 60
   },
 });

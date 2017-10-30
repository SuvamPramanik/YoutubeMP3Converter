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
   Dimensions,
   ActivityIndicator
 } from 'react-native';
 import Config from './constants';
 import axios from 'axios';
 import VideoList from './components/DisplayVideoList';

 export default class YoutubeAudioConverter extends Component {
   state = {
     searchQuery: '',
     isLoaded: true,
     queryResult: '',
   };

   fetchVideos = (searchQuery) => {
     const vm = this;
     vm.setState({
         isLoaded: false
     });
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

   handleClearSeachTextInput = () => {
     this.setState({
       searchQuery: '',
     });
   }


   render() {
     return (
       <View style={styles.homeContainer}>
       <View style={styles.searchContainer} >
           <View style={styles.searchInputContainer}>
             <TextInput
               style={styles.searchInputBox}
               underlineColorAndroid='transparent'
               placeholder="Search YouTube"
               value={this.state.searchQuery}
               onChangeText={(searchQuery) => this.setState({searchQuery})}
               />
               {
                 this.state.searchQuery ?
                  <TouchableHighlight
                    style= {styles.clearInput}
                    underlayColor = {'#8E8E8E'}
                    onPress= {() => this.handleClearSeachTextInput()}>
                    <Image
                      source={require('./assets/clear.png')}
                    />
                  </TouchableHighlight> : null
               }
             </View>
             <View>
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
        {this.state.isLoaded ? <VideoList queryResult = {this.state.queryResult} /> : <ActivityIndicator style={{marginTop: 25}} size="large" animating={true}/>}
        </View>
        </View>
    );
   }
 }

 const styles = StyleSheet.create({
   homeContainer: {
     flex: 1,
     paddingBottom: 100,
     paddingTop: 20,
     backgroundColor: 'white'
   },
   searchButton: {
     borderColor: 'black',
     backgroundColor: 'white',
     borderWidth: StyleSheet.hairlineWidth,
     paddingTop: 10,
     paddingBottom: 10,
     paddingLeft: 10,
     paddingRight: 10,
     borderRadius: 5,
   },
   searchContainer: {
     flexDirection: 'row',
     //borderBottomWidth: 0.5,
   },
   searchInputContainer: {
       flexDirection: 'row',
       width: Dimensions.get('window').width-90,
       elevation: 3,
       borderRadius: 5,
       marginLeft: 10,
       marginRight: 10,
   },
   searchInputBox: {
     flexDirection: 'row',
     paddingLeft: 10,
     width: Dimensions.get('window').width-120,
   },
   clearInput: {
     alignSelf: 'flex-end',
     paddingBottom: 15,
   },
 });

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
  Button,
  ListView,
  Image,
  TouchableHighlight,
  ScrollView,
  Modal,
  WebView,
  Dimensions,
  Linking
} from 'react-native';
import Config from '../constants';
import axios from 'axios';

export default class VideoList extends Component {
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  vm = this;
  results = this.props.queryResult;
  state = {
    dataSource: this.ds.cloneWithRows(this.results),
    isModalVisible: false,
    videoUrl: ''
  };

  _showYoutubeVideo = (videoId) => this.setState({
    isModalVisible: true,
    videoUrl: 'https://www.youtube.com/embed/' + videoId
  })

  _hideYoutubeVideo = () => this.setState({ isModalVisible: false })

  _downloadYoutubeVideo = (videoId) => {
    axios.get(`${Config.API_URL}${videoId}`)
       .then(function (response) {
       let url = response.data.resultURL;
       console.log(url);
       Linking.canOpenURL(url).then(supported => {
       if (supported) {
         Linking.openURL(url);
       } else {
         console.log("Don't know how to open URI: " + url);
       }
     });
    })
     .catch(function (error) {
       console.log(error);
   });
  }

  render() {
    //console.log(this.results);
    if(this.results && this.results.length) {
      return (
        <View>
        <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.state.isModalVisible}
        onRequestClose={() => {console.log('Youtube Video Closed!');}}>

        <View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height/2.,}}>
        <WebView
        style={{flex:1}}
        javaScriptEnabled={true}
        source={{uri: this.state.videoUrl}}
        />
        <Button
              title="Close Video"
              color="#841584"
              onPress={this._hideYoutubeVideo} />
        </View>
        </Modal>
        <ScrollView scrollsToTop={false}>
        <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderVideo.bind(this)}
        style={styles.listView}
        initialListSize={15}
        />
        </ScrollView>
        </View>
      );
    }
    console.log("Inside empty array check");
    return (
      <Text style={styles.noVideosFoundContainer}>
      No videos found!! Try again.
      </Text>
    );
  }



  renderVideo(item) {
    return (
      <View>
      <TouchableHighlight underlayColor = {'white'}
      onPress={()=> this._showYoutubeVideo(item.id.videoId)}>
      <View style={styles.container}>
      <Image
      source={{uri: item.snippet.thumbnails.default.url}}
      style={styles.thumbnail}
      />
      <View>
      <Text style={styles.text}>{item.snippet.title}</Text>
      </View>
      </View>
      </TouchableHighlight>
      <Button title="Download"
        onPress={() => this._downloadYoutubeVideo(item.id.videoId)}/>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  thumbnail: {
    width: 80,
    height: 60,
  },
  listView: {
    paddingTop: 20,
    borderBottomWidth: 5,
  },
  noVideosFoundContainer: {                                                                                                                                                fontSize: 18,
    textAlign: 'center',
  },
});

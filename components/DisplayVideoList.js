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
import Footer from './LoadMoreFooter'

export default class VideoList extends Component {
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  vm = this;
  results = this.props.queryResult;
  state = {
    dataSource: this.ds.cloneWithRows(this.results.slice(0, 10)),
    page: 1,
    isModalVisible: false,
    videoUrl: ''
  };

  loadMore = () => {
    console.log('loading more');
    let start = this.state.page*ITEMS_PER_PAGE;
    let end = (this.state.page+1)*ITEMS_PER_PAGE;

    let newData = this.results.slice(start, end); // here, we will receive next batch of the items
    //console.log('new data', newData);
    this.setState({
      page: this.state.page + 1,
      dataSource: this.ds.cloneWithRows(this.results.slice(0, end))}); // here we are appending new batch to existing batch
    //console.log(this.state.dataSource);
  }

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
    console.log('New results', this.results);
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
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        style={styles.listView}
        onEndReachedThreshold={10}
        pageSize={10}
        initialListSize={10}
        onEndReached={this.loadMore}
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
    //console.log('results', this.results);
    //console.log(this.state.dataSource);
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
      <Text numberOfLines={1} style={styles.artist}>{item.snippet.channelTitle || "Unknown Artist"}</Text>
      <Text numberOfLines={1} style={styles.title}>{item.snippet.title || "Unknown Song"}</Text>
      <View style={styles.downloadButton}>
      <Button
        //style={styles.downloadButton}
        title="Download"
        onPress={() => this._downloadYoutubeVideo(item.id.videoId)}/>
        </View>
      </View>
      </View>
      </TouchableHighlight>
      </View>
    );
  }
}

//Videos per page
const ITEMS_PER_PAGE = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  artist: {
    flex: 1,
    marginLeft: 12,
    fontSize: 17,
    color: '#818181',
  },
  title: {
    flex: 2,
    marginLeft: 12,
    fontSize: 13,
    color: '#a7a7a7',
  },
  downloadButton: {
    flex: 3,
    marginLeft: 12,
    width: 100,
  },
  thumbnail: {
    width: 120,
    height: 90,
  },
  listView: {
    paddingTop: 20,
    borderBottomWidth: 5,
  },
  noVideosFoundContainer: {                                                                                                                                                fontSize: 18,
    textAlign: 'center',
  },
  separator: {
    height: 2,
    backgroundColor: '#8E8E8E',
  },
});

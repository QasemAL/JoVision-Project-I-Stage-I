import React, { Component } from 'react';
import {StyleSheet,View , Text , Button} from 'react-native';
import Project from './Screens/Project';


export default class App extends Component {
 

    render() {
        return (
    
      <View style = {style.containers}>

        <Project></Project>

        </View>
    
     
      );
    }
}

    
const style = StyleSheet.create({
  containers: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

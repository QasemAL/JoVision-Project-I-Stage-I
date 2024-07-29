import React, { Component } from 'react';
import {StyleSheet,View , Text , Button} from 'react-native';
import Project from './Screens/Project';
import Project2 from './Screen_Stage2/Project2';


export default class App extends Component {
 

    render() {
        return (
    
      <View style = {style.containers}>

        {/*<Project></Project>*/}
        <Project2></Project2>

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

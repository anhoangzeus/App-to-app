import React, { Component } from 'react';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity ,View , Text,StyleSheet, Dimensions,StatusBar} from 'react-native';
import { WebView } from 'react-native-webview';

const { width ,height} = Dimensions.get("screen");
export default function Route_Contents({ route, navigation }) {
    var searchContent = "";
    if (route.params != null) {
      const { content } = route.params.id;
      searchContent = route.params.id;
    }
    return (
      <Contents
        content={searchContent}
        navigation={navigation}
      />
    );
  };
export class Contents extends Component {
    constructor (props) {
        super(props);
      }
    render() {
        return (
            <View style={styles.containner}>
                <StatusBar barStyle="light-content"/>
                <View style={styles.headconteiner}>
                    <TouchableOpacity style={{ width: 60, borderRadius: 10 }} onPress={() => this.props.navigation.navigate("App")}>
                        <FontAwesome name="angle-left" size={30} color="#fff" style={{ marginLeft: width / 40 }} />
                    </TouchableOpacity>
                    <Text style={styles.texthead}>Thông tin chi tiết</Text>
                </View>
                <WebView
                    source={{
                        uri: this.props.content
                    }}
                    style={{ marginTop: 20 }}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    containner: {
      flex: 1,
      backgroundColor: "#a2459a",
    },
    texthead: {
      color: "white",
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      marginLeft: width / 20
    },
    headconteiner: {
      flexDirection: 'row',
      paddingHorizontal: 5,
      paddingTop:15
    },
    screenContainer: {
      flex: 1,
    },
  
  });
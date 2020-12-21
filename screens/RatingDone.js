import React, { Component} from 'react';
import {StyleSheet, View, Text, StatusBar,TouchableOpacity,Dimensions,FlatList,Image,Modal,TextInput} from 'react-native';
import { fbApp } from '../firebaseconfig';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NumberFormat from 'react-number-format';
import RNPoll, { IChoice } from "react-native-poll";

const { width,height } = Dimensions.get('screen');
function ReactNativeNumberFormat({ value }) {
  return (
    <NumberFormat
      value={value}
      displayType={'text'}
      thousandSeparator={true}
      renderText={formattedValue => <Text>{formattedValue} đ</Text>} 
    />
  );
};
const ProductItem = ({item}) => (
    <View style={styles.itemContainer1}>
      <Image source={{uri:item.Picture}} style={styles.itemImage} />
      <View style={{justifyContent:'center'}}>
        <Text style={styles.itemName} numberOfLines={2}>{item.Name}</Text>
        <Text style={styles.itemPrice}><ReactNativeNumberFormat value={item.Price}/></Text>
      </View>
    </View>
  );
export default class RatingDone extends Component{
    constructor(props) {
        super(props);
        this.itemRef = fbApp.database();
        this.state = { 
            ListProduct:[],
            modalVisible:false,
        }; 
    }
    setModalVisible = (visible) => {
          this.setState({ modalVisible: visible });
      };
      handleClose = () => {
        this.setState({
          modalVisible: false 
        });
      };
    componentDidMount(){
        this.getListOrder();   
    }
    getListOrder=()=>{
        this.itemRef.ref('Orders').once('value').then((snapshot) => {
            var items=[];
            snapshot.forEach((childSnapshot)=>{       
            if(childSnapshot.val().CustomerID == fbApp.auth().currentUser.uid && childSnapshot.val().Status == "4"){
                childSnapshot.child('OrderDetails').forEach((child)=>{
                    items.push({
                        id:child.val().OrderDetailID,
                        ProductId:child.val().ProductID,
                        Name:child.val().Name,
                        Picture:child.val().Picture,
                        Price:child.val().Price
                    });            
                });         
            }               
        });
       this.setState({ListProduct:items})
    });
}
    render(){
        const {modalVisible} = this.state;
        const choices: Array<IChoice> = [
          { id: 1, choice: "1 Sao", votes: 12 },
          { id: 2, choice: "2 Sao", votes: 1 },
          { id: 3, choice: "3 Sao", votes: 3 },
          { id: 4, choice: "4 Sao", votes: 5 },
          { id: 5, choice: "5 Sao", votes: 9 },
        ];
        return(
            <View style={styles.screenContainer}>
                <FlatList
                    numberOfLines={2}
                    showsVerticalScrollIndicator={false}
                    data={this.state.ListProduct}
                    renderItem={({item})=>
                    <TouchableOpacity onPress={() => {this.setModalVisible(true)}}>
                        <ProductItem item={item}/>
                    </TouchableOpacity>  
                    }
                />
              <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                  }}
               >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                       <FontAwesome name="times-circle" size={25} color="#fff"/>
                        <Text style={styles.modalText}>Đánh giá sản phẩm</Text>
                        <TouchableOpacity style={{width:width/6}} onPress={()=>{this.handleClose()}}>
                        <FontAwesome name="times-circle" size={30} color="red"/>
                        </TouchableOpacity>
                      </View>                 
                      <RNPoll
                        totalVotes={30}
                        choices={choices}
                        choiceTextStyle={{color:'gold',fontWeight:'bold', fontSize:18}}
                        fillBackgroundColor="#a2459a"
                        borderColor="#a2459a"
                        onChoicePress={(selectedChoice: IChoice) =>
                          console.log("SelectedChoice: ", selectedChoice)
                        }
                      />
                    </View>
                  </View>
             </Modal>  
            </View>
        );
    }
};
const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
    },
    screenContainer: {
        flex: 1,
      },
      itemImage: {
        width: width/5,
        height: height/8,
        resizeMode:'contain',
        alignSelf:'center'
      },
      itemName: {
        fontSize: 14,
        color: 'black',
        marginHorizontal:10,
      },
      itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginHorizontal:10
      },
      itemContainer1:{
        width: width-20,
        height:height/8,
        borderColor:'silver',
        borderWidth:1,
        marginHorizontal:10,
        marginVertical:2,
        borderRadius:5,
        flexDirection:'row'
      },
      centeredView: {
        justifyContent: "center",
        flex:1,
      },
      modalView: {
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        height:height/1.8
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        alignSelf: "center",
        fontSize:20,
        color:'#a2459a',
        fontWeight:'bold'
      },
})
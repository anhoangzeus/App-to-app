import React, { Component} from 'react';
import {StyleSheet, View, Text, StatusBar,TouchableOpacity,Dimensions,FlatList,Image,Modal,TextInput} from 'react-native';
import { fbApp } from '../firebaseconfig';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NumberFormat from 'react-number-format';

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
export default class Rating extends Component{
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
        return(
            <View style={styles.screenContainer}>
            <StatusBar backgroundColor='#a2459a' barStyle="light-content"/>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.cartContainer} onPress={() =>{this.props.navigation.goBack()}}>
                    <FontAwesome name="angle-left" size={30} color="#fff" style={{marginLeft:width/40}}/>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Đánh giá sản phẩm</Text>   
                </View>
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
                      <Text style={styles.modalText}>Đánh giá sản phẩm</Text>
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
    bodyContainer: {
      flex: 1,
      backgroundColor: '#ededed',
    },
    userContainer: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 10,
      margin:10
    },
    screenContainer: {
        flex: 1,
      },
      headerContainer: {
        flexDirection: 'row',
        paddingTop: 15,
        backgroundColor: '#a2459a',
        paddingBottom: 12,

      },
      cartContainer: {
        paddingHorizontal: 20,
        width:72,
        borderRadius:15
      },
      headerText: {
        color: '#fff',
        textAlignVertical: 'center',
        fontSize:20,
        fontWeight:'bold'
      },
      titletext:{
        color:'green',
        fontSize:20,
        marginLeft: 20,
      },
      itemImage: {
        width: width/3,
        height: height/4,
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
        height:height/5,
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
        width:width
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
        height:height/3
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        textAlign: "center",
        fontSize:20,
        color:'#a2459a'
      },
})
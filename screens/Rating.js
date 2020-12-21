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
       <Text style={{color:"#000",marginHorizontal:10,textAlign:'center',fontSize:15,fontWeight:'bold'}}>Mã đơn hàng:{item.OrderID}</Text>
      <View style={{flexDirection:'row'}}>
      <Image source={{uri:item.Picture}} style={styles.itemImage} />
        <View style={{marginLeft:20}}>
          <Text style={{color:"#000",marginHorizontal:10}}>{item.CreatedDate}</Text>
          <Text style={{color:"#000",marginHorizontal:10}}>{item.Payment=="01" ? "Thanh toán khi nhận hàng": "Thanh toán trực tuyến"}</Text>
          <Text style={styles.itemName} numberOfLines={2}>{item.Name}</Text>
          <Text style={styles.itemPrice}><ReactNativeNumberFormat value={item.Price}/></Text>
        </View>
        
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
            points1:0,
            points2:0,
            points3:0,
            points4:0,
            points5:0,
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
    getRatingPoint=({ProductID})=>{
        this.itemRef.ref("Products"+ProductID+"Rating").once('value').then((snapshot)=>{
          var points1=0;
          var points2=0;
          var points3=0;
          var points4=0;
          var points5=0;
          snapshot.forEach((child)=>{
            if(child.val().Point=="1")
              points1++;
            else  if(child.val().Point=="2")
              points2++;
            else  if(child.val().Point=="3")
              points3++;
            else  if(child.val().Point=="4")
              points4++;
            else  if(child.val().Point=="5")
              points5++;
          });
          this.setState({
            points1:points1,
            points2:points2,
            points3:points3,
            points4:points4,
            points5:points5
          })
        });
    }
    getListOrder=()=>{
        this.itemRef.ref('Orders').once('value').then((snapshot) => {
            var items=[];
            snapshot.forEach((childSnapshot)=>{       
            if(childSnapshot.val().CustomerID == fbApp.auth().currentUser.uid 
            && childSnapshot.val().Status == "4"){
                childSnapshot.child('OrderDetails').forEach((child)=>{
                  if(child.val().Status== false){
                    items.push({
                        id:child.val().OrderDetailID,
                        ProductId:child.val().ProductID,
                        Name:child.val().Name,
                        Picture:child.val().Picture,
                        Price:child.val().Price,
                        CategoryID:child.val().CategoryID,
                        BrandID:child.val().BrandID,
                        OrderID:childSnapshot.val().OrderID,
                        Payment:childSnapshot.val().Payment,
                        CreatedDate:childSnapshot.val().CreatedDate,
                    });     
                  }       
                });         
            }               
        });
       this.setState({ListProduct:items})
    });
}
    render(){
        const {modalVisible,points1,points2,points3,points4,points5} = this.state;
        const total = points1+points2+points3+points4+points5;
        const choices: Array<IChoice> = [
          { id: 1, choice: "1 Sao", votes: points1 },
          { id: 2, choice: "2 Sao", votes: points2 },
          { id: 3, choice: "3 Sao", votes: points3 },
          { id: 4, choice: "4 Sao", votes: points4 },
          { id: 5, choice: "5 Sao", votes: points5 },
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
                        totalVotes={total}
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
        backgroundColor:'#fff'
      },
      itemImage: {
        width: width/5,
        height: height/8,
        resizeMode:'contain',
        alignSelf:'center',
        marginLeft:5
      },
      itemName: {
        fontSize: 14,
        color: 'black',
        marginHorizontal:10,
        marginRight:width/5
      },
      itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginHorizontal:10
      },
      itemContainer1:{
        width: width-20,
        height:height/6,
        borderColor:'silver',
        borderWidth:1,
        marginHorizontal:10,
        marginVertical:2,
        borderRadius:15,
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
        height:height/1.5
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
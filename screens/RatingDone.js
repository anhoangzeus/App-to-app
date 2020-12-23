import React, { Component} from 'react';
import {StyleSheet, View, Text, StatusBar,TouchableOpacity,Dimensions,FlatList,Image,Modal,RefreshControl,Alert} from 'react-native';
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
       <Text style={{color:"#000",marginHorizontal:10,textAlign:'center',fontSize:15}}>Mã đơn hàng:{item.OrderID}</Text>
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
export default class RatingDone extends Component{
    constructor(props) {
        super(props);
        this.itemRef = fbApp.database();
        this.state = { 
            ListProduct:[],
            modalVisible:false,
            refreshing: false,
            RatingInfor:{},
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
    _onRefresh = () => {
      this.setState({refreshing: true});
      this.getListOrder();   
    };
    getInfor=(ProductID,OrderDetailID)=>{
      this.itemRef.ref("/Products/"+ProductID+"/Rating/"+OrderDetailID).once('value').then((snapshot)=>{
        this.setState({
          RatingInfor:{
            Comment:snapshot.val().Comment,
            Date:snapshot.val().Date,
            Point:snapshot.val().Point,
          }
        })
      })
    }
    getListOrder=()=>{
        this.itemRef.ref('Orders').once('value').then((snapshot) => {
            var items=[];
            snapshot.forEach((childSnapshot)=>{       
            if(childSnapshot.val().CustomerID == fbApp.auth().currentUser.uid 
            && childSnapshot.val().Status == "4"){
              childSnapshot.child('OrderDetails').forEach((child)=>{
                if(child.val().Status== true){
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
       this.setState({ListProduct:items,refreshing:false})
    });
  }
    render(){
        const {modalVisible,RatingInfor} = this.state;
        return(
            <View style={styles.screenContainer}>
                <FlatList
                    refreshControl={
                      <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                      />
                    }
                    numberOfLines={2}
                    showsVerticalScrollIndicator={false}
                    data={this.state.ListProduct}
                    renderItem={({item})=>
                    <TouchableOpacity onPress={() => {this.setModalVisible(true),this.getInfor(item.ProductId,item.id)}}>
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
                        <Text style={styles.modalText}>Đánh giá của bạn</Text>                  
                        <TouchableOpacity style={{width:width/6}} onPress={()=>{this.handleClose()}}>
                        <FontAwesome name="times-circle" size={30} color="red"/>
                        </TouchableOpacity>
                      </View>    
                      <Text style={styles.modalText}>{RatingInfor.Point}<FontAwesome name="star" size={30} color="gold"/>   </Text>        
                    
                      <Text style={{color:"#000", fontSize:18}}>Ngày đánh giá {RatingInfor.Date}</Text>        
                      <Text style={{color:"#000", marginTop:10}}>{RatingInfor.Comment==""? "Chưa có bình luận...": RatingInfor.Comment}</Text>    
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
        marginLeft:10,
        marginRight:width/4,
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
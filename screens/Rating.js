import React, { Component} from 'react';
import {StyleSheet, View, Text, StatusBar,TouchableOpacity,Dimensions,FlatList,Image,Modal,TextInput,RefreshControl} from 'react-native';
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
            idvoted:"",
            orderid:"",
            orderdetailid:"",
            iscomment:false,
            opencmt:false,
            textCmt:"",
            refreshing: false,
            points1:0,
            points2:0,
            points3:0,
            points4:0,
            points5:0,
        };
       
    }
    GetCurrentDate =()=>{
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1; 
      var year = new Date().getFullYear();
      var gio = new Date().getHours();
      var phut = new Date().getMinutes();
      var giay = new Date().getSeconds();
        return date + '/' +month+ "/" +year + " " + gio+":"+ phut+":"+giay;
    }
    setModalVisible = (visible) => {
          this.setState({ modalVisible: visible });
      };
      handleClose = () => {
        this.getListOrder(); 
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
    getRatingPoint=(ProductID,OrderId,OrderDetailsId)=>{
        this.itemRef.ref("Products/"+ProductID).child("Rating").once('value').then((snapshot)=>{
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
          this.setState({points1:points1,points2:points2,points3:points3,points4:points4,
            points5:points5,idvoted:ProductID,orderid:OrderId,orderdetailid:OrderDetailsId,
          })
        });
    }
    votedProduct=(point)=>{
        const {idvoted,orderid,orderdetailid}= this.state;
        var date = this.GetCurrentDate();
        var uid = fbApp.auth().currentUser.uid;
        this.itemRef.ref("Products/"+idvoted).child("/Rating/"+orderdetailid).set({
          Date:date,
          Point:point,
          UserId:uid,
          Comment:"",
        });
        this.itemRef.ref("Orders/"+orderid+"/OrderDetails/"+orderdetailid).update({
          Status:true
        });
        this.setPoint(point);
        this.openComment();
    }
    setPoint=(point)=>{
      if(point==1)
        this.setState({points1:this.state.points1+1});
      else if(point==2)
        this.setState({points2:this.state.points2+1});
      else if(point==3)
        this.setState({points3:this.state.points3+1});
      else if(point==4)
        this.setState({points4:this.state.points4+1});
      else if(point==5)
        this.setState({points5:this.state.points5+1});
    }
    openComment=()=>{
      this.setState({opencmt:true});
    }
    openComment1=()=>{
      this.setState({iscomment:true,opencmt:false})
    }
    sendComment=()=>{
        const {idvoted,textCmt,orderdetailid}= this.state;
        this.itemRef.ref("Products/"+idvoted).child("/Rating/"+orderdetailid).update({
          Comment:textCmt,
        });
        this.handleClose();
    }
    handleChange=(val)=>{
      this.setState({textCmt:val});
    }
    getListOrder=()=>{
        this.itemRef.ref('Orders').once('value').then((snapshot) => {
            var items=[];
            snapshot.forEach((childSnapshot)=>{       
            if(childSnapshot.val().CustomerID == fbApp.auth().currentUser.uid 
            && childSnapshot.val().Status == "4"){
                childSnapshot.child('OrderDetails').forEach((child)=>{
                  if(child.val().Status == false){
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
        const {iscomment,opencmt,modalVisible,points1,points2,points3,points4,points5} = this.state;
        var total =points1+points2+points3+points4+points5;
        var choices: Array<IChoice> = [
          { id: 1, choice: "1 Sao", votes: points1 },
          { id: 2, choice: "2 Sao", votes: points2 },
          { id: 3, choice: "3 Sao", votes: points3 },
          { id: 4, choice: "4 Sao", votes: points4 },
          { id: 5, choice: "5 Sao", votes: points5 },
        ];
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
                    <TouchableOpacity 
                    onPress={() => {this.setModalVisible(true),
                        this.getRatingPoint(item.ProductId,item.OrderID,item.id)}}>
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
                        <Text style={styles.modalText}>{iscomment?"Để lại bình luận của bạn":"Đánh giá sản phẩm"}</Text>
                        <TouchableOpacity style={{width:width/10,marginLeft:20}} onPress={()=>{this.handleClose()}}>
                        <FontAwesome name="times-circle" size={30} color="red"/>
                        </TouchableOpacity>
                      </View>  
                      {iscomment ? null:
                      <RNPoll
                        totalVotes={total}
                        choices={choices}
                        choiceTextStyle={{color:'gold',fontWeight:'bold', fontSize:18}}
                        fillBackgroundColor="#a2459a"
                        borderColor="#a2459a"
                        onChoicePress={(selectedChoice: IChoice) =>
                          this.votedProduct(selectedChoice.id)}
                      /> }       
                      {iscomment ?
                      <View>
                        <TextInput
                          multiline={true}
                          placeholder="..."
                          placeholderTextColor="#a2459a"
                          autoCapitalize="none"
                          onChangeText={(val) => this.handleChange(val)}
                          style={{
                            borderColor:"#a2459a",
                            borderWidth:1,
                            height:height/2,
                            fontSize:18,
                            borderRadius:25,
                          }}
                          />
                          <TouchableOpacity style={styles.btncomment} onPress={()=>{this.sendComment()}}>
                          <Text style={{color:'#fff', fontSize:20,textAlign:'center',fontWeight:'bold'}}>Gửi bình luận</Text>
                      </TouchableOpacity>
                        </View>:null}
                      {opencmt?   <TouchableOpacity style={styles.btncomment} onPress={()=>this.openComment1()}>
                          <Text style={{color:'#fff', fontSize:20,textAlign:'center',fontWeight:'bold'}}>Bình Luận</Text>
                      </TouchableOpacity>:null }                                             
                      
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
      btncomment:{
        height:height/15,
        width:width/1.5,
        borderRadius:25,
        backgroundColor:"#a2459a",
        justifyContent:'center',
        marginTop:5,
        alignSelf:'center'
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
        marginRight:width/5,
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
      modalText: {
        alignSelf: "center",
        fontSize:20,
        color:'#a2459a',
        fontWeight:'bold'
      },
})
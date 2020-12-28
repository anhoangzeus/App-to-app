import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, Dimensions, FlatList, Image, Modal, TextInput, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { fbApp } from '../firebaseconfig';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import NumberFormat from 'react-number-format';
import { Rating, AirbnbRating } from 'react-native-ratings';


const { width, height } = Dimensions.get('screen');
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
const ProductItem = ({ item }) => (
  <View style={styles.itemContainer1}>
    <Text style={{ color: "#000", marginHorizontal: 10, textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>Mã đơn hàng:{item.OrderID}</Text>
    <View style={{ flexDirection: 'row' }}>
      <Image source={{ uri: item.Picture }} style={styles.itemImage} />
      <View style={{ marginLeft: 20 }}>
        <Text style={{ color: "#000", marginHorizontal: 10 }}>{item.CreatedDate}</Text>
        <Text style={{ color: "#000", marginHorizontal: 10 }}>{item.Payment == "01" ? "Thanh toán khi nhận hàng" : "Thanh toán trực tuyến"}</Text>
        <Text style={styles.itemName} numberOfLines={2}>{item.Name}</Text>
        <Text style={styles.itemPrice}><ReactNativeNumberFormat value={item.Price} /></Text>
      </View>
    </View>
  </View>
);
export default class RatingProduct extends Component {
  constructor (props) {
    super(props);
    this.itemRef = fbApp.database();
    this.state = {
      ListProduct: [],
      modalVisible: false,
      idvoted: "",
      orderid: "",
      orderdetailid: "",
      textCmt: "Chưa có bình luận...",
      refreshing: false,
      points: 3,
      loading: true,
      modalVisibleSuccess: false,
    };

  }
  GetCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var gio = new Date().getHours();
    var phut = new Date().getMinutes();
    var giay = new Date().getSeconds();
    return date + '/' + month + "/" + year + " " + gio + ":" + phut + ":" + giay;
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };
  handleClose = () => {
    this.setState({
      modalVisible: false,
    });
  };
  handleCloseSuccess= () =>{
    this.setState({
      modalVisibleSuccess: false
    });
    this.getListOrder();
  }
  setModalVisibleSuccess = (visible) => {
    this.setState({ modalVisibleSuccess: visible }, () => { setTimeout(this.handleCloseSuccess, 3000) });
  };
  componentDidMount() {
    this.getListOrder();
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getListOrder();
  };
  getRatingPoint = (ProductID, OrderId, OrderDetailsId) => {
    // this.itemRef.ref("Products/" + ProductID).child("Rating").once('value').then((snapshot) => {
    //   snapshot.forEach((child) => {
    //     if (child.val().Point == "1")
    //       points1++;
    //     else if (child.val().Point == "2")
    //       points2++;
    //     else if (child.val().Point == "3")
    //       points3++;
    //     else if (child.val().Point == "4")
    //       points4++;
    //     else if (child.val().Point == "5")
    //       points5++;
    //   });
    this.setState({idvoted: ProductID, orderid: OrderId, orderdetailid: OrderDetailsId});
  }
  votedProduct = async() => {
    const { idvoted, orderid, orderdetailid ,textCmt,points} = this.state;
    var date = this.GetCurrentDate();
    var uid = fbApp.auth().currentUser.uid;
    var username = "";
    var Avatar = "";
    await (this.itemRef.ref("Users").child(uid).once('value').then((snapshot) => {
      username = snapshot.val().FullName;
      Avatar = snapshot.val().Avatar;
    }));
    this.itemRef.ref("Products/" + idvoted).child("/Rating/" + orderdetailid).set({
      Date: date,
      Point: points,
      UserId: uid,
      Comment: textCmt,
      UserName: username,
      Avatar: Avatar,
    });
    this.itemRef.ref("Orders/" + orderid + "/OrderDetails/" + orderdetailid).update({
      Status: true
    }).then(this.handleClose());
    this.setModalVisibleSuccess(true);
  }
  handleChange = (val) => {
    this.setState({ textCmt: val });
  }
  getListOrder = () => {
    this.itemRef.ref('Orders').once('value').then((snapshot) => {
      var items = [];
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().CustomerID == fbApp.auth().currentUser.uid
          && childSnapshot.val().Status == "4") {
          childSnapshot.child('OrderDetails').forEach((child) => {
            if (child.val().Status == false) {
              items.push({
                id: child.val().OrderDetailID,
                ProductId: child.val().ProductID,
                Name: child.val().Name,
                Picture: child.val().Picture,
                Price: child.val().Price,
                CategoryID: child.val().CategoryID,
                BrandID: child.val().BrandID,
                OrderID: childSnapshot.val().OrderID,
                Payment: childSnapshot.val().Payment,
                CreatedDate: childSnapshot.val().CreatedDate,
              });
            }
          });
        }
      });
      this.setState({ ListProduct: items, refreshing: false, loading: false })
    });
  }
  ratingCompleted=(rating)=> {
    this.setState({points : rating});
  }
  render() {
    const { modalVisible,ListProduct, modalVisibleSuccess } = this.state;
    if (this.state.loading) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator size="large" color="dodgerblue" />
        </View>
      );
    }
    if (ListProduct[0] == null) {
      return (
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
          onPress={() => this.getListOrder()}>
          <Text style={{ color: '#000', marginHorizontal: 20, textAlign: 'center', fontSize: 15 }}>Bạn nhớ quay lại đánh giá sản phẩm khi hoàn thành đơn hàng nhé</Text>
          <TouchableOpacity style={styles.btnBuyNow} onPress={() => this.props.navigation.navigate("App")}>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Mua Sắm Ngay</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )
    }
    return (
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
          renderItem={({ item }) =>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true), 
                this.getRatingPoint(item.ProductId, item.OrderID, item.id)
              }}>
              <ProductItem item={item} />
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
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <FontAwesome name="times-circle" size={25} color="#fff" />
                <Text style={styles.modalText}>Đánh Giá Sản Phẩm</Text>
                <TouchableOpacity style={{ width: width / 15, marginLeft: 20 }} onPress={() => { this.handleClose() }}>
                  <FontAwesome name="times-circle" size={30} color="red" />
                </TouchableOpacity>
              </View>
              <View>
                <Rating
                  ratingCount={5}
                  imageSize={40}
                  showRating
                  onFinishRating={this.ratingCompleted}
                  style={{marginBottom: 5}}
                />
                <TextInput
                  textAlignVertical='top'
                  multiline={true}
                  placeholder="Bình luận sản phẩm..."
                  placeholderTextColor="#a2459a"
                  autoCapitalize="none"
                  onChangeText={(val) => this.handleChange(val)}
                  style={{
                    borderColor: "#a2459a",
                    borderWidth: 1,
                    height: height / 2.6,
                    fontSize: 18,
                    borderRadius: 10,
                  }}
                />
                <TouchableOpacity style={styles.btncomment} onPress={() => {this.votedProduct()}}>
                  <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>Gửi đánh giá</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleSuccess}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView1}>
              <Text style={styles.modalText}>Gửi thành công</Text>
              <Text style={styles.modalText}>Cảm ơn quý khách đã cho chúng tôi biết cảm nhận về sản phẩm! </Text>
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
    backgroundColor: '#fff'
  },
  btncomment: {
    height: height / 15,
    width: width / 1.5,
    borderRadius: 25,
    backgroundColor: "#a2459a",
    justifyContent: 'center',
    marginTop: 5,
    alignSelf: 'center'
  },
  itemImage: {
    width: width / 5,
    height: height / 8,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginLeft: 5
  },
  itemName: {
    fontSize: 14,
    color: 'black',
    marginHorizontal: 10,
    marginRight: width / 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal: 10
  },
  itemContainer1: {
    width: width - 20,
    height: height / 6,
    borderColor: 'silver',
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: height / 1.5,
    width: width / 1.2
  },
  modalText: {
    textAlign: "center",
    fontSize: 20,
    color: '#a2459a',
    fontWeight: 'bold'
  },
  btnBuyNow: {
    height: height / 14,
    width: width / 1.5,
    backgroundColor: "#a2459a",
    borderRadius: 25,
    justifyContent: 'center',
    marginTop: 10
  },
  modalView1: {
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
    height: height / 4,
    alignItems: 'center'
  },
})
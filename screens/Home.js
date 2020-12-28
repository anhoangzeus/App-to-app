import React, { useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  LogBox,
  StatusBar,
  RefreshControl,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import NumberFormat from 'react-number-format';
import Swiper from 'react-native-swiper';
import { fbApp } from "../firebaseconfig";
import "firebase/auth";

console.disableYellowBox = true;
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
const ProductItem = ({ image, name, price, rating, bough, PromotionPrice }) => (
  <View style={styles.itemContainer}>
    <Image source={{ uri: image }} style={styles.itemImage} />
    <Text style={styles.itemName} numberOfLines={2}>
      {name}
    </Text>
    <Text style={styles.itemPrice}><ReactNativeNumberFormat value={price} />
      {price === PromotionPrice ? null :
        <Text style={{ color: "red" }}>  -{((PromotionPrice - price) / PromotionPrice * 100).toFixed(0)}%</Text>
      }
    </Text>
    <View style={{ flexDirection: 'row' }}>
      {RatingUI(rating)}
      {bough != 0 ? <Text style={{ color: 'green', }}>({bough})</Text> : null}

    </View>
  </View>
);
const NewProductItem = ({ image, name, price, rating, bough, PromotionPrice }) => (
  <View style={styles.itemContainer1}>
    <Image source={{ uri: image }} style={styles.itemImage} />
    <Text style={styles.itemName} numberOfLines={2}>
      {name}
    </Text>
    <Text style={styles.itemPrice}><ReactNativeNumberFormat value={price} />
      {price === PromotionPrice ? null :
        <Text style={{ color: "red" }}>  -{((PromotionPrice - price) / PromotionPrice * 100).toFixed(0)}%</Text>
      }
    </Text>
    <View style={{ flexDirection: 'row' }}>
      {RatingUI(rating)}
      {bough != 0 ? <Text style={{ color: 'green', }}>({bough})</Text> : null}
    </View>
  </View>
);
const RatingUI = (rating) => {
  var point = parseInt(rating);
  switch (point) {
    case 1: return (
      <View style={{ flexDirection: "row" }}>
        <FontAwesome name="star" size={17} color="#ffd700" style={styles.reviewimg} />
        <FontAwesome name="star" size={17} color={null} style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color={null} style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color={null} style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color={null} style={{ marginLeft: 5 }} />
      </View>
    );
    case 2: return (
      <View style={{ flexDirection: "row" }}>
        <FontAwesome name="star" size={17} color="#ffd700" style={styles.reviewimg} />
        <FontAwesome name="star" size={17} color="#ffd700" style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color={null} style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color={null} style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color={null} style={{ marginLeft: 5 }} />
      </View>
    );
    case 3: return (
      <View style={{ flexDirection: "row" }}>
        <FontAwesome name="star" size={17} color="#ffd700" style={styles.reviewimg} />
        <FontAwesome name="star" size={17} color="#ffd700" style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color="#ffd700" style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color={null} style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color={null} style={{ marginLeft: 5 }} />
      </View>
    );
    case 4: return (
      <View style={{ flexDirection: "row" }}>
        <FontAwesome name="star" size={17} color="#ffd700" style={styles.reviewimg} />
        <FontAwesome name="star" size={17} color="#ffd700" style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color="#ffd700" style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color="#ffd700" style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color={null} style={{ marginLeft: 5 }} />
      </View>
    );
    case 5: return (
      <View style={{ flexDirection: "row" }}>
        <FontAwesome name="star" size={17} color="#ffd700" style={styles.reviewimg} />
        <FontAwesome name="star" size={17} color="#ffd700" style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color="#ffd700" style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color="#ffd700" style={{ marginLeft: 5 }} />
        <FontAwesome name="star" size={17} color="#ffd700" style={{ marginLeft: 5 }} />
      </View>
    );
    default: return null;
  }
}

export default class Home extends React.PureComponent {
  constructor (props) {
    super(props);
    this.itemRef = fbApp.database();
    this.state = {
      listpro: [],
      listphone: [],
      listtablet: [],
      listdongho: [],
      listphukien: [],
      listall: [],
      listcontents: [],
      numcart: 0,
      refreshing: false,
      loading: true
    };
    this.timer;
  };
  componentDidUpdate(nextProps, nextState) {
    if (this.state.numcart != nextState.numcart) {
      this.getnumcart();
    }
  }
  getnumcart = () => {
    if (fbApp.auth().currentUser) {
      this.itemRef.ref('Cart/' + fbApp.auth().currentUser.uid).once('value').then((snapshot) => {
        var dem = 0;
        snapshot.forEach(function (childSnapshot) {
          dem += childSnapshot.val().Quantity;
        });
        this.setState({
          numcart: dem,
        });
      });
    }
  }
  componentDidMount() {
    this.getListBanner();
    this.ListenForItems();
    this._getListPhoneNew();
    this._getListLaptopNew();
    this._getListTabletNew();
    this._getListDongHoNew();
    this._getListPhukienNew();
    this.timer = setInterval(() => {
      this.getnumcart();
    }, 1500);

  };

  _onRefresh = () => {
    this.setState({ refreshing: true, loading: true });
    this.getListBanner();
    this.ListenForItems();
    this._getListPhoneNew();
    this._getListLaptopNew();
    this._getListTabletNew();
    this._getListDongHoNew();
    this._getListPhukienNew();
    this.getnumcart();

  };
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  _getListPhoneNew = () => {
    this.itemRef.ref('/Products').once('value').then((snapshot) => {
      var itemsphone = [];
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().CategoryID == "AIzaSyDSWIekvpvwQbRiGh4WF88H91tqFzL6OWI") {
          var point = 0;
          var count = 0;
          childSnapshot.child("Rating").forEach((child) => {
            point += child.val().Point;
            count++;
          })
          itemsphone.push({
            title: childSnapshot.val().Name,
            price: childSnapshot.val().Price,
            image: childSnapshot.val().Image,
            metades: childSnapshot.val().MetaDescription,
            id: childSnapshot.val().ProductID,
            rating: point / count,
            bough: count,
            BrandID: childSnapshot.val().BrandID,
            CategoryID: childSnapshot.val().CategoryID,
            PromotionPrice: childSnapshot.val().PromotionPrice
          });
        };
      });
      this.setState({
        listphone: itemsphone,
      });
    });
  };
  _getListLaptopNew = () => {
    this.itemRef.ref('/Products').once('value').then((snapshot) => {
      var itemslap = [];
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().CategoryID == "-MJaC7kTLJOYZjt9G4zs") {
          var point = 0;
          var count = 0;
          childSnapshot.child("Rating").forEach((child) => {
            point += child.val().Point;
            count++;
          })
          itemslap.push({
            title: childSnapshot.val().Name,
            price: childSnapshot.val().Price,
            image: childSnapshot.val().Image,
            metades: childSnapshot.val().MetaDescription,
            id: childSnapshot.val().ProductID,
            rating: point / count,
            bough: count,
            BrandID: childSnapshot.val().BrandID,
            CategoryID: childSnapshot.val().CategoryID,
            PromotionPrice: childSnapshot.val().PromotionPrice
          });
        };
      });
      this.setState({
        listpro: itemslap,
      });
    });
  };
  _getListTabletNew = () => {
    this.itemRef.ref('/Products').once('value').then((snapshot) => {
      var itemstab = [];
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().CategoryID == "-MJaB1_P1gTPbxmjMXSW") {
          var point = 0;
          var count = 0;
          childSnapshot.child("Rating").forEach((child) => {
            point += child.val().Point;
            count++;
          })
          itemstab.push({
            title: childSnapshot.val().Name,
            price: childSnapshot.val().Price,
            image: childSnapshot.val().Image,
            metades: childSnapshot.val().MetaDescription,
            id: childSnapshot.val().ProductID,
            rating: point / count,
            bough: count,
            BrandID: childSnapshot.val().BrandID,
            CategoryID: childSnapshot.val().CategoryID,
            PromotionPrice: childSnapshot.val().PromotionPrice
          });
        };
      });
      this.setState({
        listtablet: itemstab,
      });
    });
  };
  _getListDongHoNew = () => {
    this.itemRef.ref('/Products').once('value').then((snapshot) => {
      var itemsdongho = [];
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().CategoryID == "-MJaCJRVtI_o9Hv5XY-N") {
          var point = 0;
          var count = 0;
          childSnapshot.child("Rating").forEach((child) => {
            point += child.val().Point;
            count++;
          })
          itemsdongho.push({
            title: childSnapshot.val().Name,
            price: childSnapshot.val().Price,
            image: childSnapshot.val().Image,
            metades: childSnapshot.val().MetaDescription,
            id: childSnapshot.val().ProductID,
            rating: point / count,
            bough: count,
            BrandID: childSnapshot.val().BrandID,
            CategoryID: childSnapshot.val().CategoryID,
            PromotionPrice: childSnapshot.val().PromotionPrice
          });
        };
      });
      this.setState({
        listdongho: itemsdongho,
      });
    });
  };
  _getListPhukienNew = () => {
    this.itemRef.ref('/Products').once('value').then((snapshot) => {
      var itemsphukien = [];
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().CategoryID == "-MJaCDw6CYGQenBvOtGO") {
          var point = 0;
          var count = 0;
          childSnapshot.child("Rating").forEach((child) => {
            point += child.val().Point;
            count++;
          })
          itemsphukien.push({
            title: childSnapshot.val().Name,
            price: childSnapshot.val().Price,
            image: childSnapshot.val().Image,
            metades: childSnapshot.val().MetaDescription,
            id: childSnapshot.val().ProductID,
            rating: point / count,
            bough: count,
            BrandID: childSnapshot.val().BrandID,
            CategoryID: childSnapshot.val().CategoryID,
            PromotionPrice: childSnapshot.val().PromotionPrice
          });
        };
      });
      this.setState({
        listphukien: itemsphukien,
      });
    });
  };
  ListenForItems = () => {
    this.itemRef.ref('/Products').once('value').then((snapshot) => {
      var items = [];
      snapshot.forEach(function (childSnapshot) {
        var point = 0;
        var count = 0;
        childSnapshot.child("Rating").forEach((child) => {
          point += child.val().Point;
          count++;
        })
        items.push({
          title: childSnapshot.val().Name,
          price: childSnapshot.val().Price,
          image: childSnapshot.val().Image,
          metades: childSnapshot.val().MetaDescription,
          id: childSnapshot.val().ProductID,
          rating: point / count,
          bough: count,
          BrandID: childSnapshot.val().BrandID,
          CategoryID: childSnapshot.val().CategoryID,
          PromotionPrice: childSnapshot.val().PromotionPrice
        });
      });
      this.setState({
        listall: items,
      });
    });
  };
  getListBanner = () => {
    this.itemRef.ref('Contents').once('value').then((snapshot) => {
      var items = [];
      snapshot.forEach((childSnapshot) => {
        items.push({
          id: childSnapshot.key,
          Detail: childSnapshot.val().Detail,
          Image: childSnapshot.val().Image,
          Name: childSnapshot.val().Name,
          Url : childSnapshot.val().Url,
        });
      });
      this.setState({
        listcontents: items,
        loading: false,
        refreshing: false
      });
    });
  };
  renderNofiCart = () => {
    if (this.state.numcart == 0) {
      return null;
    }
    else {
      return (
        <View style={{ position: "absolute", borderRadius: 25, backgroundColor: "red", alignItems: "center", marginLeft: width / 30, width: width / 20 }}>
          <Text style={{ alignSelf: 'center', fontSize: 10, margin: 1, fontWeight: 'bold', color: 'white' }} numberOfLines={1}>{this.state.numcart}</Text>
        </View>
      )
    }
  };
  render() {
    const { navigation } = this.props;
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
          <StatusBar barStyle='light-content' backgroundColor='#a2459a' />
          <Image source={require('../assets/homeloading.png')} style={{ width: width, height: height, resizeMode: 'contain' }} />
          <ActivityIndicator size='large' color="'#a2459a" style={{ position: 'absolute', alignSelf: 'center' }} />
        </View>
      )
    }
    return (
      <View style={styles.screenContainer}>
        <StatusBar backgroundColor='#a2459a' barStyle="light-content" />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Tìm kiếm")}>
            <View style={styles.inputContainer}>
              <FontAwesome name="search" size={24} color="#969696" />
              <Text style={styles.inputText}>Bạn tìm gì hôm nay?</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.cartContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
              <FontAwesome name="shopping-cart" size={24} color="#fff" />
              {this.renderNofiCart()}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <Swiper
              autoplay={true}
              autoplayTimeout={2}
              loop={true}
              showsPagination={true}
              showsButtons={true}
              index={0}
              width={width}
              height={height / 4.2}>
              {this.state.listcontents.map((item) =>
                <TouchableOpacity
                  key={item.id}
                  onPress={() => this.props.navigation.navigate("Contents", { id: item.Url })}>
                  <View style={styles.sectionContainer}>
                    <Image source={{ uri: item.Image }} style={styles.sectionImage} />
                  </View>
                </TouchableOpacity>
              )}
            </Swiper>

            <View style={styles.proHotContainer1}>
              <Text style={{ fontSize: 17, color: 'black', }}>
                <Icons name="fire" color="red" size={25} />
          Hot nhất hôm nay </Text>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Image style={styles.tophotimg1}
                  source={require('../assets/images/iphonepromax.jpg')}
                />
                <View style={{ marginLeft: 5 }}>
                  <Image style={styles.hotimgtype2} source={require('../assets/images/sale1.jpg')}
                  />
                  <Image style={styles.hotimgtype1} source={require('../assets/images/sale2.jpg')}
                  />
                </View>
                <View style={{ marginLeft: 5 }}>
                  <Image style={styles.hotimgtype2} source={require('../assets/images/sale3.jpg')}
                  />
                  <Image style={styles.hotimgtype1} source={require('../assets/images/sale4.jpg')}
                  />
                </View>
              </View>
            </View>

            <View style={styles.proHotContainer1}>
              <Text style={{ fontSize: 17, color: 'black', }}>
                <Icons name="fire" color="red" size={25} />
          Top sản phẩm bán chạy </Text>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Image style={styles.tophotimg1}
                  source={require('../assets/images/iphonepromax.jpg')}
                />
                <View style={{ marginLeft: 5 }}>
                  <Image style={styles.hotimgtype2} source={{ uri: "https://cdn.tgdd.vn/Products/Images/42/213031/TimerThumb/iphone-12-blue-600x600-thumb-hen-gio.jpg" }}
                  />
                  <Image style={styles.hotimgtype1} source={{ uri: "https://cdn.tgdd.vn/Products/Images/42/229056/oppo-a93-230520-060532-400x400.jpg" }}
                  />
                </View>
                <View style={{ marginLeft: 5 }}>
                  <Image style={styles.hotimgtype2} source={{ uri: "https://cdn.tgdd.vn/Products/Images/42/225380/iphone-12-mini-blue-600jpg-400x400.jpg" }}
                  />
                  <Image style={styles.hotimgtype1} source={{ uri: "https://cdn.tgdd.vn/Products/Images/42/217308/xiaomi-redmi-9-tim-new-600x600-400x400.jpg" }}
                  />
                </View>
              </View>
            </View>
            <View style={styles.proHotContainer}>
              <Text style={{ fontSize: 17, color: 'black', marginVertical: 10 }}>
                <Foundation name="burst-new" color="red" size={25} />
           Mẫu điện thoại mới nhất
        </Text>
              <FlatList
                horizontal={true}
                numberOfLines={2}
                showsHorizontalScrollIndicator={false}
                data={this.state.listphone}
                renderItem={({ item }) =>
                  <TouchableOpacity onPress={() => navigation.navigate('Items', { id: item.id, CategoryID: item.CategoryID, BrandID: item.BrandID })}>
                    <NewProductItem
                      name={item.title}
                      image={item.image}
                      price={item.price}
                      rating={item.rating}
                      bough={item.bough}
                      PromotionPrice={item.PromotionPrice}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            <View style={styles.proHotContainer}>
              <Text style={{ fontSize: 17, color: 'black', marginVertical: 10 }}>
                <Foundation name="burst-new" color="red" size={25} />
           Mẫu Tablet mớt nhất
        </Text>
              <FlatList
                horizontal={true}
                numberOfLines={2}
                showsHorizontalScrollIndicator={false}
                data={this.state.listtablet}
                renderItem={({ item }) =>
                  <TouchableOpacity onPress={() => navigation.navigate('Items', { id: item.id, CategoryID: item.CategoryID, BrandID: item.BrandID })}>
                    <NewProductItem
                      name={item.title}
                      image={item.image}
                      price={item.price}
                      rating={item.rating}
                      bough={item.bough}
                      PromotionPrice={item.PromotionPrice}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            <View style={styles.proHotContainer}>
              <Text style={{ fontSize: 17, color: 'black', marginVertical: 10 }}>
                <Foundation name="burst-new" color="red" size={25} />
           Mẫu Laptop mới nhất
        </Text>
              <FlatList
                horizontal={true}
                numberOfLines={2}
                showsHorizontalScrollIndicator={false}
                data={this.state.listpro}
                renderItem={({ item }) =>
                  <TouchableOpacity onPress={() => navigation.navigate('Items', { id: item.id, CategoryID: item.CategoryID, BrandID: item.BrandID })}>
                    <NewProductItem
                      name={item.title}
                      image={item.image}
                      price={item.price}
                      rating={item.rating}
                      bough={item.bough}
                      PromotionPrice={item.PromotionPrice}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            <View style={styles.proHotContainer}>
              <Text style={{ fontSize: 17, color: 'black', marginVertical: 10 }}>
                <Foundation name="burst-new" color="red" size={25} />
           Mẫu đồng hồ sang trọng mới
        </Text>
              <FlatList
                horizontal={true}
                numberOfLines={2}
                showsHorizontalScrollIndicator={false}
                data={this.state.listdongho}
                renderItem={({ item }) =>
                  <TouchableOpacity onPress={() => navigation.navigate('Items', { id: item.id, CategoryID: item.CategoryID, BrandID: item.BrandID })}>
                    <NewProductItem
                      name={item.title}
                      image={item.image}
                      price={item.price}
                      rating={item.rating}
                      bough={item.bough}
                      PromotionPrice={item.PromotionPrice}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            <View style={styles.proHotContainer}>
              <Text style={{ fontSize: 17, color: 'black', marginVertical: 10 }}>
                <Foundation name="burst-new" color="red" size={25} />
           Mẫu phụ kiện mới nhất
        </Text>
              <FlatList
                horizontal={true}
                numberOfLines={2}
                showsHorizontalScrollIndicator={false}
                data={this.state.listphukien}
                renderItem={({ item }) =>
                  <TouchableOpacity onPress={() => navigation.navigate('Items', { id: item.id, CategoryID: item.CategoryID, BrandID: item.BrandID })}>
                    <NewProductItem
                      name={item.title}
                      image={item.image}
                      price={item.price}
                      rating={item.rating}
                      bough={item.bough}
                      PromotionPrice={item.PromotionPrice}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <FlatList
                initialNumToRender={20}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                data={this.state.listall}
                renderItem={({ item }) =>
                  <TouchableOpacity onPress={() => navigation.navigate('Items', { id: item.id, CategoryID: item.CategoryID, BrandID: item.BrandID })}>
                    <ProductItem
                      name={item.title}
                      image={item.image}
                      price={item.price}
                      rating={item.rating}
                      bough={item.bough}
                      PromotionPrice={item.PromotionPrice}
                    />
                  </TouchableOpacity>
                }
              ></FlatList>
            </View>
            <View style={{ height: 10, backgroundColor: 'silver' }} />
            <View style={styles.sectionContainer}>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
};
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  proHotContainer1: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: height / 2.8
  },
  headerContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 4,
    backgroundColor: '#a2459a',
  },
  inputContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    paddingVertical: height / 50,
    paddingHorizontal: 12,
    borderRadius: 2,
    height: height / 10,
    width: width * 0.8,
  },
  inputText: {
    color: '#969696',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  cartContainer: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    width: 75,
    borderRadius: 15,
    paddingTop: 5,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    width: width / 2,
    height: height / 2.8,
    borderColor: 'silver',
    borderWidth: 1,
  },
  itemImage: {
    width: width / 2.5,
    height: height / 4,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  itemName: {
    fontSize: 14,
    color: 'black',
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal: 10
  },
  sectionContainer: {
    backgroundColor: '#a2459a',
    paddingHorizontal: 12,
    marginTop: 1,
  },
  proHotContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: height / 2.3
  },
  sectionImage: {
    width: width - 24,
    height: height / 4.5,
    borderRadius: 10,
    resizeMode: 'center',
  },
  hotimgtype1: {
    width: width / 3.5,
    height: height / 6.7,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    marginTop: 5,
    resizeMode: 'contain'
  },
  hotimgtype2: {
    width: width / 3.5,
    height: height / 6.7,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    resizeMode: 'contain'
  },
  itemContainer1: {
    width: width / 2.17,
    height: height / 2.8,
    borderColor: 'silver',
    borderWidth: 1,
    borderRadius: 25,
    marginRight: 5
  },
  reviewimg: {
    height: height / 50,
    marginLeft: width / 60
  },
  tophotimg1: {
    width: width / 3,
    height: height / 3.285,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    resizeMode: 'cover'
  }
});
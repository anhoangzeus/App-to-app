import React, { Component} from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/HeaderComponent';
import {fbApp} from "../firebaseconfig";
import "firebase/auth";
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';


const ProfileItem = ({icon, name}) => (
  <View style={styles.itemContainer}>
    <MaterialCommunityIcons name={icon} size={26} color="#1e1e1e" />
    <Text style={[styles.itemText, {marginLeft: icon ? 20 : 0}]}>{name}</Text>
    <FontAwesome name="angle-right" size={15} color="#1e1e1e" />
  </View>
);

export default class Profile extends Component {
  render(){
    return (
           <View style={styles.screenContainer}>
        <StatusBar backgroundColor='#a2459a' barStyle="light-content"/>
            <View style={styles.headerContainer}>
        <View style={styles.cartContainer}>
          <View style={styles.cartIcon} />
        </View>
        <Text style={styles.headerText}>Cá nhân</Text>
        <TouchableOpacity style={styles.cartContainer} onPress={() => this.props.navigation.navigate("Cart")}>
          <FontAwesome name="shopping-cart" size={24} color="#fff" />
          </TouchableOpacity>
      </View>
            <View style={styles.bodyContainer}>
            <View style={styles.userContainer}>
              <View style={styles.avatarContainer}>
                <MaterialIcons name="person" size={26} color="#fff" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>Chào mừng bạn đến với TiAn</Text>
                <TouchableOpacity onPress={()=> this.props.navigation.navigate("Top")}>
                <Text style={styles.authText}>Đăng nhập/Đăng ký</Text>
                </TouchableOpacity>
              </View>
              <FontAwesome name="angle-right" size={26} color="#a2459a" />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("Top")}>
            <ProfileItem icon="format-list-bulleted" name="Quản lý đơn hàng" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("Top")}>
            <ProfileItem icon="cart-outline" name="Sản phẩm đã mua" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("Top")}>
            <ProfileItem icon="eye-outline" name="Sản phẩm đã xem" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("Top")}>
            <ProfileItem icon="heart-outline" name="Sản phẩm yêu thích" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("Top")}>
            <ProfileItem icon="bookmark-outline" name="Sản phẩm mua sau" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <ProfileItem name="Ưu đãi cho chủ thẻ ngân hàng" />
            <ProfileItem name="Cài đặt" />
            <View style={styles.divider} />
            <ProfileItem icon="headphones" name="Hỗ trợ" />
          </View>
      </View>
    );
  };
}


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
    paddingHorizontal: 20,
    paddingVertical: 22,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a2459a',
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  welcomeText: {
    color: 'black',
  },
  authText: {
    color: '#a2459a',
    fontSize: 18,
    fontWeight: '500',
  },
  //
  itemContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    color: '#1e1e1e',
  },
  //
  divider: {
    height: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    backgroundColor: '#a2459a',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  cartContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width:75
  },
  cartIcon: {
    width: 24,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
});

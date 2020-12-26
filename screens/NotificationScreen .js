import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, FlatList, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fbApp } from "../firebaseconfig";
import Header from '../components/HeaderComponent';

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;
export default class NotificationScreen extends Component {
  constructor (props) {
    super(props);
    this.itemRef = fbApp.database();
    this.state = {
      listThongBao: [],
      loading: true
    };
  }
  componentDidMount() {
    this.getThongBao();
  }
  getThongBao = () => {
    this.itemRef.ref('Announces').once('value').then((snapshot) => {
      var items = [];
      snapshot.forEach((child) => {
        if (child.val().Status == true)
          items.push({
            Id: child.val().Id,
            Details: child.val().Details,
            Title: child.val().Title,
            CreatedDate: child.val().CreatedDate,
            Type: child.val().Type,
          })
      });
      this.setState({ listThongBao: items });
    })
  }
  NotificationItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTopContainer}>
        <View
          style={[
            styles.itemTypeContainer,
            {
              backgroundColor: item.Type === 1 ? '#a2459a' : '#dc3988',
            },
          ]}>
          <MaterialCommunityIcons
            name={item.Type === 1 ? 'sale' : 'backup-restore'}
            color="#fff"
            size={22}
          />
        </View>
        <View style={styles.itemTopTextContainer}>
          <Text style={styles.itemName}>{item.Title}</Text>
          <Text style={styles.itemDate}>{item.CreatedDate}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.itemDetail}>{item.Details}</Text>
      </View>
    </View>
  );
  render() {
    const { listThongBao, loading } = this.state;
    return (
      <View style={styles.screenContainer}>
        <StatusBar barStyle="light-content" />
        <Header title="Thông báo" />
        <View style={styles.bodyContainer}>
          <View>
            <TouchableOpacity style={styles.buttonActiveContainer}>
              <View style={styles.activeMark} />
              <MaterialCommunityIcons
                name="home"
                color="#949494"
                size={22}
                style={styles.activeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonInactiveContainer}>
              {/* <View style={styles.activeMark} /> */}
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                color="#949494"
                size={22}
              // style={styles.activeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonInactiveContainer}>
              <MaterialCommunityIcons
                name="backup-restore"
                color="#949494"
                size={22}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonInactiveContainer}>
              <MaterialCommunityIcons name="sale" color="#949494" size={22} />
            </TouchableOpacity>
          </View>
          {loading ?
            <View style={styles.listContainer}>
              <ActivityIndicator size='large' color="'#a2459a" style={{ position: 'absolute', alignSelf: 'center' }} />
            </View>
            :
            <View style={styles.listContainer}>
              <FlatList
                data={listThongBao}
                keyExtractor={(item) => item.Id}
                renderItem={({ item }) => <this.NotificationItem item={item} />}
              />
            </View>
          }
        </View>
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
    flexDirection: 'row',
  },
  buttonActiveContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  buttonInactiveContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  activeMark: {
    backgroundColor: '#a2459a',
    width: 4,
  },
  activeIcon: {
    padding: 12,
    marginLeft: -4,
  },
  listContainer: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#e5e5e5',
  },
  //
  itemContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomColor: '#ededed',
    borderBottomWidth: 1,
  },
  itemTopContainer: {
    flexDirection: 'row',
  },
  itemTypeContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTopTextContainer: {
    marginRight: 40,
    marginLeft: 4,
  },
  itemName: {
    color: '#000',
    fontWeight: '500',
  },
  itemDate: {
    color: '#787878',
    fontSize: 12,
    marginTop: 8,
  },
  itemDetail: {
    color: '#787878',
    // fontSize: 12,
    marginTop: 12,
  },
});

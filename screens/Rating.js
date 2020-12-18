import React, { Component} from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';
import { fbApp } from '../firebaseconfig';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NumberFormat from 'react-number-format';
import { products } from '../constants';

export default class Rating extends Component{
    constructor(props) {
        super(props);
        this.itemRef = fbApp.database();
        this.state = { 
            ListProduct:[],
        }; 
    }
    componentDidMount(){
        this.getListOrder();
    }
    getListOrder=()=>{
        this.itemRef.ref('Orders').once('value').then((snapshot) => {
            var items=[];
            snapshot.forEach((childSnapshot)=>{       
            if(childSnapshot.val().CustomerID == fbApp.auth().currentUser.uid && childSnapshot.val().Status == "4"){
                items.push({OrderID: childSnapshot.val().OrderID});
            }               
        });
        console.log(items);
        var products=[];
        items.forEach(element=>{
            this.itemRef.ref('OrderDetails').once('value').then((childDetail)=>{
                childDetail.forEach((child)=>{
                    if(child.val().OrderID==element.OrderID){
                        products.push({
                            id:child.val().OrderDetailID,
                            ProductId:child.val().ProductID,
                        });
                    }         
                });
            });
        })
        console.log(products);
       this.setState({ListProduct:products})
    });
}

    render(){
        return(
            <View>
                <Text>ssss</Text>
                <MaterialCommunityIcons name="form-select" size={50}/>
            </View>
        );
    }
};
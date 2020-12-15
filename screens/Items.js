import React from 'react';
import ProductScreen from './Product';

function Items({ route, navigation}) {
    
    var searchContent = "";
    var CategoryID ="";
    var BrandID="";
    if (route.params != null) {
        const {content} =route.params.id;
        searchContent = route.params.id;
        CategoryID =route.params.CategoryID;
        BrandID= route.params.BrandID;
    }
    return (
        <ProductScreen
            content = {searchContent}
            CategoryID ={CategoryID}
            BrandID ={BrandID}
            navigation = {navigation}
        />
    );    
};

export default Items;
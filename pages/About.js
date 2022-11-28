import { View, Text, SafeAreaView, ScrollView, Image, useWindowDimensions, Pressable, ActivityIndicator } from "react-native";
import React, {useEffect, useState} from "react";
import styles from "./styles";
import SecHeader from "../components/SecHeader";
import CustomeBtn from "../components/CustomeBtn";
import { Ionicons } from "@expo/vector-icons";
import Logout from "../components/Logout";
import {collection, query,where, onSnapshot,addDoc, updateDoc,doc, getDocs} from 'firebase/firestore';
import {auth, firestore} from './firebaseConfig/firebase';
import { async } from "@firebase/util";


export default function About({navigation,route}) {
  const {height, width} = useWindowDimensions();
  const [isPopUp, setIsPopUp] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const userId = auth.currentUser.uid;

  const {item} = route.params;
  console.log(item);

  const [initPrice,setInitPrice] = useState(item.price);
  const [totPrice,setTotPrice] = useState(initPrice);


  function handleQuantity(sign){
    if(sign==='-'){
      if(quantity != 1){
        setQuantity(prev=>prev - 1)
        setTotPrice(prev => prev - initPrice)
      }
    }else {
      setQuantity(prev=>prev + 1)
      setTotPrice(prev => prev + initPrice)
    }
  }

  function toCart(){
    
        navigation.navigate('Cart');
    
  }
  async function AddToCart(){
    setIsLoading(true);
    try{
      let docRef = doc(firestore,`cart/${item.itemId}`);
      await updateDoc(docRef,{status: 'Ready'}).then(()=>{
      setIsLoading(false);
      alert('Successfully updated')
    })

    }catch(e){
      console.log(e.message);
      setIsLoading(false);
    }
    
  }
  function prevPage(){
    navigation.goBack();
  }
  function logout(){
    navigation.navigate('Login')
}

const [cartValue,setCartValue] = useState(0);


  return (
    <SafeAreaView style={styles.container}>
      {isPopUp&&<Logout logout={logout} setIsPopUp={setIsPopUp} />}
        <View style={{marginTop: '8%'}}>
        
        <SecHeader setIsPopUp={setIsPopUp} prevPage={prevPage} />
        <ScrollView>
          <View style={styles.infoImgCont}>
            <Image source={{uri: item.imgUrl}} resizeMode="contain" style={{width: width* 0.75, height: height* 0.3}} />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
              <Text style={styles.catPara}>{item.name}</Text>
              <Pressable onPress={()=>setIsLiked(prev=>!prev)}>
                <Ionicons name={isLiked?"md-heart":"md-heart-outline"} size={20} color="black" />
              </Pressable>
              {/* "md-heart-outline" */}
            </View>
            <View style={{height: height *0.02}} />
            <Text style={{fontSize: 16}}>{item.title}</Text>
            <View style={{height: height *0.01}} />
            <Text>{item.description}
            </Text>
            <View style={{height: height *0.01}} />
            <Text style={{fontSize: 16}}>R {item.price.toFixed(2)}</Text>
            <View style={{height: height *0.04}} />

            <View style={{height: height *0.05}} />
            <Text style={styles.catPara}>Total Price: R{totPrice.toFixed(2)}</Text>
            <View style={{height: height *0.05}} />
          </View>

          {item.status==='Preparing'&&<CustomeBtn name='Done' onPress={AddToCart} />}
          {isLoading&&<ActivityIndicator size="large" color="#000000" />}
        </ScrollView>
        </View>
    </SafeAreaView>
  );
}

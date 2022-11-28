import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import styles from "../pages/styles";
import logo from '../assets/logo3.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import { auth } from "../pages/firebaseConfig/firebase";

export default function SecHeader({prevPage,setIsPopUp}) {
  
  function logout(){
    auth.signOut();
  }
  return (
    <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable onPress={prevPage}>
          <Ionicons name="md-chevron-back" style={{marginLeft: '8%'}} size={32} color="black" />
          </Pressable>
            <Image source={logo} style={styles.img} />
        </View>
        <View style={styles.icons}>
            <View style={styles.cart}>
              
            
            </View>
            <Pressable onPress={()=>{setIsPopUp(prev=>!prev);logout()}}><Ionicons name="md-ellipsis-vertical" size={32} color="black" /></Pressable>
            
        </View>
    </View>
  );
}

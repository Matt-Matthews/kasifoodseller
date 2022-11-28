import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import styles from "../pages/styles";
import logo from '../assets/logo3.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import { auth } from "../pages/firebaseConfig/firebase";

export default function Header({setIsPopUp}) {

  function logout(){
    auth.signOut();
  }
  
  return (
    <View style={styles.header}>
                <Image source={logo} style={styles.img} />
                <View style={styles.icons}>
                    
                    <Pressable onPress={()=>{setIsPopUp(prev=>!prev);logout()}}>
                      <Ionicons name="md-ellipsis-vertical" size={32} color="black" />
                    </Pressable>
                </View>
    </View>
  );
}

import { View, Text, Dimensions, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {getDocs, collection, query,where, onSnapshot} from 'firebase/firestore';
import {auth, firestore} from './firebaseConfig/firebase';
import styles from './styles';
import Header from '../components/Header';
import Logout from '../components/Logout';
import Ionicons from '@expo/vector-icons/Ionicons';
import OrderCard from '../components/OrderCard';
import Filter from '../components/Filter';

export default function Orders({navigation}) {
  
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [isPopUp, setIsPopUp] = React.useState(false);
  const [cartValue,setCartValue] = React.useState(0);
  const userId = auth.currentUser.uid;
  const [cartData,setCardData] = React.useState([]);
  const [isLoading,setIsLoading] = React.useState(true);

   
    async function getData() {
      const collectionRef = collection(firestore, 'cart');
  
      try {
        let dataQuery = query(collectionRef, where("status", "in", ["Preparing","Ready"]));
        
        onSnapshot(dataQuery, (snapshot) => {
          let data= snapshot.docs.map((doc)=>({...doc.data(),itemId:doc.id}));
          
          setCardData(data);
        })
        
        
      }catch(e){
          console.log(e.message);
          setIsLoading(false);
      }
  }
  

    React.useEffect(()=>{
        getData();
      const interval = setTimeout(() => {
        setIsLoading(false);
     }, 10000)
    return () => clearInterval(interval);
    },[])

    function toCart(item){
      navigation.navigate('About',{item:item})
    }
  
    function logout(){
      navigation.navigate('Login')
  }

  //Math.floor(Math.random() * 10);
  return (
    <SafeAreaView style={{backgroundColor: '#fff'}}>
      {isPopUp&&<Logout logout={logout} setIsPopUp={setIsPopUp} />}
      <View>
        <View style={{...styles.cover,width: width}} />
        <Header setIsPopUp={setIsPopUp} />
      </View>
      <View style={{height: height*0.88}}>
      <ScrollView style={{marginTop: height*0.03}}>
        <Filter />
        <View style={{marginBottom:height*0.03}} />
        {
          cartData.length!==0?
          cartData.map(data=>{
            return <OrderCard data={data} onPress={toCart} />;
          }):
          <Text>No data found</Text>
        }
        
      </ScrollView>
      </View>
    </SafeAreaView>
  )
}
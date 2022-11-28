import { View, Text, Dimensions, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import {getDocs, collection, query,where, onSnapshot, addDoc} from 'firebase/firestore';
import {auth, firestore, storage} from './firebaseConfig/firebase';
import Header from '../components/Header';
import FileInput from '../components/FileInput';
import styles from './styles';
import TextField from '../components/TextField';
import CustomeBtn from '../components/CustomeBtn';

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export default function Form() {
    const [isPopUp, setIsPopUp] = React.useState(false);
    const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const [name,setName] = React.useState('');
  const [description,setDescription] = React.useState('');
  const [title,setTitle] = React.useState('');
  const [price,setPrice] = React.useState(0);
  const [image,setImage] = React.useState([]);
  const [category,setCategory] = React.useState('');
  const [isLoading,setIsLoading] = React.useState(false);
  const userId = auth.currentUser.uid;

    function logout(){
        navigation.navigate('Login')
    }

    async function uploadDocs(){
        setIsLoading(true);
        if(!image) return;
        if(image.length===0){
            alert('Documents requried');
        }else{
             const collectionRef = collection(firestore, 'food');
             let dataQuery = query(collection(firestore,'resturants'),where("userId","==",userId));
        await getDocs(dataQuery).then((snapshot)=>{
            let temp = snapshot.docs.map(data=>data.data());
            image.forEach(file=>{
                const storageRef = ref(storage, `food/${file._data.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on(
                    "state_changed", null ,
                    (error) => console.log(error),
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => { 
                            console.log("File available at", downloadURL);
                            
                            await addDoc(collectionRef,
                                {imgUrl: downloadURL, 
                                userId:userId,
                                resturandId: temp[0].resturandId,
                                category: category,
                                title:title,
                                price: parseFloat(price),
                                name:name,
                                id: Math.floor(Math.random() * 1000).toString(),
                                description: description
                            }).then(()=>{
                                alert('done');
                                setIsLoading(false);
                            })
                            return downloadURL
                        });
                        }
                    );
                });
        })
           
        }
    }
  return (
    <SafeAreaView style={styles.container}>
         {isPopUp&&<Logout logout={logout} setIsPopUp={setIsPopUp} />}
      <View style={{alignItems:'center'}}>
        <Header setIsPopUp={setIsPopUp} />
      </View>
      <View style={{width: width, alignItems: 'center', marginTop:height*0.03}}>
        <FileInput placeholder='image' setValue={setImage} type="image/*" />
        <TextField setValue={setName} icon='md-restaurant' returnKeyType='next' name='email' placeholder='Food name' />
        <TextField setValue={setCategory} icon='md-restaurant' returnKeyType='next' name='email' placeholder='Food category' />
        <TextField setValue={setTitle} icon='md-restaurant' returnKeyType='next' name='email' placeholder='Foot title' />
        <TextField setValue={setDescription} icon='md-restaurant' returnKeyType='next' name='email' placeholder='Food description' />
        <TextField setValue={setPrice} icon='md-restaurant' keyboardType='number-pad' returnKeyType='done' name='email' placeholder='Price' />
        <View style={{height: height *0.05}} />
        <CustomeBtn name='Add' onPress={uploadDocs}  />
        {isLoading&&<ActivityIndicator size="large" color="#000000" />}
      </View>
    </SafeAreaView>
  )
}
import { View, Text, KeyboardAvoidingView, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import React,{useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from '../assets/logo.png';
import CustomeBtn from "../components/CustomeBtn";
import styles from './styles';
import TextField from '../components/TextField';
import FileInput from '../components/FileInput';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage, firestore } from "./firebaseConfig/firebase";
import {collection, addDoc,query,where,getDocs,doc,updateDoc, GeoPoint } from "firebase/firestore";
import * as Location from 'expo-location';

export default function Register({navigation,route}) {
    const [resturantName,setResturantName] = React.useState('');
    const [delivery, setDelivery] = useState('');
    const {height, width} = useWindowDimensions();
    const [isLoading,setIsLoading] = useState(false);
    const [files,setFiles] = useState([]);
    const [currLocation,setCurrLocation] = useState(new GeoPoint(-23.9168558,29.4576678))

    const url = 'https://firebasestorage.googleapis.com/v0/b/resturantapp-97a5e.appspot.com/o/resturants%2FPngItem_1979800.png?alt=media&token=2b804d08-4831-4ce2-9497-50f4f3d2f592';
  
    const {userId} = route.params;

    React.useEffect(() => {
        (async () => {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            alert('Permission to access location was denied!');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});
          // const address = await Location.reverseGeocodeAsync(location.coords);
          // const yourGeoPoint = new firebase.firestore.GeoPoint(someLatitude, someLongitude);
          let temp = new GeoPoint(location.coords.latitude, location.coords.longitude);
          setCurrLocation(temp);
          console.log(currLocation);
        })();
      }, []);


    async function createResturant(){
        const collectionRef = collection(firestore, 'resturants');
        try{
            await addDoc(collectionRef,{
                name: resturantName,
                banner: url,
                description: delivery,
                resturandId: resturantName+'01',
                location:currLocation,
                userId: userId
            }).then(()=>{
                navigation.navigate('Login')
                setIsLoading(false);
            })
        }catch(e){
            alert(e.message)
        }
    }


    async function uploadDocs(){
        setIsLoading(true);
        if(!files) return;
        console.log(files.length);
        if(files.length===0){
            alert('Documents requried');
        }else{
             const collectionRef = collection(firestore, 'documents');
        files.forEach(file=>{
            const storageRef = ref(storage, `myDocs/${file._data.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed", null ,
                (error) => console.log(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => { 
                        console.log("File available at", downloadURL);
                        
                        await addDoc(collectionRef,{link: downloadURL, userId:userId}).then(()=>{
                            console.log('done');
                            setIsLoading(false);
                        })
                        return downloadURL
                    });
                    }
                );
            });
            createResturant();
        }
    }

  return (
    <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{width: width, alignItems: 'center', flex: 1}}>
            <View style={styles.imgContainer}>
                <Image source={logo} resizeMode='contain' style={{width: '50%'}} />
            </View>
            <TextField setValue={setResturantName} icon='md-restaurant' returnKeyType='next' name='email' placeholder='Resturant name' />
            <TextField setValue={setDelivery} icon='md-restaurant' returnKeyType='next' name='email' placeholder='Deliver description' />
            <FileInput placeholder={'Id copy'} type="*/*" setValue={setFiles} />
            <FileInput placeholder={'Proof of resident'} type="*/*" setValue={setFiles}  />
            <View style={{marginTop: '15%'}} />
            <CustomeBtn name='Register' onPress={uploadDocs} />
            {isLoading&&<ActivityIndicator size="large" color="#000000" />}
            <View style={{marginTop: '6%'}} />

        </KeyboardAvoidingView>                                             
    </SafeAreaView>)
}
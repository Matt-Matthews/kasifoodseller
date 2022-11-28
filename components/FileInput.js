import { View, Text, Pressable } from 'react-native'
import React from 'react';
import * as DocumentPicker from 'expo-document-picker';
import styles from '../pages/styles';

export default function FileInput({setValue,placeholder, type}) {
    const [fileName,setFileName] = React.useState(placeholder)
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({type: type})
if (result != null) {
      const r = await fetch(result.uri);
      const b = await r.blob();
      setFileName(result.name)
      setValue(prev=>[...prev,b]);
    }
}
  return (
    <View style={[styles.textField, {backgroundColor: '#fff',justifyContent: 'space-between',paddingRight: 0}]}>
      <Text>{fileName}</Text>
        <Pressable onPress={pickDocument} style={{
            height:'100%',
            width: '30%',
            borderTopRightRadius: 25,
            borderBottomRightRadius: 25, 
            backgroundColor: '#000',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
            <Text style={{color: '#fff'}}>Choose file</Text>
        </Pressable>
    </View>
  )
}
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const HomeBanner = () => {
    const [formData, setFormData] = useState({
        name:'',
        email:"",
        mobile:""
    })

    const handleSubmit = ()=>{
        console.log('Form Submitted:', formData)
    }
  return (
    <View style={styles.container}>
      {/* Header Section  */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>SUBSCRIBE US</Text>
        <View style={styles.redLine}/>
      </View>

      {/* Input Fields  */}
      <TextInput
      style={styles.input}
      placeholder='Enter Your Name'
      placeholderTextColor="#999"
      onChangeText={(val)=> setFormData({ ...formData, name:val})}
      />
      <TextInput
       style={styles.input}
      placeholder="Enter Your Email Address"
      placeholderTextColor="#999"
      keyboardType='email-address'
      onChangeText={(val)=> setFormData({ ...formData, email:val})}
      />
      <TextInput
       style={styles.input}
      placeholder="Enter Your Mobile No."
      placeholderTextColor="#999"
      keyboardType='phone-pad'
      onChangeText={(val)=>({...formData, mobile:val})}
      />

      <TouchableOpacity  style={styles.submitButton}>
        <Text style={styles.submitText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeBanner

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#333333',
        padding:30,
        width:"100%",
        alignItems:'center'
    },
    headerContainer:{
        alignItems:'center',
        marginBottom:30 
    },
    headerText: {
        color:'#FFFFFF',
        fontSize:28,
        fontWeight:'800',
        letterSpacing:1,
        marginBottom:8,

    },
    redLine:{
        height:6,
        width:60,
        backgroundColor:'#C62828',

    },
    input:{
        backgroundColor:'#FFFFFF',
        width:'100%',
        height:55,
        paddingHorizontal:15,
        fontSize:16,
        marginBottom:20,
        color:'#000',
        // Slight border to match the image sharpness
    borderWidth: 1,
    borderColor: '#ccc',
    },submitButton: {
    backgroundColor: '#C62828', // Solid red button
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    // The thin white border seen in the image
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
})
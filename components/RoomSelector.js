import React, { Component } from 'react';

import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';


export default class RoomSelector extends Component {

    state = {
        room: [
           

        ]
    };

    render (){
        return (
            <ScrollView>
            <View>
                <Text>Please select a room</Text>
                {this.props.rooms.map((room, roomIndex) =>{
                                return (
                                    <TouchableOpacity  key={roomIndex}
                                        style={styles.room}
                                        
                                        activeOpacity={1}
                                        onPress={() => {this.props.onClickRoom(roomIndex)}}
                                    >
                                        
                                        <Text style={styles.roomName} >{room.name}</Text>
                                        <Text style={styles.roomPlayer} >{room.players.length} player</Text>
                                        
                                    </TouchableOpacity>
                                )
                            })}
            </View>
            </ScrollView>
        )
    }

}


const styles = StyleSheet.create({
    room:{
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.5)',
        marginBottom: 3,
        padding:5,
        backgroundColor:'#fbfbfb'
    },
    roomName:{
        fontSize:20,
        fontWeight:'bold',

    }
});
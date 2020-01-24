import React, { Component } from 'react';

import {StyleSheet, View, Text, Alert, ToastAndroid} from 'react-native';
import RoomSelector from './RoomSelector';
import GameBoard from './GameBoard';

import io from 'socket.io-client'

const x = 'x';
const o = 'o';
const _ = '';
export default class Game extends Component {

    state = {
        screen: 'roomSelector',
        io: io('http://192.168.100.13:3333', {
            forceNew: true
        }),
        rooms: [],
        data:[],
        currentRoom: -1,
        type: x,
        status: 'auto'
    };
    

    componentDidMount(){

        this.state.io.on('connect', ()=>{
           

            this.state.io.on('roomList', (rooms)=>{
                 this.setState({rooms: rooms})
            })


            this.state.io.on('joinRoomResult', (data)=>{
                if(data.result == true){
                    this.startGame(data.currentRoom , data.type, data.status);

                }
                else{
                    ToastAndroid.show('Room is full', ToastAndroid.SHORT)
                }
            })

            this.state.io.on('autoWinGame', (data)=>{
                
               ToastAndroid.show('Your opponent has left the room \n You win!', ToastAndroid.SHORT)
               setTimeout(() => {
                    this.setState({status:'none'}) 
                    this.setState({data: data})
                    this.setState({type: x})
                }, 2000)
                
            })

            this.state.io.on('updateRoomsPlayer', (rooms) => {this.setState({ rooms: rooms})})
            this.state.io.on('gameIsStart', (data) => {
               this.startGame(data.currentRoom , data.type, data.status);
            })

           this.state.io.on('gameData', (gameData)=>{
                if(gameData.endgame === true){
                    this.setState({data: gameData.data})
                    this.setState({status: 'none'})

                    
                }
                else if(gameData.endgame === false){
                    this.setState({data: gameData.data})
                    this.setState({status: 'none'})
                    ToastAndroid.show('You lose!', ToastAndroid.LONG)
                   
                }
                else{
                    if(gameData.status == 'none'){
                        this.setState({data: gameData.data})
                    }
                    else{
                        this.setState({data: gameData.data})
                        this.setState({status: gameData.status})
                        
                    }
                }
        })

            this.state.io.on('disconnect', ()=>{
                ToastAndroid.show('Lost connection', ToastAndroid.SHORT)
            })
        })
           

    }

    backToRoomSelector(){
        this.state.io.emit('playerLeaveRoom', {roomindex: this.state.currentRoom, type:this.state.type})
        this.setState({screen: 'roomSelector'})
    }

    clickCell(row, col){
        this.state.io.emit('setCell', {roomIndex:this.state.currentRoom, row: row, col: col, type:this.state.type})
        this.setState({status: 'none'})
    }

    joinRoom(roomIndex){
        this.state.io.emit('joinRoom', roomIndex)
    }

    startGame(currentRoom, type , status){
        this.setState({currentRoom: currentRoom})
        this.setState({type: type})
        this.setState({status: status})
        this.createBoardData();
        this.setState({screen: 'gameBoard'})
    }

    createBoardData() {



        let newData = [];
        for(let i = 0; i < 10; i++){
            let newRow = []
            for(let j = 0; j < 10; j++){
                newRow.push({
                    row: i,
                    column: j,
                    value: _,
                    hasType: false
                })
            }
            newData.push(newRow)
        }
        this.setState({data: newData});
    }

    renderScreens(){
        let screen = null;

        if(this.state.screen === 'roomSelector'){
            screen = <RoomSelector rooms = {this.state.rooms} key={this.state.currentRoom} onClickRoom={(roomIndex)=>{this.joinRoom(roomIndex)}}/>
        
        }
        else if(this.state.screen === 'gameBoard'){
            screen = <GameBoard data={this.state.data} roomId={this.state.currentRoom} onClickCell = {(row,col)=>{this.clickCell(row,col)}} onBackSelectRoom = {()=>{this.backToRoomSelector()}} status={this.state.status}/>
        }

        return screen;
    }

    render (){
        return (
            <View >
                <Text style={styles.header}>Caro</Text>
                {this.renderScreens()}
            </View>
        )
    }

}


const styles = StyleSheet.create({
    header:{
        fontSize:25,
        color:'white',
        backgroundColor:'black',
        marginBottom:20,
        padding: 5
    }
});

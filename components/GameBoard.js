import React, { Component } from 'react';

import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Button, Alert } from 'react-native';
import { Icon } from 'react-native-elements'


const x = 'x';
const o = 'o';
const _ = '';


export default class GameBoard extends Component {



   



    backMethod = () => {
        
                    
        Alert.alert(
            'You want to leave this room ?',
            '',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {text: 'Yes', onPress: async () => {this.props.onBackSelectRoom()}}
            ],
            {cancelable: false},
            );
   
    }

    setCellValue(row, col, value) {
        let newData = this.state.data
        newData[row][col].value = value;
        this.setState({ data: newData });
    }

    render() {
        return (
            <View style={styles.boardContainer}>
                <Button title='Back' onPress ={ this.backMethod }/>
                {this.props.data.map((rowData, rowIndex) => {
                    return (
                        <View style={styles.row} pointerEvents={this.props.status} key={rowIndex}>

                            {rowData.map((cell, columnIndex) => {
                                return ( 
                                    <TouchableOpacity 
                                        key={columnIndex}
                                        style={styles.column}
                                        disabled={cell.hasType}
                                        activeOpacity={1}
                                        onPress={() => { this.props.onClickCell(rowIndex, columnIndex) 
                                        
                                    }}>
                                        
                                        <Text style={styles.cellValue} >{cell.value}</Text>

                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    )
                })}
            </View>
        )
    }

}


const styles = StyleSheet.create({
    boardContainer: {
        width: '100%',
        aspectRatio: 1
    },


    row: {
        flex: 1,
        flexDirection: 'row',
    },
    column: {
        flex: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cellValue: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 25
    }
});
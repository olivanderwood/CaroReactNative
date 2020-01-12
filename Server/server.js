var io = require('socket.io')(3333);
console.log('aloalo')
var rooms = [];




const x = 'x';
const o = 'o';
const _ = '';

for(let roomNumber = 0; roomNumber < 10; roomNumber++){
    let newRoom = { 
        name:'Room ' +roomNumber,
        numberPlayers: 1,
        players:[],
        data: []
    }


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

    newRoom.data = newData
    rooms.push(newRoom)
}


io.on('connection', (socket) => {
  
    socket.emit('roomList', rooms)

    socket.on('joinRoom', (roomIndex)=>{
        let numberPlayers = rooms[roomIndex].players.length
        if(rooms[roomIndex].players.length==2){
            socket.emit('joinRoomResult', {result:false})
        }
        else if(numberPlayers == 0){
            rooms[roomIndex].players.push({
                socketId:socket.id,
                type: x
            })
            socket.emit('joinRoomResult', {result:true, currentRoom: roomIndex, type: x, status: 'none'})
            
            socket.broadcast.emit('updateRoomsPlayer', rooms)
        }
        else{
            rooms[roomIndex].players.push({
                socketId:socket.id ,
                type: o
            })
            socket.broadcast.emit('updateRoomsPlayer', rooms)
            let socketIdPl1 = rooms[roomIndex].players[0].socketId
            let toStrSId = socketIdPl1 + ''
            io.to(toStrSId).emit('gameIsStart', {result:true, currentRoom: roomIndex, type: x, status: 'auto'})
            // socket.broadcast.emit('gameIsStart', {result:true, currentRoom: roomIndex, type: x, status: 'auto'})
            socket.emit('joinRoomResult', {result:true, currentRoom: roomIndex, type: o, status:'none'})
        }
    })


    socket.on('playerLeaveRoom', (data)=>{

        console.log(rooms[data.roomindex].data[1][3].value)
        for(let i = 0 ; i < 10 ; i++){
            for(let j = 0 ; j < 10 ; j++){
                rooms[data.roomindex].data[i][j].value = _
            }
        }

        for (let i = 0; i < rooms[data.roomindex].players.length; i++){
            if(rooms[data.roomindex].players[i].type === data.type){
                rooms[data.roomindex].players.splice(i, 1);
                
            }
        }

        if(rooms[data.roomindex].players.length == 1){
            let socketIdPl1 = rooms[data.roomindex].players[0].socketId
            let toStrSId = socketIdPl1 + ''
            io.to(toStrSId).emit('autoWinGame', rooms[data.roomindex].data)
        }

        io.sockets.emit('updateRoomsPlayer', rooms)

    })

    socket.on('setCell', (cell)=>{
        let chessboard = rooms[cell.roomIndex].data
        let y = cell.row
        let x = cell.col


        chessboard[cell.row][cell.col].value = cell.type
        chessboard[cell.row][cell.col].hasType = true


    

    
//-------check hang ngang----//
        function isEndHorizontal(){
            let countLeft = 0 
            for(let i = x; i >= 0; i--){
                if(chessboard[y][i].value === cell.type){
                    countLeft++
                }
                else{
                    break
                }
            }
            let countRight = 0
            for(let i = x + 1; i < 10; i++){
                if(chessboard[y][i].value === cell.type){
                    countRight++
                }
                else{
                    break
                }
            }
         
            if(countRight + countLeft === 5){
                return false
            }
            return true

        }

//-------check hang doc----//
        function isEndVertical(){
            let countTop = 0 
            for(let i = y; i >= 0; i--){
                if(chessboard[i][x].value === cell.type){
                    countTop++
                }
                else{
                    break
                }
            }
            let countBottom = 0
            for(let i = y + 1; i < 10; i++){
                if(chessboard[i][x].value === cell.type){
                    countBottom++
                }
                else{
                    break
                }
            }
           
            if(countBottom  + countTop === 5){
                return false
            }
            return true
        }


//-------check duong cheo chinh----//
        function isEndPrimary(){
            let countTop = 0 
            for(let i = 0; i <= x; i++){
                if(x-i <0 || y-i<0){
                    break
                }
                if(chessboard[y-i][x-i].value === cell.type){
                    countTop++
                }
                else{
                    break
                }
            }
            console.log(countTop)
            let countBottom = 0
            for(let i = 1; i <= 10 - x; i++){
                if(x + i >= 10 || y + i >= 10){
                    break
                }
                if(chessboard[y + i][x + i].value === cell.type){
                    countBottom++
                }
                else{
                    break
                }
            }
            console.log(countBottom )
            if(countBottom  + countTop === 5){
                return false
            }
            return true

        }

//-------check duong cheo phu----//

        function isEndSub(){

            let countTop = 0 
            for(let i = 0; i <= 10 - x; i++){
                if(x + i >= 10 || y - i < 0){
                    break
                }
                if(chessboard[y - i][x + i].value === cell.type){
                    countTop++
                }
                else{
                    break
                }
            }
            
            let countBottom = 0
            for(let i = 1; i <= 10 - x; i++){
                if(x - i < 0 || y + i >= 10){
                    break
                }
                if(chessboard[y + i][x - i].value === cell.type){
                    countBottom++
                }
                else{
                    break
                }
            }
            
            if(countBottom  + countTop === 5){
                return false
            }
            return true
        }

//-------check end game----//

        function isEndGame(){
            if( isEndVertical() === false || isEndPrimary()  === false||isEndHorizontal() === false|| isEndSub() === false ){
                return false
            }
            return true
        }
        console.log(isEndGame())


        if(isEndGame()===true){
            rooms[cell.roomIndex].players.forEach(
                (player)=>{
                    
    
                    
                    if(player.type == cell.type){
                        
                        io.sockets.connected[player.socketId].emit('gameData', {status:'none', data:rooms[cell.roomIndex].data})
                    }else{
                        
                        io.sockets.connected[player.socketId].emit('gameData', {status:'auto', data:rooms[cell.roomIndex].data})
                    }
                }
            )
        }
        else{
            rooms[cell.roomIndex].players.forEach(
                (player)=>{
                    
    
                    
                    if(player.type == cell.type){
                        
                        io.sockets.connected[player.socketId].emit('gameData', {status:'none', data:rooms[cell.roomIndex].data, endgame: true})
                    }else{
                        
                        io.sockets.connected[player.socketId].emit('gameData', {status:'auto', data:rooms[cell.roomIndex].data, endgame: false})
                    }
                }
            )
        }


        
        
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})
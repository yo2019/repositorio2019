//const ChatBase = require('./models/Chat');

const dbConnection = require('../src/config/dbConnection');
module.exports = io => {


  let users = {};

  io.on('connection', async socket => {

///    let messages = await ChatBase.find({}).limit(8).sort('-created');
///    socket.emit('load old msgs', messages);

socket.on('claves',  (data, cb) => {
   const connection = dbConnection();
   let valor1=JSON.parse(JSON.stringify(data));
   connection.query('SELECT * FROM base.tabla WHERE claves =?',[valor1], (err, result) => {
    if(result!=''){
      console.log(result[0].Claves);
      io.sockets.emit('claveP', {
        msg1:result[0].claves
      });      
      cb(result[0].identificador);
     }
   });
});


    socket.on('new user', (data, cb) => {

      //preguntar a mysql si esta el usuario
      const connection = dbConnection();
      if(data){
      let valor1=JSON.parse(JSON.stringify(data));
      connection.query('SELECT * FROM base.tabla WHERE id =?',[valor1], (err, result) => {
        if(result!=''){
          if (data in users) {
            cb(false);
          } else {
            cb(true);
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateNicknames();
          }
    
        }
      });
      };

      //preguntar a mysql si esta el usuario



    });

    // receive a message a broadcasting
    socket.on('send message', async (data, cb) => {
      var msg = data.trim();

      if (msg.substr(0, 3) === '/w ') {
        msg = msg.substr(3);
        var index = msg.indexOf(' ');
        if(index !== -1) {
          var name = msg.substring(0, index);
          var msg = msg.substring(index + 1);
          if (name in users) {
            users[name].emit('whisper', {
              msg,
              nick: socket.nickname
            });
          } else {
            cb('Error! Enter a valid User');
          }
        } else {
          cb('Error! Please enter your message');
        }
      } else {
        var newMsg = new ChatBase({
          msg,
          nick: socket.nickname
        });
        await newMsg.save();

        io.sockets.emit('new message', {
          msg,
          nick: socket.nickname
        });
      }
    });

    // borra a message
    socket.on('borra message', async (data, cb) => {

      ///let m = await ChatBase.remove({nick:'1'}); //solo para Mongo

        //let m = await Chat.remove({nick:'munoz'});
        //let m = await Chat.find({nick:nick});
      });


    // Lee inicio
    socket.on('inicio', async (registro, cb) => {
      const connection = dbConnection();
      let valor1=JSON.parse(JSON.stringify(registro));
      connection.query('SELECT * FROM base.tabla WHERE id =?',[valor1], (err, result) => {
         {

          if(result!=''){
          let dato = JSON.stringify(result);
          let obj = JSON.parse(dato);
          io.sockets.emit('partida', {
             msg:  valor1,
             nick: result[0].Total,
           });
          }


         }

         });
    });

    // Lee MySQL message
    socket.on('Lee MySQL message', async (registro, cb) => {
        const connection = dbConnection();
        let valor1=JSON.parse(JSON.stringify(registro));
        connection.query('SELECT * FROM base.tabla WHERE id =?',[valor1], (err, result) => {
            let dato = JSON.stringify(result);
            let obj = JSON.parse(dato);
            io.sockets.emit('muestra', {
               msg:result[0].Apuesta,
               nick: result[0].Total,
             });
           });
      });

    // Update MySQL message
    socket.on('Update MySQL message', async (data, cb) => {
           const connection = dbConnection();
           connection.query('UPDATE base.tabla SET Apuesta = ?, Total=? WHERE id = ?',['Munoz1','bn',1], (err, result) => {
        });
    });


    socket.on('U1Update', async (data,registro, cb) => {
      registro=socket.nickname;
      const connection = dbConnection();
      let donde=JSON.parse(JSON.stringify(registro));
      var ApuestaNueva = parseInt(data, 10);
      var Tot = 0;
      connection.query('SELECT * FROM base.tabla WHERE id =?',[donde], (err, result) => {
        Tot = parseInt(result[0].Total, 10);
        if (Tot >= ApuestaNueva){Tot = Tot - ApuestaNueva;}else{Tot=0;}
          let Apu=ApuestaNueva.toString();
          let Tota=Tot.toString();
          connection.query('UPDATE base.tabla SET Apuesta = ?, Total=? WHERE id = ?',[Apu,Tota,donde], (err, result) => {
            io.sockets.emit('muestra', {
                msg:  registro,
                nick: Tota
            });
          });

      });

});





    socket.on('disconnect', data => {
      if(!socket.nickname) return;
      delete users[socket.nickname];
      updateNicknames();
    });

    function updateNicknames() {
      io.sockets.emit('usernames', Object.keys(users));
    }
  });

}

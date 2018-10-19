

$(function () {
    
    // socket.io client side connection
    const socket = io.connect();
    let guarda="0";
    let soy="";
    let regre='';
    // obtaining DOM elements from the conversa Interface
    const $messageForm = $('#message-form');
    const $messageForm1 = $('#message-form1');
    const $messageForm2 = $('#message-form2');
    const $messageForm3 = $('#message-form3');
    const $key1 = $('#key1');
    const $key2 = $('#key2');
    const $key3 = $('#key3');
    const $key4 = $('#key4');
    const $U1 = $('#U1');
    const $messageBox = $('#message');
    const $chat = $('#chat');
    const $chat1= $('#chat1');
    const $chat2= $('#chat2');
    const $chat3= $('#chat3');

    // obtaining DOM elements from the NicknameForm Interface
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    // obtaining the usernames container DOM
    const $users = $('#usernames');


    $nickForm.submit(e => {
        e.preventDefault();
        let ingresa=$nickname.val();
        let deja='0';
        socket.emit('claves', ingresa, data => {
          if(ingresa==regre){soy=data};
          {
            socket.emit('new user', soy, data => {
            if(data) {
              socket.emit('inicio', soy, data => {});
              $('#nickWrap').hide();
              $('#contentWrap').show();
            } else {
              $nickError.html(`
                <div class="alert alert-danger">
                  No es posible
                </div>
              `);
            }
          });
        }

});
//***prueba de claves en mysql */
      $nickname.val('');
    });

    // events
    $messageForm.submit( e => {
      e.preventDefault();
      socket.emit('send message', $messageBox.val(), data => {
        $chat.append(`<p class="error">${data}</p>`)
      });
      $messageBox.val('');
    });
    $messageForm1.submit( e => {
      e.preventDefault();
      socket.emit('borra message', $messageBox.val(), data => {
      });
      $messageBox.val('');
    });
    $messageForm2.submit( e => {
      e.preventDefault();
      socket.emit('Lee MySQL message', '1', data => {
      });
      $messageBox.val('');
    });
    $messageForm3.submit( e => {
      e.preventDefault();
      socket.emit('Update MySQL message', $messageBox.val(), data => {
      });
      $messageBox.val('');
    });
    $key1.submit( e => {
      e.preventDefault();
      guarda='100';
      pantalla(guarda);
    });
    $key2.submit( e => {
      e.preventDefault();
      guarda='200';
      pantalla(guarda);
    });
    $key3.submit( e => {
      e.preventDefault();
      guarda='300';
      pantalla(guarda);
    });
    $key4.submit( e => {
      e.preventDefault();
      guarda='400';
      pantalla(guarda);
    });
    $U1.submit( e => {
      e.preventDefault();
      socket.emit('U1Update', guarda,'1', data => {
      });
      $messageBox.val('');
      guarda='0';
      pantalla(guarda);
    });
    socket.on('claveP', data => {
      regre = data.msg1;
    });
    socket.on('new message', data => {
      displayMsg(data);
    });
    socket.on('muestra', data => {
      displayMsg1(data);
    });

    socket.on('partida', data => {
      inicioP(data);
    });

    socket.on('usernames', data => {
      let html = '';
      for(i = 0; i < data.length; i++) {
        html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`; 
      }
      $users.html(html);
    });
    
    socket.on('whisper', data => {
      $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
    });

    socket.on('load old msgs', msgs => {
      for(let i = msgs.length -1; i >=0 ; i--) {
        displayMsg(msgs[i]);
      }
    });

    function displayMsg(data) {
      $chat.html(`<p class="msg"><b>${data.nick}</b>: ${data.msg}</p>`);
    }

    function displayMsg1(data) {
      let quien = data.msg;
      if(quien===soy)
        {
          $chat1.html(`<p class="msg"><b>${data.nick}</b></p>`);
        }
    }
    function inicioP(data) {
      let quien = data.msg;
      if(data.msg===soy)
        {
       $chat1.html(`<p class="msg"><b>${data.nick}</b></p>`);
      }
    }

    function displayMsg2(data) {
      $chat2.html(`<b>${data.nick}</b>: ${data.msg}`);
    }
    function pantalla(data) {
      $chat3.html(`<b>${data}</b>`);
    }
});

import React from 'react';
import io from 'socket.io-client';
import uid from 'uid';
import MessageList from './MessageList';
import Notify from './Notification';

export default class Discussions extends React.Component {

  constructor(props){
    super(props)
    this.state = { messages: [] };
    this._dataValue = this._dataValue.bind(this);
    this._Message = this._Message.bind(this);
    this.user = uid(10);
  }

  componentDidMount(){

    this.socket = io('http://localhost:3000');

    this.socket.on('message', (message) => {
      this._Message(message);
    })

    const textValue = document.getElementById('textarea');
    const btn_send = document.getElementById('btn_send');
    textValue.addEventListener('keypress', event => {
      if ( event.keyCode === 13){
        this._dataValue(textValue);
        event.preventDefault();
      }
    })

    btn_send.addEventListener('click', ev => {
      ev.preventDefault();
      this._dataValue(textValue);
    })

  }

  _dataValue(valueMsj) {
    const avatar = this.props.avatar;
    const username = this.props.username;
    let message = { avatar: avatar, username: username, message: valueMsj.value };

    if ( valueMsj.value !== '' ) {
      this.socket.emit('new-message', message);
      valueMsj.value = '';
      if (document.hidden) Notify(message);
    }
  }

  _Message(message) {
    const contMessage = document.getElementById('MessageList');
    this.state.messages.push( message );
    let MessageGlobal = this.state.messages;
    this.setState({ messages: MessageGlobal });

    contMessage.scrollTop = contMessage.scrollHeight;
  }

  render(){
    return <section className="conversationBody">
      <header className="header-user">
        <figure className="logo">
          <img src="images/logo.png" width="130" height="100" />
        </figure>
        <figure className="avatar">
          <img src={this.props.avatar} width="40" height="40" />
        </figure>
      </header>

      <MessageList
        messages={this.state.messages}/>

      <form className="Message-form" method="POST" onSubmit={this._dataValue}>
        <textarea
          id="textarea"
          rows="1"
          placeholder="Write message..."
          autoComplete="false"
          autoFocus="true"></textarea>
        <button id="btn_send" type="submit">
          <i className="material-icons">send</i>
        </button>
      </form>

    </section>
  }
}

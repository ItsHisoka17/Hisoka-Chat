class User {
  constructor(){
    this.users = [];
    this.bannedUsers = [];
  }
  
  /**
   * @param {{username: string, socket: object}} u
   * @returns {Array<object>}
   */
  addUser(u) {
    this.users.push(u);
    return this.users;
  };

  /**
   * @param {{username: string, socket: object}} u
   * @returns {Array<object>}
   */
  removeUser(u){
    if (this.users.find(user => user===u)){
      this.users.splice(this.users.indexOf(u), 1)
  }
  return this.users;
 };
 /**
  * @param {object} socket
  */
 checkBan(socket){
   if (this.bannedUsers.find(s => s.socket === socket)){
     return this.bannedUsers.find(s => s.socket === socket).reason;
   } else {
     return false;
   }
 };
 /**
  * @param {object} socket
  */
  ban(socket, reason) {
    this.bannedUsers.push({socket, reason});
    setTimeout(() => this.bannedUsers.splice(this.bannedUsers.indexOf(socket), 1), 600000);
  }

  getUsernames(){
    let arrUsernames = [];
    for (let socket of this.users){
        arrUsernames.push(socket.username);
    }
    return arrUsernames;
  }

  getUser(u){
    let user = this.users.find(socket => socket.username===u);
    if (user){
      return user;
    } else {
      return false;
    }
  }

}
module.exports.User = User;
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
    let obj = {};
    obj[u.username] = u.socket;
    this.users.push(obj);
    return this.users;
  };

  /**
   * @param {{username: string, socket: object}} u
   * @returns {Array<object>}
   */
  removeUser(u){
    if (this.users.find(user => Object.keys(user)[0] === u.username)){
      this.users.splice(this.users.indexOf(u), 1);
  }
  return this.users;
 };
 /**
  * @param {object} socket
  */
 checkBan(socket){
   if (this.bannedUsers.find(s => s === socket)){
     return false;
   } else {
     return true;
   }
 };
 /**
  * @param {object} socket
  */
  ban(socket) {
    this.bannedUsers.push(socket);
    setTimeout(() => this.bannedUsers.splice(this.bannedUsers.indexOf(socket), 1), 600000);
  }

}
module.exports.User = User;
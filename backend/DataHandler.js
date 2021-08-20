class User {
  constructor(){
    this.users = [];
  }
  
  /**
   * @param {{username: string, socket: object}} u
   * returns {Array<object>}
   */
  addUser(u) {
    let obj = {};
    obj[u.username] = u.socket;
    this.users.push(obj);
    return this.users;
  }

  /**
   * @param {{username: string, socket: object}} u
   * returns {Array<object>}
   */
  removeUser(u){
    if (this.users.find(user => Object.keys(user)[0] === u.username)){
      this.users.splice(this.users.indexOf(u), 1);
  }
  return this.users;
 }
}
module.exports.User = User;
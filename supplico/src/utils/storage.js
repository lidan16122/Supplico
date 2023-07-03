const Keys = {
    accessToken: "accessToken",
    accessTokenExpires: "accessTokenExpires",
    refreshToken: "refreshToken",
    refreshTokenExpires: "refreshTokenExpires",
    expiresInSeconds : "expiresInSeconds",
    userName: "userName",
    roleID: "roleID",
    userId: "userId",
    fullName: "fullName",
    phoneNumber: "phoneNumber",
    email: "email"
  };
  
  function setItem(name, value) {
    localStorage.setItem(name, value);
  }
  
  function getItem(name) {
    return localStorage.getItem(name);
  }
  
  function removeItem(name) {
    localStorage.removeItem(name);
  }
  
  function setTokensData(tokenData) {
    setItem(Keys.accessToken, tokenData[Keys.accessToken]);
    setItem(Keys.accessTokenExpires, tokenData[Keys.accessTokenExpires]);
    setItem(Keys.refreshToken, tokenData[Keys.refreshToken]);
    setItem(Keys.refreshTokenExpires, tokenData[Keys.refreshTokenExpires]);
    setItem(Keys.expiresInSeconds, tokenData[Keys.expiresInSeconds]);
  }
  //
  function removeTokensData() {
    removeItem(Keys.accessToken);
    removeItem(Keys.accessTokenExpires);
    removeItem(Keys.refreshToken);
    removeItem(Keys.refreshTokenExpires);
    removeItem(Keys.expiresInSeconds);
  }
  
  function setLoginData(userData,tokensData) {
    setTokensData(tokensData);
    setUserData(userData);
  }
  
  function removeLoginData(userData,tokensData) {
    removeTokensData();
    removeUserData();
  }
  
  function setUserData(userData) {
    setItem(Keys.userId, userData[Keys.userId]);
    setItem(Keys.roleID, userData[Keys.roleID]);
    setItem(Keys.userName, userData[Keys.userName]);
    setItem(Keys.fullName, userData[Keys.fullName]);
    setItem(Keys.phoneNumber, userData[Keys.phoneNumber]);
    setItem(Keys.email, userData[Keys.email]);
  }
  
  function removeUserData() {
    removeItem(Keys.userId);
    removeItem(Keys.roleID);
    removeItem(Keys.userName);
    removeItem(Keys.fullName);
    removeItem(Keys.phoneNumber);
    removeItem(Keys.email);
  }
  
  export { setItem, getItem, removeItem,setLoginData,removeLoginData ,Keys};
const generateResetCode = () => {
  // Create a random string of 9 characters long with uppercase, lowercase, and digit values
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let resetCode = "";
  for (let i = 0; i < 9; i++) {
    resetCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return resetCode;
};

console.debug(generateResetCode());
// logout.js
export default logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
};
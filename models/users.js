'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    fullName: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};
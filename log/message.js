const express = require("express");
const mongoose = require("mongoose");
const message = require("../models/logmessages");
const _ = require("lodash");
module.exports = function(sid) {
  const mess = new message({
    to: sid.to
  });
  mess
    .save()
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};

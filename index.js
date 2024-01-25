// const PORT = process.env.PORT || 5000
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = require('./app');
app.use(cors({
  origin:["https://red-psychiatrist-yavby.pwskills.app:3000"],
  credentials:true
}));
app.use(express.json());
app.listen(4000, () => {
  console.log(`Server started on port 4000`);
});
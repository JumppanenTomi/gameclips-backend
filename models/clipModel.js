'use strict';
const pool=require('../database/db');
const promisePool=pool.promise();
const file=require('../utils/file')

const getRandomQuery=async (res) => {
    try {
        const sql='SELECT users.username, clips.id, clips.title, clips.description, clips.url FROM users, clips WHERE users.id = clips.userId ORDER BY RAND()';//get all clips in random order
        const [rows]=await promisePool.query(sql)
        return rows;
    } catch (e) {
        console.error("clip error", e.message);
        res.status(500).send(e.message);
    }
};

const getByGameId=async (id, res) => {
    try {
        const sql='SELECT users.username, clips.id, clips.title, clips.description, clips.url FROM users, clips WHERE users.id = clips.userId AND clips.gameId = ? ORDER BY RAND();';//get all clips of specific game in random order
        const values=[id]
        const [rows]=await promisePool.query(sql, values)
        return rows;
    } catch (e) {
        console.error("clip error", e.message);
        res.status(500).send(e.message);
    }
};

const uploadClip=async (user, data, file, res) => {
    try {
        const sql='insert into clips (userId, title, description, gameId, url) VALUES (?, ?, ?, ?, ?);';//post clip
        const values=[user.id, data.title, data.desc, data.gameId, file];
        const [rows]=await promisePool.query(sql, values);
        return "Successfully uploaded";
    } catch (e) {
        console.error("clip error", e);
        res.status(500).send(e.message);
    }
};


const deleteClip=async (user, data, res) => {
    try {
        console.log(user.id)
        console.log(data.id)
        //getting clip url so we know which file to delete...
        let sql='SELECT * FROM clips WHERE id=? and userId=?;'
        const values=[data.id, user.id];
        const [rows1]=await promisePool.query(sql, values);
        file.deleteAsync("./public/"+rows1[0].url)//..deleting file from public folder

        //deleting all comments that are depending on this clip
        sql='DELETE FROM comments WHERE clipId=?;'
        const deleteValues=[data.id];
        const [rows2]=await promisePool.query(sql, deleteValues);

        //and lastly deleting rest data of clip it self
        sql='DELETE FROM clips WHERE id=? and userId=?;';
        const [rowsFinal]=await promisePool.query(sql, values);

        //if all good we can return following
        if (rowsFinal.affectedRows>0) {
            return "Clip, comments, likes, favorites deleted";
        } else {
            return "Something went wrong"
        }
    } catch (e) {
        console.error("clip error", e.message);
        res.status(500).send(e.message);
    }
};

module.exports={
    getRandomQuery, uploadClip, deleteClip, getByGameId
};
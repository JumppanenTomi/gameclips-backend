'use strict';
const pool=require('../database/db');
const promisePool=pool.promise();

const getCommentsByClipId=async (data, res) => {
    try {
        const sql='SELECT comments.comment, users.username FROM comments, users WHERE comments.userId = users.id AND comments.clipId = ?;';//to get comments posted to specific clip
        const values=[data.id]
        const [rows]=await promisePool.query(sql, values);
        return rows;
    } catch (e) {
        console.error("comment error", e.message);
        res.status(500).send(e.message);
    }
};

const getCommentsByUserId=async (user, res) => {
    try {
        const sql='SELECT comments.comment, users.username FROM comments, users WHERE comments.userId = ?';//to get comments posted by this user
        const values=[user.id]
        const [rows]=await promisePool.query(sql, values);
        return rows;
    } catch (e) {
        console.error("comment error", e.message);
        res.status(500).send(e.message);
    }
};

const addCommentToClipById=async (user, data, res) => {
    try {
        const sql='insert into comments (comment, userId, clipId) VALUES (?, ?, ?);';//to add comment to clip
        const values=[data.comment, user.id, data.id];
        const [rows]=await promisePool.query(sql, values);
        return "Comment posted";
    } catch (e) {
        console.error("comment error", e.message);
        res.status(500).send(e.message);
    }
};

const deleteCommentByCommentId=async (user, data, res) => {
    try {
        const sql='DELETE FROM comments WHERE id=? and userId=?;';//to delete comment
        const values=[data.id, user.id];
        const [rows]=await promisePool.query(sql, values);
        if (rows.affectedRows>0) {
            return "Comment deleted";
        } else {
            return "Something went wrong"
        }
    } catch (e) {
        console.error("comment error", e.message);
        res.status(500).send(e.message);
    }
};

const modifyCommentByCommentId=async (user, data, res) => {
    try {
        const sql='update comments set comment = ? where id = ? and userId = ?';//to modify comment
        const values=[data.comment, data.id, user.id];
        const [rows]=await promisePool.query(sql, values);
        if (rows.affectedRows>0) {
            return "Comment modified";
        } else {
            return "Something went wrong"
        }
    } catch (e) {
        console.error("comment error", e.message);
        res.status(500).send(e.message);
    }
};

module.exports={ getCommentsByClipId, getCommentsByUserId, addCommentToClipById, deleteCommentByCommentId, modifyCommentByCommentId };
'use strict';
const pool=require('../database/db');
const promisePool=pool.promise();

const getAll=async (res) => {
    try {
        const sql='SELECT id, name FROM games ORDER BY name;';//gets list of all games
        const [rows]=await promisePool.query(sql);
        return rows;
    } catch (e) {
        console.error("browse error", e.message);
        res.status(500).send(e.message);
    }
};

const getAllWithClips=async (res) => {
    try {
        const sql='SELECT games.id, games.name FROM games, clips where games.id = clips.gameId GROUP BY games.id;';//gets list of all games that have posted videos
        const [rows]=await promisePool.query(sql);
        return rows;
    } catch (e) {
        console.error("browse error", e.message);
        res.status(500).send(e.message);
    }
};

const search=async (data, res) => {
    try {
        const sql="SELECT * FROM games WHERE name LIKE ?;";//game search engine route
        const values=["%"+data.term+"%"];
        const [rows]=await promisePool.query(sql, values);
        return rows;
    } catch (e) {
        console.error("browse error", e.message);
        res.status(500).send(e.message);
    }
};

module.exports={ getAll, search, getAllWithClips };
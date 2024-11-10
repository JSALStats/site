import { Database } from "bun:sqlite";

import { createChannelTable, insertChannel } from "./db";
const db = new Database("data.db");

const tablesQuery = db.query(
    "SELECT name FROM sqlite_master WHERE type='table';",
);
const tables = tablesQuery.all() as { name: string }[];
let tableData: any[] = [];
let i = 0;

await createChannelTable();

tables.forEach((table: { name: string }) => {
    if (!table.name.includes("history")) {
        const dataQuery = db.query(`SELECT * FROM ${table.name};`);
        const data = dataQuery.all();

        data.forEach((row: any) => {
            tableData.push(row.channel_id);
        });

        console.log(`Data array for table ${table.name}:`, tableData);

        return;
    }
    const dataQuery = db.query(`SELECT * FROM ${table.name};`);
    const data = dataQuery.all();

    console.log(`\nData for table ${table.name}:`, data);
    data.forEach((row: any) => {
        insertChannel(tableData[i], row.subscriber_count, row.time_hit);
    });
    i++;
});

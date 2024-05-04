import {
  Connection,
  createConnection,
  OkPacketParams,
  RowDataPacket,
  QueryError,
} from "mysql2";
import { CrawledData } from "../types/crawler";
import { config } from "dotenv";
config();

export class Database {
  connection: Connection;
  constructor() {
    this.connection = createConnection({
      host: process.env.MYSQL_HOST ?? "localhost",
      user: process.env.MYSQL_USER ?? "root",
      password: process.env.MYSQL_PASS ?? "",
      database: process.env.MYSQL_DATABASE ?? "search",
      port: typeof process.env.PORT === "string" ? parseInt(process.env.PORT) : process.env.PORT ?? 8080
    });
    this.connection.connect((err) => {
      if (err) console.log(err);
    });
  }

  async runQuery<T extends RowDataPacket[] | OkPacketParams>(
    query: string
  ): Promise<T> {
    return new Promise((res, rej) => {
      this.connection.query(query, (err: QueryError, results: T) => {
        if (err) rej(err);
        res(results);
      });
    });
  }

  async overideDomain(
    name: string,
    da: number,
    favicon: string
  ): Promise<number> {
    try {
      const domainExists: RowDataPacket[] = await this.runQuery<
        RowDataPacket[]
      >(`SELECT id FROM domain WHERE name = '${name}'`);
      let id;
      if (Array.isArray(domainExists) && domainExists.length > 0) {
        id = domainExists[0].id;
      } else {
        const response: OkPacketParams = await this.runQuery<OkPacketParams>(
          `INSERT INTO domain (name, da, favicon) VALUES('${name}', ${da}, '${favicon}');`
        );
        id = response.insertId;
      }
      return id;
    } catch (e) {
      console.log(e);
      return -1;
    }
  }

  async insertPage(
    {
      content,
      description,
      heading,
      hlevels,
      keywords,
      score,
      title,
      url,
    }: CrawledData,
    id: number
  ) {
    description = description.slice(0, 249);

    try {
      const response: RowDataPacket[] = await this.runQuery<RowDataPacket[]>(
        `SELECT id FROM page WHERE url = '${url}'`
      );
      if (Array.isArray(response) && response.length > 0) {
        // UPDATE
        const resp: OkPacketParams = await this.runQuery<OkPacketParams>(
          `UPDATE page SET title='${title}', description='${description}', keywords='${keywords}', heading='${heading}', content='${content}', score=${score}, hlevels='${hlevels}', offscore=offscore+1 WHERE url='${url}'`
        );
        if (resp.affectedRows === 0) {
          console.log("RECORD WAS NOT UPDATED");
        }
      } else {
        // INSERT
        const resp: OkPacketParams = await this.runQuery<OkPacketParams>(
          `INSERT INTO page(title, description, keywords, heading, content, score, hlevels, offscore, domain, url) VALUES(
                '${title}',
                '${description}',
                '${keywords}',
                '${heading}',
                '${content}',
                ${score},
                '${hlevels}',
                1,
                '${id}',
                '${url}'
            );`
        );
        if (!resp) {
          console.log("Something Went Wrong");
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  close() {
    this.connection.end((err) => {
      if (err) console.log("ERROR CLOSING DB CONNECTION");
    });
  }
}

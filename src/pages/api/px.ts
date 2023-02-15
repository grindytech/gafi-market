import axios from "axios";
import httpUtil from "http";
import httpsUtil from "https";

import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import { Stream } from "stream";
import { convertIpfsLink } from "../../utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const link = req.query["link"];
  const w = req.query["w"];
  if (!link) res.status(400);
  else {
    const linkDecode = Buffer.from(String(link), "base64").toString();
    const url = convertIpfsLink(linkDecode);
    const header = (await axios.head(url)).headers;
    const contentType = header["content-type"];
    res.setHeader("Content-Type", contentType);
    if (
      contentType.includes("image") &&
      !contentType.includes("gif") &&
      Number(w) > 0
    ) {
      const f = await imageProcess(url, Number(w));
      var readStream = new Stream.PassThrough();
      readStream.end(f);
      readStream.pipe(res);
    } else {
      res.setHeader("location", url).status(301).end();
    }
  }
}

const downloadForward = (
  url: string,
  headers: any,
  resp: NextApiResponse
): Promise<void> =>
  new Promise((resolve, reject) => {
    const http = url.includes("http://") ? httpUtil : httpsUtil;
    if (headers) {
      for (const h of Object.keys(headers)) {
        resp.setHeader(h, headers[h]);
      }
    }
    http
      .get(url, function (response) {
        response
          .pipe(resp)
          .on("finish", () => {
            resolve();
          })
          .on("error", (e) => {
            reject(e);
          });
      })
      .on("error", (e) => {
        reject(e);
      });
  });
async function getFile(url: string): Promise<Buffer> {
  const rs = (
    await axios({
      url: url,
      responseType: "arraybuffer",
    })
  ).data as Buffer;
  return rs;
}
async function imageProcess(url: string, w?: number): Promise<Buffer> {
  const input = await getFile(url);
  let output = input;
  if (w) {
    output = await sharp(input)
      .resize({
        width: w,
      })
      .toBuffer();
  }
  return output;
}

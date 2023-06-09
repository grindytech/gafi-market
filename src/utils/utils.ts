import { format } from "date-fns";
import { customAlphabet } from "nanoid";
import numeral from "numeral";
import configs from "../configs";
import { UserDto } from "../services/types/dtos/UserDto";

interface ContractValueParams {
  amount: number;
  decimal?: number;
}

const trauncateFractionAndFormat = (
  parts: Intl.NumberFormatPart[],
  digits: number
) => {
  return parts
    .map(({ type, value }) => {
      if (type !== "fraction" || !value || value.length < digits) {
        return value;
      }

      let retVal = "";
      for (
        let idx = 0, counter = 0;
        idx < value.length && counter < digits;
        idx++
      ) {
        if (value[idx] !== "0") {
          counter++;
        }
        retVal += value[idx];
      }
      return retVal;
    })
    .reduce((string, part) => string + part);
};

export const formatNumber = (num: number, digits?: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
  });
  return trauncateFractionAndFormat(formatter.formatToParts(num), digits || 6);
};
export const convertToContractValue = ({
  amount,
  decimal = 18,
}: ContractValueParams) => {
  const strVal = "" + amount;
  const afterDot =
    strVal.indexOf(".") > -1 ? strVal.length - strVal.indexOf(".") - 1 : 0;
  const toInteger = strVal.replace(".", "");
  const returnVal = parseInt(toInteger) * 10 ** (decimal - afterDot);
  return returnVal.toLocaleString("fullwide", { useGrouping: false });
};
export const shorten = (hash: string, head?: number, tail?: number) => {
  const n = hash.length;
  return hash.slice(0, head || 10) + "…" + hash.slice(n - (tail || 6));
};

export function countDecimalPlaces(value: number): number {
  if (!Number.isFinite(value)) return 0;

  let e = 1;
  let p = 0;
  while (Math.round(value * e) / e !== value) {
    e *= 10;
    p += 1;
  }
  return p;
}

export function isNotNumber(value: any): boolean {
  return (
    typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)
  );
}

function toNumber(value: any) {
  const num = parseFloat(value);
  return isNotNumber(num) ? 0 : num;
}

export function toPrecision(value: number, precision?: number): string {
  let nextValue: string | number = toNumber(value);
  const scaleFactor = 10 ** (precision ?? 10);
  nextValue = Math.trunc(nextValue * scaleFactor) / scaleFactor;
  return precision ? nextValue.toFixed(precision) : nextValue.toString();
}

function parse(value: string | number) {
  return parseFloat(value.toString().replace(/[^\w.-]+/g, ""));
}

function getDecimalPlaces(value: number, step: number) {
  return Math.max(countDecimalPlaces(step), countDecimalPlaces(value));
}

export function cast(
  value: string | number,
  step: number,
  precision?: number
): string | undefined {
  const parsedValue = parse(value);
  if (Number.isNaN(parsedValue)) return undefined;
  const decimalPlaces = getDecimalPlaces(parsedValue, step);
  return toPrecision(parsedValue, precision ?? decimalPlaces);
}

export const covertToContractValue = ({
  amount,
  decimal = 18,
}: ContractValueParams) => {
  const strVal = "" + amount;
  const afterDot =
    strVal.indexOf(".") > -1 ? strVal.length - strVal.indexOf(".") - 1 : 0;
  const toInteger = strVal.replace(".", "");
  const returnVal = parseInt(toInteger) * 10 ** (decimal - afterDot);
  return returnVal.toLocaleString("fullwide", { useGrouping: false });
};

export const numeralFormat = (
  price: number,
  decimal = 2,
  roundingFunction = Math.floor
) => {
  const decimalAsString = Array(decimal).fill("0").join("");
  const returnStr = numeral(price).format(
    `0,0.[${decimalAsString}]`,
    roundingFunction
  );
  if (returnStr === "NaN") return 0;
  return returnStr;
};
export const numeralFormat1 = (
  price: number,
  decimal = 2,
  roundingFunction = Math.floor
) => {
  const decimalAsString = Array(decimal).fill("0").join("");
  const returnStr = numeral(price).format(
    `0.[${decimalAsString}]`,
    roundingFunction
  );
  if (returnStr === "NaN") return 0;
  return returnStr;
};

export function numberOnly(key: string, amount: string) {
  return !(
    key.match(/[\d.]/g) ||
    (key === "." && amount.indexOf(".") >= 0) ||
    key === "Delete" ||
    key === "Backspace"
  );
}

var htmlEntities: any = {
  nbsp: " ",
  cent: "¢",
  pound: "£",
  yen: "¥",
  euro: "€",
  copy: "©",
  reg: "®",
  lt: "<",
  gt: ">",
  quot: '"',
  amp: "&",
  apos: "'",
};

export function unescapeHTML(str: string) {
  return str.replace(/\\&([^;]+);/g, function (entity, entityCode) {
    var match;
    if (entityCode in htmlEntities) {
      return htmlEntities[entityCode];
    } else if ((match = entityCode.match(/^#x([\da-fA-F]+)$/))) {
      return String.fromCharCode(parseInt(match[1], 16));
    } else if ((match = entityCode.match(/^#(\d+)$/))) {
      return String.fromCharCode(~~match[1]);
    } else {
      return entity;
    }
  });
}

export function formatDate(date?: number | Date) {
  return date ? format(date, "MM/dd/yyyy, HH:mm:ss") : "";
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getUserName(user: UserDto, you?: string, head = 6, tail = 4) {
  return you && user?.address === you
    ? "you"
    : user?.username && user?.username !== user?.address
    ? user?.username
    : shorten(user?.address || "", head, tail);
}

export const toFindDuplicates = (arr: any[]) =>
  arr.filter((item, index) => arr.indexOf(item) !== index);

export function checkIfFilesAreTooBig(files?: [File], mb = 5): boolean {
  let valid = true;
  if (files) {
    Object.values(files).map((file) => {
      const size = file.size / 1024 / 1024;
      if (size > mb) {
        valid = false;
      }
    });
  }
  return valid;
}

export const generateId = () => {
  const nanoid = customAlphabet("1234567890qwertyuiopasdfghjklZxcvbnm", 10);
  return nanoid();
};

export const isETHAddress = (address: string): boolean => {
  const regex = /^(0x)?[0-9a-fA-F]{40}$/;
  return regex.test(address);
};

export const wsCall = (wsUrl: string, dataSend: Object) =>
  new Promise<any>((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.onopen = (event) => {
      ws.send(JSON.stringify(dataSend));
    };
    ws.onmessage = function (event) {
      ws.close();
      const data = JSON.parse(event.data);
      if (!data?.response?.success) {
        reject(data?.response);
      } else {
        resolve(data?.response);
      }
    };
    ws.onerror = (ev) => {
      ws.close();
      reject(ev);
    };
  });

export const getNftImageLink = (id: string, w = 0) =>
  id ? `${configs.ASSETS_SERVICE}/nft-assets/image/${id}?w=${w}` : undefined;
export const getNftAnimationLink = (id: string) =>
  id ? `${configs.ASSETS_SERVICE}/nft-assets/animation/${id}` : undefined;

const ipfsGateway = "https://cf-ipfs.com/ipfs/";
export const convertIpfsLink = (link: string) =>
  link?.replace("ipfs://", ipfsGateway);

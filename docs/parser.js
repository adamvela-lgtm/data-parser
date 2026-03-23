import * as fs from 'fs';
import * as path from 'path';
import { Transform } from 'stream';

class CSVParser extends Transform {
  constructor(options) {
    super(options);
    this.headers = [];
    this.data = [];
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');
    for (let line of lines) {
      const values = line.split(',');
      if (this.headers.length === 0) {
        this.headers = values;
      } else {
        const obj = {};
        for (let i = 0; i < this.headers.length; i++) {
          obj[this.headers[i]] = values[i];
        }
        this.data.push(obj);
      }
    }
    callback();
  }

  _flush(callback) {
    callback();
  }

  getHeaders() {
    return this.headers;
  }

  getData() {
    return this.data;
  }
}

export default class Parser {
  constructor() {
    this.parsers = {};
  }

  addParser(extension, parserClass) {
    this.parsers[extension] = parserClass;
  }

  parseFile(filePath) {
    const fileExtension = path.extname(filePath);
    if (this.parsers[fileExtension]) {
      const parser = new this.parsers[fileExtension]();
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const csvParser = new CSVParser();
      csvParser.write(fileContent);
      csvParser.end();
      return csvParser.getData();
    } else {
      throw new Error(`Unsupported file extension: ${fileExtension}`);
    }
  }
}
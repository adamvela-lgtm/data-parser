import argparse
import logging
from data_parser import config
from data_parser.parsers import csv_parser, json_parser

def main():
    parser = argparse.ArgumentParser(description='Data Parser')
    parser.add_argument('-f', '--file', help='Input file path', required=True)
    parser.add_argument('-t', '--type', help='File type (csv, json)', required=True)
    parser.add_argument('-o', '--output', help='Output file path', required=True)
    args = parser.parse_args()

    if not args.file.endswith(('.csv', '.json')):
        logging.error('Invalid file type')
        return

    try:
        if args.type == 'csv':
            parser = csv_parser.CsvParser(args.file, args.output)
        elif args.type == 'json':
            parser = json_parser.JsonParser(args.file, args.output)
        else:
            logging.error('Invalid file type')
            return

        parser.parse()
    except Exception as e:
        logging.error(e)

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    main()
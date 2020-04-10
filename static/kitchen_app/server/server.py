from flask import Flask, request, jsonify
import json
import flask
import os
from flask_cors import CORS
'''
JSON
[{
	unit: 'fridge'
	foods: [
		{
			name:
			expiry:
		},
	]
}]
'''

'''
CSV
Fridge, , Freezer, , Pantry, 
name, expiry, name, expiry, name, expiry
...
'''


CSV_NAME = "static/kitchen_app/server/data/kitchen_contents.csv"


def process_kitchen_model():
	resp = flask.Response()
	resp.mimetype = 'application/json'
	if not os.path.exists("data"):
			os.makedirs("data")
	if request.method == 'POST':
		json_body = request.get_json(force=True)
		data = json_body['data']
		csv_string = write_data_to_kitchen_csv_string(data)
		with open(CSV_NAME, 'w+') as csv:
			csv.write(csv_string)
			csv.truncate()
	elif request.method == 'GET':
		data = read_data_from_kitchen_csv()
		json_data = {"data" : data}
		resp.data = json.dumps(json_data)
	else:
		print(request)
	return resp


def read_data_from_kitchen_csv():
	data = []
	if not os.path.exists(CSV_NAME):
		open(CSV_NAME, 'w+')

	with open(CSV_NAME, 'r+') as csv:
		csv.seek(0)
		header = csv.readline()
		headings = header.split(',')[:-1]
		print(headings)
		for i in range(0, len(headings), 2):
			heading = headings[i]
			unit = {"unit": heading, "foods":[]}
			data.append(unit)
		for line in csv:
			elements = line.split(',')[:-1]

			for i, element in enumerate(elements):
				if i % 2 != 0:
					continue
				if element == '' or element == '\n':
					continue
				date = elements[i + 1]
				food = {"name": element, "expiry": date}
				data[i/2]['foods'].append(food)
		return data

def write_data_to_kitchen_csv_string(data):
	#only one csv, no need for filename
	csv_content = ""
	eof = False
	food_idx = 0
	for unit in data:
		csv_content += "{},Expiry,".format(unit['unit'])
	csv_content += '\n'
	while not eof:
		eof = True
		for unit_idx, unit in enumerate(data):
			foods = unit['foods']
			if food_idx < len(foods):
				food = foods[food_idx]
				# end_of_line = "" if unit_idx == len(data) - 1 else ","
				csv_content += "{},{},".format(food['name'], food['expiry'])
				eof = False
			else:
				csv_content += ",,"
		if not eof:
			csv_content += '\n'
			food_idx += 1
	return csv_content
from flask import Flask, request, jsonify, render_template
import flask
from flask_cors import CORS
import json
import glob
import os
import urllib
import requests


template_path = os.path.abspath("../budget-tracker/build")
app = Flask(__name__, static_url_path="", static_folder=template_path, template_folder=template_path)
CORS(app)

'''
{
	filename: "asdf"
	data: [{
			name: "category",
			transactions: [{
					title: bananas
					cost: $4.50
			}]
		  }]
	monthlies: [{
			name: "Monthlies",
			transactions: [{
					title: Netflix
					cost: $10
			}]
	}]
}

'''

@app.route('/budget_app')
def show_budget():
	return render_template('index.html')

@app.route('/budget', methods=['POST', 'GET'])
# @app.route('/model/<fname>', methods=['GET'])
#@crossdomain(origin='*')
def process_model(fname=None):

	resp = flask.Response()
	resp.mimetype = 'application/json'
	if request.method == 'POST':
		json_body = request.get_json(force=True)
		filename = json_body['filename']
		data = json_body['data']
		monthlies = json_body['monthlies']
		csv_string = write_data_to_csv_string(data)
		csv_monthlies = write_data_to_csv_string(monthlies)
		if not os.path.exists("budgets"):
			os.makedirs("budgets")
		with open("budgets/"+ filename + ".csv", 'w+') as csv:
			csv.write(csv_string)
			csv.truncate()
		with open("budgets/monthlies.csv", 'w+') as csv_month:
			csv_month.write(csv_monthlies)
			csv_month.truncate()
		# return resp
	elif request.method == 'GET':
		fname = request.args.get('filename')
		if not fname:
			json_data = {"Error": "Please enter valid filename"}
			resp.data = json.dumps(json_data)
			return resp
		data = read_data_from_csv(fname)
		monthlies = read_data_from_csv("monthlies")
		json_data = {"data": data, "monthlies": monthlies}
		resp.data = json.dumps(json_data)
		# return resp
	else:
		print request

	return resp

def read_data_from_csv(filename):
	data = []
	if not os.path.exists("budgets/" + filename + ".csv"):
		open("budgets/" + filename + ".csv", 'w+')
		
	with open("budgets/" + filename + ".csv", 'r+') as csv:
		csv.seek(0)
		header = csv.readline()
		headings = header.split(",")
		for i in range(0, len(headings), 2):
			heading = headings[i]
			category = {"name": heading, "transactions": []}
			data.append(category)
		for line in csv:
			# print line
			elements = line.split(',')
			# print elements
			for i, element in enumerate(elements):
				if i % 2 != 0:
					continue
				if element == '' or element == '\n':
					continue
				c = elements[i + 1]
				transaction = {"title": element, "cost": float(c)}
				data[i/2]['transactions'].append(transaction)
	return data

def write_data_to_csv_string(data):
	csv_content = "" #"data:text/csv;charset=utf-8"
	#first loop add all category headers and find largest txn array
	longest_txn_len = 0

	for i, category in enumerate(data):
		cat_name = category['name']
		cat_txns = category['transactions']
		cat_len = len(cat_txns)
		csv_content += cat_name + ",Cost" + ("" if i == len(data) - 1 else ",")
		if cat_len > longest_txn_len:
			longest_txn_len = cat_len
	csv_content += "\n"

	#loop over length of largest txn array over all categories, add txns if they exist
	for i in range(longest_txn_len):
		for j, category in enumerate(data):
			transactions = category['transactions']
			if i < len(transactions):
				transaction = category['transactions'][i]
				csv_content += transaction['title'] + "," + str(transaction['cost']) + \
									("" if j == len(data) - 1 else ",")
			else:
				csv_content += ",,"
		csv_content += "\n"
	return csv_content



if __name__ == '__main__':
	app.run(host='127.0.0.1', port=4323)




from flask import Flask, request, jsonify
import json
import flask
import os
from flask_cors import CORS
'''
JSON

'''


PROJECT_FILENAME = "static/project_app/server/data/projects.json"


def process_project_model():
  resp = flask.Response()
  resp.mimetype = 'application/json'
  if not os.path.exists("data"):
      os.makedirs("data")
  if request.method == 'POST':
    json_body = request.get_json(force=True)
    data = json_body['data']
    json_string = json.dumps(data)
    with open(PROJECT_FILENAME, 'w+') as json_file:
      json_file.write(json_string)
      json_file.truncate()
  elif request.method == 'GET':
    data = read_data_from_project_json()
    json_data = {"data" : data}
    resp.data = json.dumps(json_data)
  else:
    print(request)
  return resp


def read_data_from_project_json():
  data = []
  if not os.path.exists(PROJECT_FILENAME):
    new_file = open(PROJECT_FILENAME, 'w+')
    new_file.write("{}")
    new_file.close()

  with open(PROJECT_FILENAME, 'r+') as json_file:
    json_file.seek(0)
    json_string = json_file.read()
    data = json.loads(json_string)
    return data